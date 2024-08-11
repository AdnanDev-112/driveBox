const { ethers } = require("hardhat");
// describe("UploadFile", function () {
//     let uploadFile;
//     let owner;
//     let addr1;
//     let addr2;
  
//     beforeEach(async function () {
//       [owner, addr1, addr2] = await ethers.getSigners();
//       uploadFile = await ethers.getContractAt("UploadFile", deployedContractAddress);
//     });
  
    
//   });
describe("UploadFile", function () {
  let uploadFile;
  let owner, addr1, addr2;
  const deployedContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    uploadFile = await ethers.getContractAt("UploadFile", deployedContractAddress);
  });

  it("should add and remove files", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file2");

    let files = await uploadFile.displayFiles("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    // console.log(files);
    // expect(Object.keys(files).length).to.equal(2);

    // await uploadFile.removeFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    // files = await uploadFile.displayFiles("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    // expect(files.length).to.equal(1);
  });
  it("should add and remove files 2", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199","file1");
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199","file2");

    const files = await uploadFile.displayFiles("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    expect(files).to.deep.equal(["file1", "file2"]);

    await uploadFile.removeFile("file1");

    const updatedFiles = await uploadFile.displayFiles("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    expect(updatedFiles).to.deep.equal(["file2"]);
  });

  it("should grant and revoke access", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");

    await uploadFile.allowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr1.address);
    let accessList = await uploadFile.shareAccessList("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    expect(accessList.length).to.equal(1);
    expect(accessList[0]).to.equal(addr1.address);

    await uploadFile.disallowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr1.address);
    accessList = await uploadFile.shareAccessList("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    expect(accessList.length).to.equal(0);
  });

  it("should return shared files", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    await uploadFile.allowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr1.address);

    let sharedFiles = await uploadFile.sharedWithMe(addr1.address);
    expect(sharedFiles.length).to.equal(1);
    expect(sharedFiles[0]).to.equal("file1");
  });

  it("should not return files not shared with the user", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file2");
    await uploadFile.allowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr1.address);

    let sharedFiles = await uploadFile.sharedWithMe(addr1.address);
    expect(sharedFiles.length).to.equal(1);
    expect(sharedFiles[0]).to.equal("file1");

    sharedFiles = await uploadFile.sharedWithMe(addr2.address);
    expect(sharedFiles.length).to.equal(0);
  });

  it("should return the correct list of users with access to a specific file", async function () {
    await uploadFile.addFile("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    await uploadFile.allowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr1.address);
    await uploadFile.allowAccess("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1", addr2.address);

    let accessList = await uploadFile.shareAccessList("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "file1");
    expect(accessList.length).to.equal(2);
    expect(accessList).to.include(addr1.address);
    expect(accessList).to.include(addr2.address);
  });
});
