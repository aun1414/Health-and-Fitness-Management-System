var IPFS = artifacts.require("./IPFS.sol");
var Permission = artifacts.require("./Permissions.sol");
var Roles = artifacts.require("Roles.sol");

const truffleAssert = require('truffle-assertions');


contract("Permission", function (accounts) {


    it("Grant Permission", async () => {
        const instance = await Permission.deployed();
        await instance.addPatient(accounts[3], "Patient");
        await instance.setFile('1', accounts[3]);
        await instance.grantPermission(0, accounts[2], accounts[3], "xyz");

        const value = await instance.getPermission(0, accounts[2]);

        assert.equal(value, true);
    });

    it("Grant Permission from invalid Patient", async () => {
        const instance = await Permission.deployed();
        await instance.setFile('1', accounts[3]);
        await truffleAssert.reverts(instance.grantPermission(0, accounts[2], accounts[9], "xyz"), "Not Authorized");

    });

    it("Revoke Permission", async () => {
        const instance = await Permission.deployed();
        await instance.addPatient(accounts[4], "Patient");
        await instance.setFile('1', accounts[4]);
        await instance.revokePermission(0, accounts[2], accounts[3]);

        const value = await instance.getPermission(0, accounts[2]);

        assert.equal(value, false);
    });

    it("Revoke Permission from invalid Patient", async () => {
        const instance = await Permission.deployed();
        await instance.setFile('1', accounts[3]);
        await truffleAssert.reverts(instance.revokePermission(0, accounts[2], accounts[9]), "Not Authorized");

       
    });

    it("Get Permisions when granted", async () => {
        const instance = await Permission.deployed();
        await instance.setFile('1', accounts[3]);
        await instance.grantPermission(0, accounts[2], accounts[3], "xyz");

        const value = await instance.getPermission(0, accounts[2]);

        assert.equal(value, true);
    });

    it("Get Permisions when not granted", async () => {
        const instance = await Permission.deployed();
        await instance.setFile('1', accounts[4]);

        const value = await instance.getPermission(0, accounts[6]);

        assert.equal(value, false);
    });


});

