var EtherFlow = artifacts.require("EtherFlow");

contract("EtherFlow", function(accounts) {

  const owner = accounts[0];
  const wordsmith1 = accounts[1];
  const wordsmith2 = accounts[2];
  const booster = accounts[3];
  const sentAmount = web3.toWei(2, "ether");

  // Use one of those acccounts to deploy the contract
  it("deploys a contract", async() => {
    const etherflow = await EtherFlow.deployed();
    assert.ok(etherflow, "the contract should be deployed");
  });

  // Test that reward is set to 0
  it("has a an initial reward of 0", async() => {
    const etherflow = await EtherFlow.deployed();
    const initialReward = await etherflow.getReward();
    assert.equal(0, initialReward, "the initial reward should be set to 0");
  });

  // test newFlowRequest receives the correct reward and question
  it("newFlowRequest updates reward amount and question", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.newFlowRequest("will this work?", 1, {
      from: owner,
      value: sentAmount
    });
    const newReward = await etherflow.getReward();
    assert.equal(sentAmount, newReward, "the reward should be the same as the sentAmount");
    console.log(web3.fromWei(newReward).toString());
    const newQuestion = await etherflow.getQuestion();
    assert.equal("will this work?", newQuestion, "the question should be same as what was entered");
  });

  // test postNewFlow receives the correct flow and address
  it("postNewFlow receives the correct flow and address", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("It'll work, I go berzerk, twerk twerk", 2, {
      from: wordsmith1
    });
    const flow1 = await etherflow.getFlowArray(0, {
      from: owner
    });
    assert.equal("It'll work, I go berzerk, twerk twerk", flow1[0], "the flow result and flow inputted should be the same");
    assert.equal(wordsmith1, flow1[1], "the address of the wordsmith should be the same as the addres of the person who posted the new flow");
  });

  // test multiple accounts can submit a new flow
  it("can receive flows from multiple accounts", async () => {
    const etherflow = await EtherFlow.deployed();
    await etherflow.postNewFlow("work? irrelevent, you know it does not matter, smoke weed every day", 2, {
      from: wordsmith2
  });
    const flow2 = await etherflow.getFlowArray(1, {
      from: owner
    });
    assert.ok(flow2);
    console.log(flow2);
  });

// test only owner can select Wordsmith function
  it("only owner can call selectWordsmith function", async () => {
    const etherflow = await EtherFlow.deployed();
    try {
      await etherflow.selectWordsmith(wordsmith1, {
        from: booster
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
    });

  // test that only selected wordsmith can withdraw or claim the reward
/*
  it("allows only the chosenWordsmith to withdraw or claim the reward", async () => {
    const etherflow = await EtherFlow.deployed();
    const initialBalance = await web3.eth.getBalance(wordsmith1);
    await etherflow.newFlowRequest("will this work?", 1, {
      from: owner,
      value: sentAmount
    });
    await etherflow.postNewFlow("It'll work, I go berzerk, twerk twerk", 2, {
      from: wordsmith1
    });
    await etherflow.selectWordsmith(wordsmith1, {
      from: owner
    });

    await etherflow.claimReward( {
      from: wordsmith1
    });
    const newBalance = await web3.eth.getBalance(wordsmith1);
    assert.isAbove(newBalance, initialBalance);
  });
  */


  });
