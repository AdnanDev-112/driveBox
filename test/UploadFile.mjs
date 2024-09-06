import hardhat from 'hardhat';
const { ethers } = hardhat;
import * as chai from 'chai';
const { expect } = chai;

describe("UploadFile", function () {
  let UploadFile;
  let uploadFile;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Manually create signers using the provided private keys
    const provider = ethers.provider;

    //Addresses to be replaced by the ones provided on the hardhat node console
    owner = new ethers.Wallet("0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61", provider);
    user1 = new ethers.Wallet("0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", provider);
    user2 = new ethers.Wallet("0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd", provider);

    // Fund wallets if necessary (for example, if not using a hardhat node with pre-funded accounts)
    // await owner.sendTransaction({ to: user1.address, value: ethers.utils.parseEther("1.0") });

    // Deploy the contract with the owner as the deployer
    UploadFile = await ethers.getContractFactory("UploadFile", owner);
    uploadFile = await UploadFile.deploy();
  });

  describe("Face Authentication", function () {
    it("should add and verify face authentication", async function () {
      await uploadFile.addFaceAuth(owner.address, "faceAuthID");
      const isVerified = await uploadFile.verifyFaceAuth(
        owner.address,
        "faceAuthID"
      );
      expect(isVerified).to.be.true;
    });

    it("should fail verification for incorrect faceAuthID", async function () {
      await uploadFile.addFaceAuth(owner.address, "faceAuthID");
      const isVerified = await uploadFile.verifyFaceAuth(
        owner.address,
        "wrongFaceAuthID"
      );
      expect(isVerified).to.be.false;
    });
  });

  describe("File Management", function () {
    it("should add a file for the user", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );

      const files = await uploadFile.getMyFiles(owner.address);
      expect(files.length).to.equal(1);
      expect(files[0].fileName).to.equal("file1");
      expect(files[0].cid).to.equal("cid1");
    });

    it("should remove a file for the user", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );
      await uploadFile.removeFile(owner.address, "cid1");

      const files = await uploadFile.getMyFiles(owner.address);
      expect(files.length).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("should allow access to a file for another user", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );
      await uploadFile.allowAccess(owner.address, "cid1", user1.address);

      const sharedFiles = await uploadFile.sharedWithMe(user1.address);
      expect(sharedFiles.length).to.equal(1);
      expect(sharedFiles[0].fileName).to.equal("file1");
    });

    it("should disallow access to a file for another user", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );
      await uploadFile.allowAccess(owner.address, "cid1", user1.address);
      await uploadFile.disallowAccess(owner.address, "cid1", user1.address);

      const sharedFiles = await uploadFile.sharedWithMe(user1.address);
      expect(sharedFiles.length).to.equal(0);
    });
  });

  describe("Sharing and Displaying Files", function () {
    it("should return the correct files shared with the caller", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );
      await uploadFile.allowAccess(owner.address, "cid1", user1.address);

      const sharedFiles = await uploadFile.sharedWithMe(user1.address);
      expect(sharedFiles.length).to.equal(1);
      expect(sharedFiles[0].fileName).to.equal("file1");
    });

    it("should return the correct access list for a file CID", async function () {
      await uploadFile.addFile(
        owner.address,
        "file1",
        "cid1",
        "encryptionKey1",
        "iv1"
      );
      await uploadFile.allowAccess(owner.address, "cid1", user1.address);
      await uploadFile.allowAccess(owner.address, "cid1", user2.address);

      const accessList = await uploadFile.getAccessList(
        owner.address,
        "cid1"
      );
      expect(accessList.length).to.equal(2);
      expect(accessList).to.include(user1.address);
      expect(accessList).to.include(user2.address);
    });
  });
});

// --- Simualte Multiple Users ---

// import hardhat from 'hardhat';
// const { ethers } = hardhat;
// import * as chai from 'chai';
// const { expect } = chai;

