// SPDX-License-Identifier: MIT
import "./Permissions.sol";
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract IPFS {
    mapping(uint256 => File) public files;
    uint public fileNum;
    uint public num = 0;

    struct File {
        string fileId;
        string fileType;
        address doctorID;
    }

    Permissions public myPermissions;

    constructor(address contractAddress) {
        myPermissions = Permissions(contractAddress);
    }

    File file;

    //Functions to add files

    function addFile(
        string memory fileId,
        string memory fileType,
        address doctorID
    ) public {
        files[num].fileId = fileId;
        files[num].fileType = fileType;
        files[num].doctorID = doctorID;
        fileNum += 1;
        num += 1;
    }

    function setFile(
        string memory fileId,
        address pID,
        string memory fileType,
        address doctorID
    ) public {
        // uint i=getFileNumByID(fileId);
        myPermissions.setFile(fileId, pID);
        // (file.fileId)=myPermissions.getFile(i);
        addFile(fileId, fileType, doctorID);
    }

    //Functions to add vital files

    function addVitalFile(string memory fileId, string memory fileType) public {
        files[num].fileId = fileId;
        files[num].fileType = fileType;
        fileNum += 1;
        num += 1;
    }

    function setVitalFile(
        string memory fileId,
        address pID,
        string memory fileType
    ) public {
        // uint i=getFileNumByID(fileId);
        myPermissions.setFile(fileId, pID);
        // (file.fileId)=myPermissions.getFile(i);
        addVitalFile(fileId, fileType);
    }

    //Grants permission, invokes function of permissions.sol

    function grantPermission(
        string memory fileId,
        address docID,
        string memory pHash
    ) public {
        uint i = getFileNumByID(fileId);
        myPermissions.grantPermission(i, docID, msg.sender, pHash);

        // files[i].permission[docID]=true;
        // permissionCount+=1;
    }

    function revokePermission(string memory fileId, address docID) public {
        uint i = getFileNumByID(fileId);
        myPermissions.revokePermission(i, docID, msg.sender);

        // files[i].permission[docID]=false;
    }

    //Get permission of a file for a certain doctor
    function getPermission(
        string memory fileId,
        address docID
    ) public view returns (bool) {
        uint fileNumber = getFileNumByID(fileId);
        return myPermissions.getPermission(fileNumber, docID);
    }

    //Find the number of the file by its hash
    function getFileNumByID(string memory fileId) public view returns (uint) {
        // uint nil = 0;
        for (uint i = 0; i < fileNum; i++) {
            if (stringsEquals(files[i].fileId, fileId)) {
                return i;
            }
        }
        revert("File doesnot exist");
    }

    //All the getters for file attributes
    function getFileID(uint256 number) public view returns (string memory) {
        return files[number].fileId;
        
    }

    function getFileType(uint256 number) public view returns (string memory) {
        if(stringsEquals(files[number].fileType, '')){
            revert("File doesnot exist");
        }
        return files[number].fileType;
    }

    function getFileDID(uint256 number) public view returns (address) {
        if(files[number].doctorID==address(0)){
            revert("File doesnot exist");
        }
        return files[number].doctorID;
    }

    function stringsEquals(
        string memory s1,
        string memory s2
    ) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;
        for (uint256 i = 0; i < l1; i++) {
            if (b1[i] != b2[i]) return false;
        }
        return true;
    }
}
