// SPDX-License-Identifier: MIT
import "./Roles.sol";
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Permissions {
    Roles public myRoles;
    uint public permissionCount;
    uint public fileCount = 0;

    constructor(address contractAddress) {
        myRoles = Roles(contractAddress);
    }

    //Struct for a single file with permissions
    struct File {
        string fileId;
        mapping(address => bool) permission;
        mapping(address => string) permissionHash;
        mapping(uint => address) addressNumbering;
        address[] addresses;
        uint addressNum;
        address patientID;
    }

    mapping(uint256 => File) public files; //All files go in this mapping

    function initializeFile(uint n) public {
        files[n].addressNum = 0;
    }

    //Initializing a file (Called from IPFS.sol)
    function setFile(string calldata fileId, address pID) external {
        files[fileCount].fileId = fileId;
        files[fileCount].patientID = pID;
        initializeFile(fileCount);
        fileCount += 1;
    }

    //Return fileHash
    function getFile(uint n) external view returns (string memory) {
        return (files[n].fileId);
    }

    //Function to get all the values in the mapping
    function getAll(uint n) public view returns (bool[] memory) {
        bool[] memory ret = new bool[](files[n].addressNum);
        for (uint i = 0; i < files[n].addressNum; i++) {
            ret[i] = files[n].permission[
                files[n].addressNumbering[files[n].addressNum]
            ];
        }
        return ret;
    }

    function addPatient(address id, string calldata role) external {
        myRoles.addPatient(id, role);
    }

    //Function to get all the keys in the mapping
    function getAddress(uint n) public view returns (address[] memory) {
        return files[n].addresses;
    }

    //get all files that a doctor have permission to
    function getPermissionFilesbyDoctor(
        address doctorId
    ) public view returns (string[] memory) {
        uint size = 0;
        for (uint i = 0; i < fileCount; i++) {
            if (files[i].permission[doctorId] == true) {
                size++;
            }
        }
        string[] memory filesHashesDoc = new string[](size);
        uint a = 0;
        for (uint i = 0; i < fileCount; i++) {
            if (files[i].permission[doctorId] == true) {
                filesHashesDoc[a] = files[i].permissionHash[doctorId];
                a++;
            }
        }
        return filesHashesDoc;
    }

    //get original file of permissioned file
    function getFilesHashByPermissionedHash(
        string memory pHash,
        address doctorId
    ) public view returns (string memory) {
        string memory returnFilesHash = "";
        for (uint i = 0; i < fileCount; i++) {
            if (files[i].permission[doctorId] == true) {
                if (stringsEquals(files[i].permissionHash[doctorId], pHash)) {
                    returnFilesHash = files[i].fileId;
                    break;
                }
            }
        }
        return returnFilesHash;
    }

    //get all files of a certain patient
    function getAllFilesbyPatient(
        address patientId
    ) public view returns (string[] memory) {
        uint size = 0;
        for (uint i = 0; i < fileCount; i++) {
            if (files[i].patientID == patientId) {
                size++;
            }
        }
        string[] memory filesHashesDoc = new string[](size);

        uint a = 0;
        for (uint i = 0; i < fileCount; i++) {
            if (files[i].patientID == patientId) {
                filesHashesDoc[a] = files[i].fileId;
                a++;
            }
        }
        return filesHashesDoc;
    }

    //get file owner
    function getFilePatient(uint256 number) public view returns (address) {
        return files[number].patientID;
    }

    //Function to grant permission
    function grantPermission(
        uint n,
        address docID,
        address origin,
        string memory pHash
    ) external {
        //Origin is the caller of the function
        require(files[n].patientID == origin); //Caller of function should be the owner of the file
        require(
            stringsEquals(myRoles.returnRole(origin), "Patient"),
            "Not authorized"
        ); //Owner of the file must be a patient
        files[n].permission[docID] = true; //True in mapping if permission given
        files[n].permissionHash[docID] = pHash;
        files[n].addresses.push(docID);
        permissionCount += 1;
        files[n].addressNumbering[files[n].addressNum] = docID;
        files[n].addressNum += 1;
    }

    //function to revoke permission
    function revokePermission(uint n, address docID, address origin) external {
        require(files[n].patientID == origin);
        require(
            stringsEquals(myRoles.returnRole(origin), "Patient"),
            "Not authorized"
        );
        files[n].permission[docID] = false; //false if permission revoked
        files[n].permissionHash[docID] = "";
    }

    function getPermission(uint n, address docID) external view returns (bool) {
        return files[n].permission[docID]; //return the permission against an address
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
