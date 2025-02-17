// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NDAOLogicV1.sol';

contract NDAOLogicV1Harness is NDAOLogicV1 {
    function initialize(
        address timelock_,
        address npunks_,
        address cryptopunksVote_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'PunksDAO::initialize: admin only');
        require(address(timelock) == address(0), 'PunksDAO::initialize: can only initialize once');

        timelock = IDAOExecutor(timelock_);
        npunks = NTokenLike(npunks_);
        cryptopunksVote = CryptopunksVote(cryptopunksVote_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
