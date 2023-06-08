var Roles = artifacts.require("Roles.sol");

const truffleAssert = require('truffle-assertions');

contract("Roles", function (accounts) {
    it("Should return the role of doctor", async () => {
      const instance = await Roles.deployed();
      await instance.addDoctor(accounts[2], "Doctor");
  
      let value = await instance.returnRole(accounts[2]);
      assert.equal(value, 'Doctor');
  
    });
  
    it("Should return the role of patient", async () => {
      const instance = await Roles.deployed();
      await instance.addPatient(accounts[1], "Patient");
  
      let value = await instance.returnRole(accounts[1]);
      assert.equal(value, 'Patient');
    });
  
    it("Should return the error of role not found", async () => {
      const instance = await Roles.deployed();
  
      let value = await instance.returnRole(accounts[9]);
      assert.equal(value, '');
    });
  
    it("Should return the error that doctor already exist", async () => {
      const instance = await Roles.deployed();
      await truffleAssert.reverts(instance.addDoctor(accounts[2], "Doctor"), "Doctor Already Exist");
    });
  
    it("Should return the error that patient already exist", async () => {
      const instance = await Roles.deployed();
      await truffleAssert.reverts(instance.addPatient(accounts[1], "Patient"), "Patient Already Exist");
    });
  });