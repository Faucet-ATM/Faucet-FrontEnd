export const faucetPort = {
  "bitcoin": 6001,
  "sui": 6002,
  "solana": 6003,
  "fuel": 6004,
  "aptos": 6005,
  "ethereum": 6005,
  // "polygon": 6006,
  "avalanche": 6007,
  "near": 6008,
  "aurora": 6009,
  "mantle": 7080,
} as const

export type FaucetPortKeys = keyof typeof faucetPort;
