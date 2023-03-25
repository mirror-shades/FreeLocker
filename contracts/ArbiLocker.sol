//SPDX-License-Identifier: GPL-2.0-only
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract ArbiLocker is ReentrancyGuard {

    uint counter;

    mapping (address => uint[]) public addressToIds;
    mapping (uint => Safe) public idToSafe;

    //each object created represents an amount of tokens locked in the contract
    struct Safe {
        address owner;
        address token;
        uint amount;
        uint unlock;
        bool active;
    }

    function deposit(address user, address token, uint amount, uint length) public nonReentrant returns(uint id) {
        require(amount > 1000, "Deposit too low");
        require(length > 0 && length < 10000, "9999 days max lock");
        IERC20 lp = IERC20(token);
        lp.transferFrom(msg.sender, address(this), amount);
        Safe memory newSafe;
        uint currentID = counter;
        newSafe.owner = user;
        newSafe.token = token;
        newSafe.amount = amount;
        newSafe.unlock = block.timestamp + (length * 1 days); 
        newSafe.active = true;
        addressToIds[msg.sender].push(currentID);
        idToSafe[currentID] = newSafe;
        counter++;
        return(currentID);
    }

    function unlock(uint id) public nonReentrant {
        require(idToSafe[id].owner == msg.sender, "Not the owner of this safe");
        require(idToSafe[id].unlock <= block.timestamp, "Still locked");
        IERC20 lp = IERC20(idToSafe[id].token);
        lp.transfer(msg.sender, idToSafe[id].amount);
        idToSafe[id].amount = 0;
        idToSafe[id].active = false;
    }
    
    function getSafe(uint id) view public returns(Safe memory) {
        Safe memory res = idToSafe[id];
        return(res);
    }
    
    function getIds(address user) view public returns(uint[] memory) {
        uint total = addressToIds[user].length;
        uint[] memory res = new uint[](total);
        uint i;
        uint ticker;
        while(i < total) {
            address _owner = idToSafe[ticker].owner;
            if(_owner == msg.sender) { 
                res[i] = ticker; 
                i++; 
            }
            ticker++;
        }
        return(res);
    }
}