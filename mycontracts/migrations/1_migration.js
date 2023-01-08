var IPFS = artifacts.require("IPFS");
var Permissions = artifacts.require("Permissions");
var Roles = artifacts.require("Roles");


module.exports = function(deployer) {
  deployer.deploy(Roles).then(function(){
        return deployer.deploy(Permissions, Roles.address).then(function(){
            return deployer.deploy(IPFS, Permissions.address)
        });
});
};