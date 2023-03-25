import { useState } from "react";
import Web3 from "web3";
import Locker from "./Locker";
import lockerAddress from "./Addresses";
import ERC20ABI from "./ERC20ABI";
import abi from "./LockerABI";

const web3 = new Web3(window.ethereum);

const Approve = () => {
  const [input, setInput] = useState(false);
  const [address, setAddress] = useState("");
  const [account, setAcc] = useState("");
  const [approval, setApproval] = useState("");
  const [balance, setBalance] = useState("");

  async function lock(input) {
    const locker = new web3.eth.Contract(abi, lockerAddress);
    const _amount = input.amount;
    const _length = input.length;
    const adjustedAmount = String(web3.utils.toWei(_amount, "ether"));
    const gasPrice = await web3.eth.getGasPrice();
    const fee = web3.utils.toWei("0.1", "ether");
    console.log(input.type, account, address, _length, adjustedAmount);
    if (input.type === 1) {
      const gasEstimate = await locker.methods
        .depositForLP(account, address, adjustedAmount, _length)
        .estimateGas({ from: account });
      await locker.methods
        .depositForLP(account, address, adjustedAmount, _length)
        .send({ from: account, gas: gasEstimate, gasPrice: gasPrice });
    } else if (input.type === 2) {
      const gasEstimate = await locker.methods
        .depositForEth(account, address, adjustedAmount, _length)
        .estimateGas({ from: account, value: fee });
      console.log(fee);
      await locker.methods
        .depositForEth(account, address, adjustedAmount, _length)
        .send({
          from: account,
          gas: gasEstimate,
          value: fee,
          gasPrice: gasPrice,
        });
    }
  }

  async function onInit() {
    web3.eth.getAccounts(function (error, accounts) {
      setAcc(accounts[0]);
    });
  }
  onInit();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!address) {
      alert("Value empty");
      return;
    }

    setInput(true);
  };

  async function checkApproval() {
    const myContract = new web3.eth.Contract(ERC20ABI, address);
    var result = "No";
    const allowed = await myContract.methods
      .allowance(account, lockerAddress)
      .call();
    if (allowed > 10000000000000000000000000000000000000) {
      result = "Yes";
    }
    setApproval(result);
  }

  async function checkBalance() {
    const myContract = new web3.eth.Contract(ERC20ABI, address);
    const result = await myContract.methods
      .balanceOf(account)
      .call({ from: account });
    setBalance(web3.utils.fromWei(result));
  }

  async function approve() {
    const myContract = new web3.eth.Contract(ERC20ABI, address);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await myContract.methods
      .approve(lockerAddress, "10000000000000000000000000000000000000000")
      .estimateGas({ from: account });
    await myContract.methods
      .approve(lockerAddress, "10000000000000000000000000000000000000000")
      .send({ from: account, gasPrice: gasPrice, gas: gasEstimate });
  }

  async function accCheck() {
    if (account !== "" && address !== "") {
      try {
        await checkBalance();
        await checkApproval();
        console.log(approval);
      } catch {
        console.log(
          "Problem with token address, please check capitalization/checksum"
        );
      }
    }
  }

  if (input === false) {
    return (
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label>
            Start by checking if your LP has been approved by Arbilocker
          </label>
          <br />
          <br />
          <input
            type="address"
            placeholder="LP Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            accCheck();
          }}
        >
          Check Approval
        </button>
      </form>
    );
  } else if (approval === "No") {
    return (
      <div>
        <form className="add-form" onSubmit={onSubmit}>
          <div className="form-control">
            <label>Approve LP to be locked</label>
            <br />
            <input
              type="address"
              placeholder="LP Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button
            onSubmit={() => {
              accCheck();
            }}
            value="Check Approval"
          >
            Check Approval
          </button>
          <p>Your balance: {balance}</p>
          <p>Are you approved? {approval}</p>
          <button
            onClick={() => {
              approve();
            }}
            value="Approve"
          >
            Approve
          </button>
        </form>
      </div>
    );
  } else if (approval === "Yes") {
    return (
      <div>
        <form className="add-form" onSubmit={onSubmit}>
          <div className="form-control">
            <label>Lock your LP</label>
            <br />
            <input
              type="address"
              placeholder="LP Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button
            onSubmit={() => {
              accCheck();
            }}
            value="Check Approval"
          >
            Check Approval
          </button>
          <p>Your balance: {balance}</p>
          <p>Approved! {approval}</p>
        </form>
        <div>
          <Locker onsubmit={lock} />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Checking...</p>
      </div>
    );
  }
};

export default Approve;
