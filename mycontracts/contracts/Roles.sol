// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Roles {
    struct Doctor {
        address doctorid;
    }

    Doctor[] public doctors;

    struct Patient {
        address patientid;
    }

    Patient[] public patients;

    mapping(address => string) public roles;
    uint public roleCounter = 0;

    function returnRole(address id) external view returns (string memory) {
        return roles[id];
    }

    function addDoctor(address id, string calldata role) external {
        Doctor memory d = Doctor(id);
        doctors.push(d);
        roles[id] = role;
        roleCounter += 1;
    }

    function getDoctor(address id) external view returns (string memory) {
        return roles[id];
    }

    function loginDoctor(address id) external view returns (bool) {
        uint i;
        for (i = 0; i < doctors.length; i++) {
            Doctor memory d = doctors[i];
            if (d.doctorid == id) {
                return true;
            }
        }
        return false;
    }

    function addPatient(address id, string calldata role) external {
        Patient memory p = Patient(id);
        patients.push(p);
        roles[id] = role;
        roleCounter += 1;
    }

    function getPatient(address id) external view returns (string memory) {
        return roles[id];
    }

    function loginPatient(address id) external view returns (bool) {
        uint i;
        for (i = 0; i < patients.length; i++) {
            Patient memory p = patients[i];
            if (p.patientid == id) {
                return true;
            }
        }
        return false;
    }

    function getAllDoctors() public view returns (address[] memory) {
        address[] memory allDoctors = new address[](doctors.length);
        uint i;
        for (i = 0; i < doctors.length; i++) {
            allDoctors[i] = doctors[i].doctorid;
        }
        return allDoctors;
    }
}
