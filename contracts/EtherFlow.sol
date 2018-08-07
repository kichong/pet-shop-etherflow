pragma solidity ^0.4.24;

import "./CircuitBreaker.sol";

/// @title Ether Flow
contract EtherFlow is CircuitBreaker {

    enum FlowType { Haiku, Limerick, Freestyle }

    event LogFlowRequested (uint indexed reward);
    event LogFlowSubmitted (uint indexed);

    uint flowCount = 0;
    uint reward = 0;

    struct request {
        string question;
        uint reward;
        FlowType flowType;
    }

    request public newRequest;

    ///@notice Post new request for a poem
    ///@param _question New question being asked
    ///@param _flowType The style of poetry preferred (Haiku, Limerick, or Freestyle)
    function newFlowRequest(string _question, FlowType _flowType) public payable {
        require (owner == msg.sender);
        require (msg.value > 0);
        uint _reward = msg.value;
        emit LogFlowRequested(_reward);
        newRequest = request(_question, _reward, _flowType);
    }

    mapping (address => flow) public wordsmithFlows;

    struct flow {
        string flow;
        address wordsmith;
        FlowType flowType;
        uint flowCount;
    }

    flow[] public flowArray;

    ///@notice Wordsmith post new poem in response to question
    ///@param _flow Poem that answers the question
    ///@param _flowType The style of poetry (Haiku, Limerick, or Freestyle) that is being used
    ///@return true if flow successfully submitted, false otherwise
    function postNewFlow(string _flow, FlowType _flowType) public returns(bool) {
        require(msg.sender != owner);
        flowArray.push(flow({
            flow: _flow,
            wordsmith: msg.sender,
            flowType: _flowType,
            flowCount: flowCount++
        }));
        wordsmithFlows[msg.sender] = flowArray[flowArray.length-1];
        return true;
        emit LogFlowSubmitted(flowCount);
        }

    address public chosenWordsmith;

    event LogWordsmithChosen (address);

    ///@notice Flow requester selects wordsmith that will be able to claim reward
    ///@param _wordsmith Wordsmith to send reward to
    function selectWordsmith(address _wordsmith) public {
        require(owner == msg.sender);
        require(newRequest.reward > 0);
        require(_wordsmith == wordsmithFlows[_wordsmith].wordsmith);
        chosenWordsmith = _wordsmith;
        emit LogWordsmithChosen(_wordsmith);
    }

    ///@notice ChosenWordsmith can claim their reward
    function claimReward() public {
        require(msg.sender == chosenWordsmith);
        require(newRequest.reward > 0);
        uint claimedReward = newRequest.reward;
        newRequest.reward = 0;
        chosenWordsmith.transfer(claimedReward);
    }

    event LogRewardIncreased(uint);

    ///@notice Boost question reward
    function boostReward() public payable {
        require(msg.value > 0);
        newRequest.reward += msg.value;
        assert(newRequest.reward >= msg.value);
        emit LogRewardIncreased(newRequest.reward);
    }

    ///@notice Select and send extra money directly to wordsmith for spitting hot fire
    ///@param _wordsmith Who is receiving extra money
    function tipWordsmith(address _wordsmith) public payable {
        require(msg.value > 0);
        require(_wordsmith == wordsmithFlows[_wordsmith].wordsmith);
        _wordsmith.transfer(msg.value);
    }

    //@notice to fetch newRequest reward element
    function getReward() public view returns(uint reward) {
      reward = newRequest.reward;
      return reward;
    }

    function getQuestion() public view returns(string question) {
      question = newRequest.question;
      return question;
    }

    function getFlowArray(uint _flowCount) public view returns(
      string flow,
      address wordsmith,
      FlowType flowType) {
        flow = flowArray[_flowCount].flow;
        wordsmith = flowArray[_flowCount].wordsmith;
        flowType = flowArray[_flowCount].flowType;
        return (flow, wordsmith, flowType);
    }

}
