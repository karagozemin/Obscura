export const dealRoomAbi = [
  {
    type: "function",
    name: "createDeal",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "metadata",
        type: "tuple",
        components: [
          { name: "title", type: "string" },
          { name: "category", type: "string" },
          { name: "maturityDate", type: "uint64" },
          { name: "description", type: "string" },
          { name: "documentHash", type: "string" }
        ]
      }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "setFundingOpen",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "setFunded",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "submitBid",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "sealedBid", type: "bytes32" },
      { name: "encryptedAmount", type: "bytes32" },
      { name: "inputProof", type: "bytes" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "repay",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "encryptedAmount", type: "bytes32" },
      { name: "inputProof", type: "bytes" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "grantAuditorAccess",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "auditor", type: "address" },
      { name: "investor", type: "address" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "closeDeal",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getDeal",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "issuer", type: "address" },
          {
            name: "metadata",
            type: "tuple",
            components: [
              { name: "title", type: "string" },
              { name: "category", type: "string" },
              { name: "maturityDate", type: "uint64" },
              { name: "description", type: "string" },
              { name: "documentHash", type: "string" }
            ]
          },
          { name: "state", type: "uint8" },
          { name: "totalCommitted", type: "bytes32" },
          { name: "totalRepaid", type: "bytes32" },
          { name: "totalClaimed", type: "bytes32" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getDealsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getBidForInvestor",
    stateMutability: "view",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "investor", type: "address" }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "sealedBid", type: "bytes32" },
          { name: "amount", type: "bytes32" },
          { name: "claimed", type: "bool" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "hasAuditorAccess",
    stateMutability: "view",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "auditor", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export const erc7984Abi = [
  {
    type: "function",
    name: "setOperator",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "until", type: "uint48" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "confidentialBalanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "bytes32" }]
  }
] as const;
