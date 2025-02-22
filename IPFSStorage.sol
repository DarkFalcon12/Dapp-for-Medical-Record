// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPFSStorage {
    string public ipfsHash;

    function storeIPFSHash(string memory _ipfsHash) public {
        ipfsHash = _ipfsHash;
    }

    function retrieveIPFSHash() public view returns (string memory) {
        return ipfsHash;
    }
}
