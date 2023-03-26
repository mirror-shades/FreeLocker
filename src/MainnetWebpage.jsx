import { useState } from "react";
import Approve from "./Approve.jsx";
import Input from "./Input.jsx";
import SafeCheck from "./SafeCheck.jsx";
import Logo from "./locklogo.png";
import Line from "./line.png";
import Text from "./text.png";
import abi from "./LockerABI.jsx";
import ERC20ABI from "./ERC20ABI.jsx";
import lockerAddress from "./Addresses.jsx";
import Web3 from "web3";
import "./App.css";

const web3 = new Web3(window.ethereum);
let ethereum = window.ethereum;
const ethereumButton = document.querySelector(".enableEthereumButton");

ethereumButton.addEventListener("click", () => {
  //Will Start the metamask extension
  ethereum.request({ method: "eth_requestAccounts" });
});

const Webpage = () => {
  const [account, setAcc] = useState("");
  const [owner, setOwner] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [length, setLength] = useState("");
  const [percent, setPercent] = useState("");
  const [ids, setIds] = useState("");
  const [networkCheck, setNetworkCheck] = useState("");

  var network;

  async function checkNetwork() {
    network = await web3.eth.getChainId();
    setNetworkCheck(network);
  }

  async function checkIds() {
    const locker = new web3.eth.Contract(abi, lockerAddress);
    if (ids === "" && account !== "") {
      var counter;
      var check;
      var res;
      counter = 0;
      check = false;
      res = [];
      while (check === false) {
        try {
          var id = await locker.methods.addressToIds(account, counter).call();
          id = String(id);
          res.push(id);
          counter++;
        } catch {
          check = true;
        }
      }
      console.log(res);
      setIds(res.join(", "));
    }
  }

  async function viewSafe(input) {
    const locker = new web3.eth.Contract(abi, lockerAddress);

    const res = await locker.methods.getSafe(input.text).call();
    if (res[1] === "0x0000000000000000000000000000000000000000") {
      setOwner("Unowned");
      setToken("N/A");
      setLength("N/A");
      setAmount("N/A");
      setPercent("");
    } else {
      setOwner(res[0]);
      setToken(res[1]);
      const tokenContract = new web3.eth.Contract(ERC20ABI, res[1]);
      const total = await tokenContract.methods.totalSupply().call();
      const _amount = String(res[2] / 10 ** 18);
      setAmount(_amount);
      if (_amount === "0") {
        setLength("Unlocked");
      } else {
        const _length = new Date(res[3] * 1000);
        const stringLength = String(_length);
        setLength(stringLength);
      }
      setPercent(
        "(" + ((_amount * 100) / total).toFixed(6) + "% of total supply)"
      );
    }
  }

  async function unlock(input) {
    const locker = new web3.eth.Contract(abi, lockerAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await locker.methods
      .unlock(input.text)
      .estimateGas({ from: account });
    await locker.methods
      .unlock(input.text)
      .send({ from: account, gas: gasEstimate, gasPrice: gasPrice });
  }

  async function onInit() {
    web3.eth.getAccounts(function (error, accounts) {
      if (account !== accounts[0]) {
        try {
          setAcc(accounts[0]);
          checkNetwork();
          checkIds();
        } catch {
          console.log("Initilization failed");
        }
      }
    });
  }

  onInit();

  if (networkCheck === 42161 && account !== undefined) {
    return (
      <div>
        <div>
          <img src={Logo} alt="Logo" height="200px" width="200px" />
          <br />
          <img src={Text} alt="ArbiLocker" />
          <br />
          <p>
            <b>
              See the{" "}
              <a href="https://arbiscan.io/address/0xae5ee9b6755ad23b7ccf9ad243664eeb65fe87d7#code">
                Code
              </a>
            </b>
          </p>
          <p>
            <b>
              Try the{" "}
              <a href="https://arbilocker-testnet.herokuapp.com">Testnet</a>
            </b>
          </p>
          <br />
          <p>Connected to: {account}</p>
          <p>Your Safe Ids: {ids}</p>
        </div>
        <center>
          <div>
            <Approve account={account} />
          </div>
          <br />
          <br />
          <img src={Line} alt="..." />
          <br />
          <div>
            <Input
              onsubmit={unlock}
              label="Unlock"
              placeholderText="ID"
              initButton="Unlock a locked position"
              buttonName="Unlock"
            />
          </div>
          <br />
          <div>
            <SafeCheck
              onsubmit={viewSafe}
              label="See Safe"
              placeholderText="ID"
              initButton="Check a locked position"
              buttonName="See"
              owner={owner}
              token={token}
              amount={amount}
              length={length}
              percent={percent}
            />
          </div>
        </center>

        <br />
        <br />
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <p>
          Please connect your Metamask account. You must be connected to
          Arbitrum.
        </p>
      </div>
    );
  }
};

export default Webpage;
