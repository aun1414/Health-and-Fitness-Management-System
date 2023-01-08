var IPFS = artifacts.require("./IPFS.sol");
var Permission = artifacts.require("./Permissions.sol");
var Roles = artifacts.require("Roles.sol");

contract("IPFS", function(accounts) {
    it("Should return ID of the file", async ()=> {
        const instance = await IPFS.deployed();
        await instance.addFile('1',"Note",accounts[0]);
        const value = await instance.getFileID(0);
       
        assert.equal(value, '1');
      });

     it("Should return file type of the file", async ()=> {
        const instance = await IPFS.deployed();
        await instance.addFile('1',"Note",accounts[0]);
        const value = await instance.getFileType(0);
       
        assert.equal(value, 'Note');
      });

      it("Should return doctorID of the file", async ()=> {
        const instance = await IPFS.deployed();
        await instance.addFile('1',"Note",accounts[0]);
        const value = await instance.getFileDID(0);
       
        assert.equal(value, accounts[0]);
      });
    });

      contract("Permission", function(accounts) {
        it("Should return ID of the file", async ()=> {
            const instance = await Permission.deployed();
            await instance.setFile('1',accounts[0]);
            const value = await instance.getFile(0);
           
            assert.equal(value, '1');
          });

         it("Grant Permission", async ()=> {
            const instance = await Permission.deployed();
            await instance.addPatient(accounts[1],"Patient");
            await instance.setFile('1',accounts[1]);
            await instance.grantPermission(1,accounts[0],accounts[1], "xyz");
            
            const value = await instance.getPermission(1,accounts[0]);
           
            assert.equal(value, true);
          });

          it("Revoke Permission", async ()=> {
            const instance = await Permission.deployed();
            await instance.addPatient(accounts[1],"Patient");
            await instance.setFile('1',accounts[1]);
            await instance.revokePermission(2,accounts[0],accounts[1]);
            
            const value = await instance.getPermission(2,accounts[0]);
           
            assert.equal(value, false);
          });
        });

        contract("Roles", function(accounts) {
          it("Should return the role", async ()=> {
              const instance = await Roles.deployed();
              await instance.addDoctor(accounts[2],"Doctor");
              await instance.addPatient(accounts[3],"Patient");
              let value = await instance.returnRole(accounts[2]);
             
              assert.equal(value, 'Doctor');

              value = await instance.returnRole(accounts[3]);
             
              assert.equal(value, 'Patient');
            });
          });