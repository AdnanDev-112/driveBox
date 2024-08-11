const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FileApp", (m) => {
  const contract = m.contract("UploadFile");

  return { contract };
});
