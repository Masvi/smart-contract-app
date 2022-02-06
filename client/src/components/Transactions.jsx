import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionsContext";
import { PropTypes } from "prop-types";

import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  keyword,
  amount,
  url,
}) => {
  return (
    <div
      className="bg-[#181918] m-4 flex flex-1 
      2xl>min-w-[450px]
      2xl>max-w-[500px]
      sm:2xl>min-w-[270px]
      sm:2xl>max-w-[300px]
      flex-col p-3 rounded-md hover:shadow-2xl 
    "
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <a
            href={`https://ropsten.etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">
              from: {shortenAddress(addressFrom)}
            </p>
          </a>
          <a
            href={`https://ropsten.etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">
              To: {shortenAddress(addressTo)}
            </p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}

          <div className="bg-black p-3 px-5 w-max rounded-3xl mt-5 shadow-2xl">
            <p className="text-[#37c7da] text-bold">{timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { currentAccount } = useContext(TransactionContext);
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl tex-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl tex-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {dummyData.reverse().map((transaction, i) => (
            <TransactionCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

TransactionCard.propTypes = {
  addressTo: PropTypes.string,
  addressFrom: PropTypes.string,
  timestamp: PropTypes.string,
  message: PropTypes.string,
  keyword: PropTypes.string,
  amount: PropTypes.string,
  url: PropTypes.string,
};
export default Transactions;
