pragma solidity ^0.4.24;


///@title Circuit Breaker
contract CircuitBreaker {

    address public owner = msg.sender;

    bool private stopped = false;

    modifier isAdmin() {
        require(msg.sender == owner); _;
    }

///@notice owner of the contract submits a new question and can activate circuit breaker
    function toggleContractActive() isAdmin public {
        stopped = !stopped;
    }

    modifier stopInEmergency { require(!stopped); _; }
}
