import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants'

export const TrasactionContext = React.createContext();

const { ethereum } = window;

window.ethereum
