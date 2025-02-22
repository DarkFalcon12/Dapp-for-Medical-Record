const IPFSStorage = artifacts.require("IPFSStorage");

module.exports = function(deployer) {
  deployer.deploy(IPFSStorage);
};
const PatientRecords = artifacts.require("PatientRecords");

module.exports = function (deployer) {
  deployer.deploy(PatientRecords);
};
