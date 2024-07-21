import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { LuArrowUp, LuBookUp, LuGithub, LuSend, LuGlobe2, LuMessagesSquare, LuSparkles, LuWallet, LuBoomBox, LuUpload, LuMic2, LuLoader } from "react-icons/lu";
import Web3 from 'web3';

import "./App.css";
function App() {
  const genAI = new GoogleGenerativeAI('AIzaSyDO1uG4Y_0m5v_HqOv_MbK5o-bEr3EERSM'); 
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [CurrentWallet, setCurrentWallet] = useState("")
const [Thinking,setThinking] = useState(false)

  // WEB3 CONFIG
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const contractAddress = '0x191Cd22A658c504018747c8FE81FE12e8E2D908c';
    const contractABI = [ { "inputs": [ { "internalType": "uint256", "name": "initialSupply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "sendTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ];
    async function loadBlockchainData() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            setWeb3(web3);
            const accounts = await web3.eth.requestAccounts(); // Request access to account
            setAccount(accounts[0]);
            setCurrentWallet(accounts[0])

            const tempContract = new web3.eth.Contract(contractABI, contractAddress);
            setContract(tempContract);
        } else {
            window.alert('Non-Ethereum browser detected. Consider using MetaMask!');
        }
    }


    const web3sendTokens = async (amount, recipientAddress) => {
        if (!recipientAddress || !amount) {
            alert('Please enter both the recipient address and the amount.');
            return;
        }

        const amountToSend = web3.utils.toWei(amount, "ether"); // Convert amount to wei

        try {
            const receipt = await contract.methods.sendTokens(recipientAddress, amountToSend).send({ from: account });
            console.log('Tokens sent:', receipt);
            alert('Tokens successfully sent!');
        } catch (error) {
            setResponse(error)
            alert('Failed to send tokens. See console for details.');
        }
    };



  useEffect(()=>{
    setResponse("Hey! This is CRAIBOT AI 👋")
  },[])



  // AFTER SUBMIT
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Call your function here
      handleSubmit();
      setInputText("");
    }
  };
  // ON SUBMIT
  const handleSubmit = async () => {
    setThinking(true)

    if (CurrentWallet==""){
      setResponse("Please Connect Your Wallet First 🙄")
      setThinking(false)
      var chatDiv = document.getElementById('chatDiv');
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }else{
      setUserInput(inputText);
      
      var chatDiv = document.getElementById('chatDiv');
      chatDiv.scrollTop = chatDiv.scrollHeight;
    try {

      // GETTING RESPONSE FROM AI AND PARSING IT
      const safetySettings = [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE}];
      const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
      const result = await model.generateContent(`
        You're CRAIBOT Cryptographic AI Bot, These are various function
        1. checkbalance(address) : check for wallet balance taking address
        2. checkmybalance(): checks current balance , takes no params
        3. send(amount, walletAddress, cryptoname): send X amount to specified walletAddress
        4. sendbyusername(amount, username, cryptoname): send X amount to specified username 
        5. greet(greetMessage): greet the user with basic greeting and helps user with above mentioned functions
        Your role is to analyze the User's Input, telling which function wud be run on the system with parameters also. DARE YOU CHANGE THE PARAMS NAME AND ANY EXTRA PARAM ON YOUR OWN! IF you reveal If Param not defined then add "Null". **ALSO RETURN JUST ONLY SINGLE JSON OUTPUT!

        <USER>: ${inputText}
        <AI>:{"function":<functionname>, "params":<dict of params>}
      `);
      const responseText = await result.response.text();
      console.log(responseText);
      const responseObject = JSON.parse(responseText);

      
      
      // FINDING FUNCTIONS AND RUNNING THEM
      if (responseObject.function === "checkbalance") {
        const balance = await getWalletBalance(responseObject.params.address);
        setResponse(`Total Balance for this address is ${balance}`);
      } else if (responseObject.function === "checkmybalance") {
        const balance = await getWalletBalance(CurrentWallet);
        setResponse(`Total Balance for your address is ${balance}`);

      } else if (responseObject.function === "send") {
        setResponse(sendTokens(responseObject.params.amount, responseObject.params.walletAddress,responseObject.params.cryptoname,));
      } else if (responseObject.function === "sendbyusername") {
        const usernametoWallet ={
          'vansh': "0x2f046B7dB654C861016f5E56A6F1BC68cb3C5CD0",
          'hamza':"0x33069CDaF6E181A193dE6feEA7A9B283f99C9479",
          'samarth':"0xE0D6bc33660921aAcF96A83015CE4Aa77c2D9844",
          'lakshay':"0x33069CDaF6E181A193dE6feEA7A9B283f99C9479",
          'thhavu':"0x33069CDaF6E181A193dE6feEA7A9B283f99C9479"
        }
        if (!(responseObject.params.username in usernametoWallet)){
          setResponse(`The Wallet Address is not set for username @${responseObject.params.username}`)
          
        }
        setResponse(sendTokens(responseObject.params.amount, usernametoWallet[responseObject.params.username],responseObject.params.cryptoname, responseObject.params.username));

      } else if (responseObject.function === "greet") {
        setResponse(greet(responseObject.params.greetMessage));


      } else {
        console.error("Unknown function:", responseObject.function);
        setResponse("I could not perform that action yet! 😔")
      }
      setThinking(false)
      var chatDiv = document.getElementById('chatDiv');
    chatDiv.scrollTop = chatDiv.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  };


  useEffect(() => {
    const chatDiv = document.getElementById('chatDiv');
    if (chatDiv && response!="") {
      chatDiv.innerHTML += `<div class='botmessageContainer'><img src="https://static-00.iconduck.com/assets.00/user-avatar-robot-icon-2048x2048-ehqvhi4d.png" /><div class="messageBot"><h1>${response}</h1></div></div>`;
    }
  }, [response]);

  useEffect(() => {
    const chatDiv = document.getElementById('chatDiv');
    if (chatDiv && userInput!="") {
      chatDiv.innerHTML += `<div class='botmessageContainer'><div class="messageUser"><h1>${userInput}</h1></div><img src="https://static-00.iconduck.com/assets.00/user-avatar-4-icon-256x255-nby2kvg1.png" /></div>`;
      // chatDiv.innerHTML += `<div class="messageUser"><h1>${userInput}</h1></div>`;

    }
  }, [userInput]);


  const getWalletBalance = async (walletAddress) => {
    const apiKey = 'MHEKUUDNI47M81GCJIZ58BUGQI787MDAIA';
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.status === '1') {
          const balanceWei = parseInt(data.result);
          const balanceEth = balanceWei / Math.pow(10, 18); 
          return balanceEth;
        } else {
          console.log("Error:", data.message);
        }
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  

  const sendTokens = (amount, wAddress, cryptoname, username="") => {
    web3sendTokens(amount, wAddress);
    if(username==""){
      return(`Sending ${amount} ${cryptoname}  to Wallet Address: ${wAddress}`);
    }else{
      return(`Sending ${amount}  ${cryptoname} to @${username} (${wAddress})`);
    }
  };



  const greet = (greetMessage) => {
    return(greetMessage);
  };




  return (
    <div className="App">
      <div className='header'>
        <h1>CRAIBOT <spna style={{fontStyle: 'italic', background: '#3f2860', padding: '0.1rem 0.5rem', borderRadius: '0.2rem'}}>AI</spna></h1>
        <div className='connectwalletbtn' onClick={()=>loadBlockchainData()}>
          <LuWallet></LuWallet>
        <h1>{CurrentWallet!=""?CurrentWallet:"Connect Wallet"}</h1>
        </div>
      </div>
      <div id="chatDiv">
      </div>


      <div className='inputFooter'>
        <LuMic2 size={10} onClick={handleSubmit}></LuMic2>
        <input value={inputText} onChange={handleInputChange} onKeyDown={handleKeyPress}  placeholder="Message CRAIBOT.."/>
        {!Thinking?
          <LuUpload size={10} onClick={handleSubmit}></LuUpload>
          :
          <LuLoader size={10} onClick={handleSubmit}></LuLoader>
        
      }
        {/* <button onClick={handleSubmit}>Submit</button> */}
      </div>
      <h4 style={{color:'white', textAlign:'center', margin:0, marginTop:'0.6rem', opacity:0.4}}>CRAIBOT AI can make mistakes. Consider checking important information.</h4>

    </div>
  );
}

export default App;
