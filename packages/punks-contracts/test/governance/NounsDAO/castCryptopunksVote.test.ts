import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import hardhat from 'hardhat';

const { ethers } = hardhat;

import { BigNumber as EthersBN } from 'ethers';

import {
  deployNToken,
  deployCryptopunksVote,
  getSigners,
  TestSigners,
  setTotalSupply,
  populateDescriptorV2,
  populateSeeder,
} from '../../utils';

import { mineBlock, address, encodeParameters } from '../../utils';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  NToken,
  CryptopunksMock,
  CryptopunksVote,
  NDescriptorV2__factory as NDescriptorV2Factory,
  NSeeder__factory as NSeederFactory,
  NDAOLogicV1Harness,
  NDAOLogicV1Harness__factory as NDaoLogicV1HarnessFactory,
  NDAOProxy__factory as NDaoProxyFactory,
} from '../../../typechain';

chai.use(solidity);
const { expect } = chai;

async function deployGovernor(
  deployer: SignerWithAddress,
  tokenAddress: string,
  cryptopunksVoteAddress: string,
): Promise<NDAOLogicV1Harness> {
  const { address: govDelegateAddress } = await new NDaoLogicV1HarnessFactory(
    deployer,
  ).deploy();
  const params: Parameters<NDaoProxyFactory['deploy']> = [
    address(0),
    tokenAddress,
    cryptopunksVoteAddress,
    deployer.address,
    address(0),
    govDelegateAddress,
    17280,
    1,
    1,
    1,
  ];

  const { address: _govDelegatorAddress } = await (
    await ethers.getContractFactory('NDAOProxy', deployer)
  ).deploy(...params);

  return NDaoLogicV1HarnessFactory.connect(_govDelegatorAddress, deployer);
}

let snapshotId: number;

let token: NToken;
let cryptopunks: CryptopunksMock;
let cryptopunksVote: CryptopunksVote;
let deployer: SignerWithAddress;
let account0: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;
let signers: TestSigners;

let gov: NDAOLogicV1Harness;
let targets: string[];
let values: string[];
let signatures: string[];
let callDatas: string[];
let proposalId: EthersBN;

async function reset() {
  if (snapshotId) {
    await ethers.provider.send('evm_revert', [snapshotId]);
    snapshotId = await ethers.provider.send('evm_snapshot', []);
    return;
  }
  token = await deployNToken(signers.deployer);
  ({cryptopunks, cryptopunksVote} = await deployCryptopunksVote(deployer));

  await populateDescriptorV2(
    NDescriptorV2Factory.connect(await token.descriptor(), signers.deployer),
  );

  await populateSeeder(
    NSeederFactory.connect(await token.seeder(), signers.deployer),
  );

  for (let i = 0 ; i < 10; i ++) {
    await cryptopunks.mint(deployer.address);
    await cryptopunksVote.connect(deployer).delegate(deployer.address, i);
  }

  gov = await deployGovernor(deployer, token.address, cryptopunksVote.address);
  snapshotId = await ethers.provider.send('evm_snapshot', []);
}

async function propose(proposer: SignerWithAddress) {
  targets = [account0.address];
  values = ['0'];
  signatures = ['getBalanceOf(address)'];
  callDatas = [encodeParameters(['address'], [account0.address])];

  await gov.connect(proposer).propose(targets, values, signatures, callDatas, 'do nothing');
  proposalId = await gov.latestProposalIds(proposer.address);
}

describe('NDAO#castCyptopunksVote', () => {
  before(async () => {
    signers = await getSigners();
    deployer = signers.deployer;
    account0 = signers.account0;
    account1 = signers.account1;
    account2 = signers.account2;
  });

  describe('We must revert if:', () => {
    before(async () => {
      await reset();
      await propose(deployer);
    });

    it("There does not exist a proposal with matching proposal id where the current block number is between the proposal's start block (exclusive) and end block (inclusive)", async () => {
      await expect(gov.castVote(proposalId, 1)).revertedWith(
        'NDAO::castVoteInternal: voting is closed',
      );
    });

    it('Such proposal already has an entry in its voters set matching the sender', async () => {
      await mineBlock();
      await mineBlock();

      await cryptopunksVote.connect(deployer).delegate(account0.address, 0);
      await cryptopunksVote.connect(deployer).delegate(account1.address, 1);

      await gov.connect(account0).castVote(proposalId, 1);

      await gov.connect(account1).castVoteWithReason(proposalId, 1, '');

      await expect(gov.connect(account0).castVote(proposalId, 1)).revertedWith(
        'NDAO::castVoteInternal: voter already voted',
      );
    });
  });

  describe('Otherwise', () => {
    it("we add the sender to the proposal's voters set", async () => {
      const voteReceipt1 = await gov.getReceipt(proposalId, account2.address);
      expect(voteReceipt1.hasVoted).to.equal(false);

      await gov.connect(account2).castVote(proposalId, 1);
      const voteReceipt2 = await gov.getReceipt(proposalId, account2.address);
      expect(voteReceipt2.hasVoted).to.equal(true);
    });

    describe("and we take the balance returned by GetPriorVotes for the given sender and the proposal's start block, which may be zero,", () => {
      let actor: SignerWithAddress; // an account that will propose, receive tokens, delegate to self, and vote on own proposal

      before(reset);

      it('and we add that ForVotes', async () => {
        actor = account0;

        await cryptopunksVote.connect(deployer).delegate(actor.address, 0);
        await cryptopunksVote.connect(deployer).delegate(actor.address, 1);
        await propose(actor);

        const beforeFors = (await gov.proposals(proposalId)).forVotes;
        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 1);

        const afterFors = (await gov.proposals(proposalId)).forVotes;

        const balance = (await token.balanceOf(actor.address)).add(await cryptopunksVote.getCurrentVotes(actor.address)).toString();

        expect(afterFors).to.equal(beforeFors.add(balance));
      });

      it("or AgainstVotes corresponding to the caller's support flag.", async () => {
        actor = account1;
        await cryptopunksVote.connect(deployer).delegate(actor.address, 2);
        await cryptopunksVote.connect(deployer).delegate(actor.address, 3);

        await propose(actor);

        const beforeAgainst = (await gov.proposals(proposalId)).againstVotes;

        await mineBlock();
        await gov.connect(actor).castVote(proposalId, 0);

        const afterAgainst = (await gov.proposals(proposalId)).againstVotes;

        const balance = (await token.balanceOf(actor.address)).add(await cryptopunksVote.getCurrentVotes(actor.address)).toString();

        expect(afterAgainst).to.equal(beforeAgainst.add(balance));
      });
    });
  });
});