describe("UploadFile: Simulate Multiple Users", function () {
  let UploadFile;
  let uploadFile;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    const provider = ethers.provider;

    owner = new ethers.Wallet("0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61", provider);
    user1 = new ethers.Wallet("0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", provider);
    user2 = new ethers.Wallet("0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd", provider);

    UploadFile = await ethers.getContractFactory("UploadFile", owner);
    uploadFile = await UploadFile.deploy();
  });

  async function simulateUsers(method, numUsers, args) {
    for (let i = 0; i < numUsers; i++) {
      const methodArgs = args(i);
      await method(...methodArgs);
    }
    console.log(`Simulated ${numUsers} users for method.`);
  }

  describe("Face Authentication", function () {
    it("Simulate 100 users calling addFaceAuth", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFaceAuth(owner.address, `faceAuthID${i}`),
        100,
        () => [owner.address, `faceAuthID`]
      );
    });

    it("Simulate 500 users calling addFaceAuth", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFaceAuth(owner.address, `faceAuthID${i}`),
        500,
        () => [owner.address, `faceAuthID`]
      );
    });

    it("Simulate 1000 users calling addFaceAuth", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFaceAuth(owner.address, `faceAuthID${i}`),
        1000,
        () => [owner.address, `faceAuthID`]
      );
    });
  });

  describe("File Management", function () {
    it("Simulate 100 users adding files", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        ),
        100,
        (i) => [owner.address, `file${i}`, `cid${i}`, `encryptionKey${i}`, `iv${i}`]
      );
    });

    it("Simulate 500 users adding files", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        ),
        500,
        (i) => [owner.address, `file${i}`, `cid${i}`, `encryptionKey${i}`, `iv${i}`]
      );
    });

    it("Simulate 1000 users adding files", async function () {
      this.timeout(12000000); // Increase timeout
      await simulateUsers(
        (i) => uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        ),
        1000,
        (i) => [owner.address, `file${i}`, `cid${i}`, `encryptionKey${i}`, `iv${i}`]
      );
    });

    it("Simulate 100 users removing files", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 100; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.removeFile(owner.address, `cid${i}`),
        100,
        (i) => [owner.address, `cid${i}`]
      );
    });

    it("Simulate 500 users removing files", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 500; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.removeFile(owner.address, `cid${i}`),
        500,
        (i) => [owner.address, `cid${i}`]
      );
    });

    it("Simulate 1000 users removing files", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 1000; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.removeFile(owner.address, `cid${i}`),
        1000,
        (i) => [owner.address, `cid${i}`]
      );
    });
  });

  describe("Access Control", function () {
    it("Simulate 100 users allowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 100; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.allowAccess(owner.address, `cid${i}`, user1.address),
        100,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });

    it("Simulate 500 users allowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 500; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.allowAccess(owner.address, `cid${i}`, user1.address),
        500,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });

    it("Simulate 1000 users allowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 1000; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
      }

      await simulateUsers(
        (i) => uploadFile.allowAccess(owner.address, `cid${i}`, user1.address),
        1000,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });

    it("Simulate 100 users disallowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 100; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
        await uploadFile.allowAccess(owner.address, `cid${i}`, user1.address);
      }

      await simulateUsers(
        (i) => uploadFile.disallowAccess(owner.address, `cid${i}`, user1.address),
        100,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });

    it("Simulate 500 users disallowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 500; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
        await uploadFile.allowAccess(owner.address, `cid${i}`, user1.address);
      }

      await simulateUsers(
        (i) => uploadFile.disallowAccess(owner.address, `cid${i}`, user1.address),
        500,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });

    it("Simulate 1000 users disallowing access", async function () {
      this.timeout(12000000); // Increase timeout
      for (let i = 0; i < 1000; i++) {
        await uploadFile.addFile(
          owner.address,
          `file${i}`,
          `cid${i}`,
          `encryptionKey${i}`,
          `iv${i}`
        );
        await uploadFile.allowAccess(owner.address, `cid${i}`, user1.address);
      }

      await simulateUsers(
        (i) => uploadFile.disallowAccess(owner.address, `cid${i}`, user1.address),
        1000,
        (i) => [owner.address, `cid${i}`, user1.address]
      );
    });
  });
});

