//ArbiLocker Test
var ArbiLocker = artifacts.require("ArbiLocker");
var TT = artifacts.require("TT");

contract("ArbiLocker", function (accounts) {
  it("lpFee should be 1%", function () {
    return ArbiLocker.deployed()
      .then(async function (instance) {
        var bal = await web3.eth.getBalance(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        );
        return instance.lpFee.call();
      })
      .then(function (lpFee) {
        assert.equal(lpFee.valueOf(), 100, "!=1%");
      });
  });

  it("Owner should be msg.sender", function () {
    return ArbiLocker.deployed()
      .then(async (instance) => {
        await instance.seeOwner.call();
        return instance.seeOwner.call();
      })
      .then(function (seeOwner) {
        assert.equal(
          seeOwner.valueOf(),
          0x627306090abab3a6e1400e9345bc60c78a8bef57,
          "Wrong Owner"
        );
      });
  });

  it("Token Balance should be total supply", function () {
    return TT.deployed()
      .then(async (instance) => {
        await instance.balanceOf.call(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        );
        return instance.balanceOf.call(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        );
      })
      .then(function (balanceOf) {
        assert.equal(balanceOf.valueOf(), 1000000 * 10 ** 18, "Wrong amount");
      });
  });

  it("Should create an LP lock (eth fee)", function () {
    var tokenContract;
    var lockerContract;
    var res;
    return ArbiLocker.deployed()
      .then(async (instance) => {
        lockerContract = instance.address;
        await TT.deployed().then(async (instance) => {
          tokenContract = instance.address;
          await instance.approve(lockerContract, String(10 * 10 ** 18));
        });
        await instance.deposit(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
          tokenContract,
          String(1 * 10 ** 18),
          1,
          { value: 1 * 10 ** 17 }
        );
        res = await instance.getSafe(1);
      })
      .then(async () => {
        assert.equal(
          res[0],
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
          "Owner address wrong"
        );
        assert.equal(res[1], tokenContract, "Token address wrong");
        assert.equal(res[2], 1000000000000000000, "Token amount wrong");
      });
  });

  it("Should have taken the proper number of tokens from user", function () {
    return TT.deployed()
      .then(async (instance) => {
        await instance.balanceOf.call(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        );
        return instance.balanceOf.call(
          "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        );
      })
      .then(async (balanceOf) => {
        var test2 = String(
          1000000 * 10 ** 18 - 2 * 10 ** 18 + 1 * 10 ** 18 * 0.01
        );
        var res = Number(balanceOf.valueOf());
        assert.equal(res, test2, "wrong balance");
      });
  });

  it("Should put the proper amount of tokens in the contract", function () {
    var lockerContract;
    var tokenContract;
    var bal;
    return ArbiLocker.deployed()
      .then(async (instance) => {
        lockerContract = instance.address;
        await TT.deployed().then(async (instance) => {
          tokenContract = instance.address;
          bal = await instance.balanceOf(lockerContract);
        });
      })
      .then(() => {
        assert.equal(
          Number(bal.valueOf()),
          1990000000000000000,
          "Not the right number of tokens"
        );
      });
  });

  it("Should have taken the proper amount of ETH", function () {
    var lockerContract;
    var bal;
    return ArbiLocker.deployed()
      .then(async (instance) => {
        lockerContract = instance.address;
        bal = await web3.eth.getBalance(lockerContract);
      })
      .then(() => {
        assert.equal(
          Number(bal.valueOf()),
          1 * 10 ** 17,
          "Not the right amount of ETH"
        );
      });
  });

  it("Should allow unlocks", async function () {
    var bal;
    return ArbiLocker.deployed()
      .then(async (instance) => {
        try {
          await instance.unlock(0);
        } catch {
          console.log("Token Fee Failed!");
        }
        try {
          await instance.unlock(1);
        } catch {
          console.log("Token Fee Failed!");
        }
        return TT.deployed().then(async (instance) => {
          bal = await instance.balanceOf.call(
            "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
          );
        });
      })
      .then(() => {
        assert.equal(
          Number(bal),
          String(1000000 * 10 ** 18),
          "Didn't get all the tokens back"
        );
      });
  });

  it("Should allow owner withdrawls", async function () {
    var bal;
    return ArbiLocker.deployed()
      .then(async (instance) => {
        await instance.withdrawEth();
        bal = await web3.eth.getBalance(instance.address);
      })
      .then(() => {
        assert.equal(bal, 0, "ETH not withdrawn");
      });
  });
});
