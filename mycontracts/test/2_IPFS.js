var IPFS = artifacts.require("./IPFS.sol");
var Permission = artifacts.require("./Permissions.sol");
var Roles = artifacts.require("Roles.sol");

const truffleAssert = require('truffle-assertions');


contract("IPFS", function(accounts) {
 it("Should return file type of the file", async ()=> {
    const instance = await IPFS.deployed();
    await instance.addFile('1',"DoctorNote",accounts[2]);
    const value = await instance.getFileType(await instance.getFileNumByID('1'));

    assert.equal(value, 'DoctorNote');
  });

  it("Should return doctorID of the file", async ()=> {
    const instance = await IPFS.deployed();
    await instance.addFile('1',"DoctorNote",accounts[2]);
    const value = await instance.getFileDID(await instance.getFileNumByID('1'));

    assert.equal(value, accounts[2]);
  });

  it("Should return an error file not found", async ()=> {
    const instance = await IPFS.deployed();
    await truffleAssert.reverts(instance.getFileType(567) , "File doesnot exist");
    
   
  });

  it("Should return an error file not found", async ()=> {
    const instance = await IPFS.deployed();
    await truffleAssert.reverts(instance.getFileDID(567) , "File doesnot exist");
   
  });

});

