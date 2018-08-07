
Reentrancy
For sending reward money;
Use the withdrawal design pattern and separate the contract accounting logic and the transfer logic.

Cross-function Race Conditions
For claimReward function
Finished internal work first before external function call
It is generally a good idea to handle your internal contract state changes before calling external contracts


Integer Overflow and Overflow
Check for overflows and underflows in boostReward function
Used assert to check for overflows
Used require to check for underflows


Denial of Service
Favor pull over push for external calls for collecting reward money
