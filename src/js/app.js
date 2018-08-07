App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
     if (typeof web3 !== 'undefined') {
         // First, we check if there's a web3 instance already active.
         // Ethereum browsers like Mist or Chrome with the MetaMask extension
         // will inject their own web3 instances.
         // If an injected web3 instance is present,
         // we get its provider and use it to create our web3 object.
         App.web3Provider = web3.currentProvider;
         web3 = new Web3(web3.currentProvider);
     } else {
         // If no injected web3 instance is present,
         // we create our web3 object based on the TestRPC's provider.
         // Note this fallback is fine for development environments,
         // but insecure and not suitable for production.
         App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
         web3 = new Web3(App.web3Provider);
     }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('EtherFlow.json', function(data) {
        // create contract interface using json data
        App.contracts.EtherFlow = TruffleContract(data);

        // set contract provider
        App.contracts.EtherFlow.setProvider(App.web3Provider);

        // mark adopted pet
        return App.render();
    });
  },

render: function() {
  var EtherFlowInstance;
  var loader = $("#loader");
  var content = $("#content");

  loader.show();
  content.hide();

  //Load account data
  web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
    }
  });

  //Load Contract data

  App.contracts.EtherFlow.deployed().then(function(instance) {
      }).then(function() {
        //loader.hide();
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });
    }
  };


  /*
          for (var i = 1; i <= candidatesCount; i++) {
            electionInstance.candidates(i).then(function(candidate) {
              var id = candidate[0];
              var name = candidate[1];
              var voteCount = candidate[2];

              // Render candidate Result
              var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
              candidatesResults.append(candidateTemplate);
            });
          }

  */




/*
  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  handleAdopt: function() {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    // disable button during process
    $(this).text('Processing..').attr('disabled', true);

    // get all accounts of current user

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.error(error);
        }

        // get first (base) account
        var account = accounts[0];


        App.contracts.Adoption.deployed().then(function(adoptionInstance) {
            return adoptionInstance.adopt(petId, {from: account});
        })
        .then(function(result) {
            alert('Adoption success!');
            // although it succeed, it still takes time until
            // getAdopters() return updated list of adopters
            return App.markAdopted();
        })
        .catch(function(err) {
            // enable button again on error
            $(this).text('Adopt').removeAttr('disabled');
            console.log(err.message);
        });
    });
  },

  markAdopted: function(adopters, account) {
    // get deployed contract instance
    App.contracts.Adoption.deployed().then(function(adoptionInstance) {
        return adoptionInstance.getAdopters.call();
    })
    .then(function(adopters) {
        // disable adopted pets button
        adopters.forEach(function(adopter, i) {
            if (adopter !== '0x0000000000000000000000000000000000000000') {
                $('.panel-pet').eq(i).find('button').text('Adopted').attr('disabled', true);
            }
        });
        console.log('Status updated on ' + Date.now());
    })
    .catch(function(err) {
        console.error(err.message);
    });
  }

};
*/



$(function() {
  $(window).load(function() {
    App.init();
  });
});
