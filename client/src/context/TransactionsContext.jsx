import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;
window.ethereum;

// fetch the ethereum contract
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
    
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions();
     
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      setTransactions(structuredTransactions);

    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (err) {
      console.error(err);
      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();
    
      window.localStorage.setItem("transactionCount", transactionCount);

    } catch (error) {
      const message = error.message || "";
      if (!message.match(/already processing/i)) { throw error; }
  
      const href = window.location.href;
      if (href.match(/connectOnLoad/)) { window.location.reload(); return; }
  
      const delimiter = href.match(/\?/) ? "&" : "?";
      window.location.href += delimiter + "connectOnLoad=true";
      throw new Error("No ethereum object");
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const requestAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(requestAccounts[0]);
    } catch (error) {

      const message = error.message || "";
      if (!message.match(/already processing/i)) { throw error; }
  
      const href = window.location.href;
      if (href.match(/connectOnLoad/)) { window.location.reload(); return; }
  
      const delimiter = href.match(/\?/) ? "&" : "?";
      window.location.href += delimiter + "connectOnLoad=true";
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amout, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmout = ethers.utils.parseEther(amout);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 gwei
            value: parsedAmout._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmout,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`loading - ${transactionHash.hash}`);
      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());

      window.reload();

    } catch (err) {
      console.log(err);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        transactions, 
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
