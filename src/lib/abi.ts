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
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "repay",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "amount", type: "uint256" }
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
      { name: "auditor", type: "address" }
    ],
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
          { name: "totalCommitted", type: "uint256" },
          { name: "totalRepaid", type: "uint256" },
          { name: "totalClaimed", type: "uint256" }
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
          { name: "amount", type: "uint256" },
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

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
