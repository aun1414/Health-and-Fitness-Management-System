exports.SIMP_STORAGE_ROLES_ADDRESS =
'0x9d2baE7b05E962c098E1c21C318AA7f49F543335'
exports.SIMP_STORAGE_ROLES_ABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "doctors",
        "outputs": [
          {
            "internalType": "address",
            "name": "doctorid",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "patients",
        "outputs": [
          {
            "internalType": "address",
            "name": "patientid",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "roleCounter",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "roles",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          }
        ],
        "name": "returnRole",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          }
        ],
        "name": "addDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          }
        ],
        "name": "getDoctor",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          }
        ],
        "name": "loginDoctor",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          }
        ],
        "name": "addPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          }
        ],
        "name": "getPatient",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "id",
            "type": "address"
          }
        ],
        "name": "loginPatient",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "getAllDoctors",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
  
]

exports.SIMP_STORAGE_PERMISSIONS_ADDRESS =
'0x023DAc7Cd039ae533D1FB962F7FdAcFE5376bAb8'
exports.SIMP_STORAGE_PERMISSIONS_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "fileCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "files",
    "outputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "addressNum",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "patientID",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "myRoles",
    "outputs": [
      {
        "internalType": "contract Roles",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "permissionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      }
    ],
    "name": "initializeFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "pID",
        "type": "address"
      }
    ],
    "name": "setFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      }
    ],
    "name": "getFile",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      }
    ],
    "name": "getAll",
    "outputs": [
      {
        "internalType": "bool[]",
        "name": "",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      }
    ],
    "name": "getAddress",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctorId",
        "type": "address"
      }
    ],
    "name": "getPermissionFilesbyDoctor",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "pHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "doctorId",
        "type": "address"
      }
    ],
    "name": "getFilesHashByPermissionedHash",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "patientId",
        "type": "address"
      }
    ],
    "name": "getAllFilesbyPatient",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "origin",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "pHash",
        "type": "string"
      }
    ],
    "name": "grantPermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "origin",
        "type": "address"
      }
    ],
    "name": "revokePermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "n",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      }
    ],
    "name": "getPermission",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }          
]




exports.SIMP_STORAGE_IPFS_ADDRESS =
'0x46e0E731B76326d1B7cF35ce0457364dEC20CcDb'
exports.SIMP_STORAGE_IPFS_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "fileNum",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "files",
    "outputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "doctorID",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "myPermissions",
    "outputs": [
      {
        "internalType": "contract Permissions",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "num",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "doctorID",
        "type": "address"
      }
    ],
    "name": "addFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "pID",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "doctorID",
        "type": "address"
      }
    ],
    "name": "setFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      }
    ],
    "name": "addVitalFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "pID",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      }
    ],
    "name": "setVitalFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "pHash",
        "type": "string"
      }
    ],
    "name": "grantPermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      }
    ],
    "name": "revokePermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "docID",
        "type": "address"
      }
    ],
    "name": "getPermission",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "doctorID",
        "type": "address"
      }
    ],
    "name": "returnFile",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileId",
        "type": "string"
      }
    ],
    "name": "getFileNumByID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "getFileID",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "getFileType",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "getFileDID",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]