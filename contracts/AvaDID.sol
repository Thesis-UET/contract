//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AvaDID {
    struct DIDStruct {
        string data;
        address walletAddr;
    }
    mapping(string => DIDStruct) private data;
    mapping(address => bool) public usedWallet;
    mapping(string => bool) public usedDID;

    // issuer -> credentialSchemas
    mapping(string => string) public dataCredSchemas;
    //issuer => isRevoke cred
    mapping(string => mapping(uint256 => bool)) public isRevokeCred;

    function setUpDIDIssuer(
        string memory did,
        string memory _data,
        address _wallet
    ) public {
        require(!usedWallet[_wallet], "Used");
        require(!usedDID[did], "Used");
        usedWallet[_wallet] = true;
        data[did] = DIDStruct(_data, _wallet);
    }

    function createCreSchemas(
        string memory did,
        string memory _schemas
    ) public {
        require(
            data[did].walletAddr == msg.sender,
            "Only issuer can add Schemas"
        );

        dataCredSchemas[did] = _schemas;
    }

    function revokeStatusCred(uint256 credId, string memory did) public {
        require(
            data[did].walletAddr == msg.sender,
            "Only issuer can revoke Cred"
        );

        require(!isRevokeCred[did][credId], "Already revoke");
        isRevokeCred[did][credId] = true;
    }
}
