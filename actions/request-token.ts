"use server"

import { FaucetPortKeys, faucetPort } from "@/config/faucetPont";

import axios from 'axios';
import { findCryptoCurrency } from "@/data/crypto-currency";

export const requestToken = async (
  { name, network, address }: { name: string; network: string; address: string }
) => {
  try {
    const cryptoCurrency = await findCryptoCurrency({ name, network })
    const lowerCaseName = name.toLowerCase() as FaucetPortKeys
    const port = faucetPort[lowerCaseName]
    const prefix = ['aptos',].includes(lowerCaseName) ? '/api' : '';
    const apiPath = `${prefix}/${lowerCaseName}/request`;
    // let fetchUrl = `${process.env.TOKEN_REQUEST_HOST}:${port}${apiPath}`;
    let fetchUrl = `${process.env.TOKEN_REQUEST_HOST}${apiPath}`;

    // 为了对接调试sepolia、Holesky，目前的不统一对接的地址，请求路径不统一
    if (name === 'Sepolia' || name === 'Holesky') {
      fetchUrl = `${process.env.TOKEN_REQUEST_HOST}/ether/request`;
    }

    const response = await axios.post(fetchUrl, {
      address,
      network,
      amount: cryptoCurrency?.claimAmount,
    }, {
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      timeout: 30000 // 10秒超时
    });
    console.log(">response", response.data)
    return response?.data
  } catch (error: any) {
    console.error('Error requesting token:', error);
    return { success: false, message: error?.message };
  }
}