import {
  fetchPrices,
  lendingPoolProviderAddress,
  phiatProviderContract,
  PhiatReserveDataItem,
  PhiatReserveResponse,
  tokenImages,
  tplsClient
} from '@app-src/services/web3';
import { PhiatData, PhiatResponse } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { AbiItem } from 'web3-utils';

const phiatFeeABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'stakingToken_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'treasury_',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Recovered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'rewardToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256'
      }
    ],
    name: 'RewardPaid',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Staked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousTreasury',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newTreasury',
        type: 'address'
      }
    ],
    name: 'TreasuryTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'UnstakeCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Unstaked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'receivedAmount',
        type: 'uint256'
      }
    ],
    name: 'Withdrawn',
    type: 'event'
  },
  {
    inputs: [],
    name: 'REWARD_DURATION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'REWARD_RATE_PRECISION_ASSIST',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'UNSTAKE_DURATION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'WITHDRAW_DURATION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      }
    ],
    name: 'addReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cancelUnstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'claimableRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        internalType: 'struct PhiatFeeDistribution.RewardAmount[]',
        name: 'rewards',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      }
    ],
    name: 'getRewardForDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      }
    ],
    name: 'lastTimeRewardApplicable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      }
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      }
    ],
    name: 'rewardPerToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'stakedBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'stakingToken',
    outputs: [
      {
        internalType: 'contract IERC20Capped',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'stakingTokenPrecision',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'tokenRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'periodFinish',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardRate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastUpdateTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardStored',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'tokens',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalStakedSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newTreasury',
        type: 'address'
      }
    ],
    name: 'transferTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'unstakedBalance',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'time',
            type: 'uint256'
          }
        ],
        internalType: 'struct PhiatFeeDistribution.TimedBalance',
        name: 'balance',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'withdrawableBalance',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'time',
            type: 'uint256'
          }
        ],
        internalType: 'struct PhiatFeeDistribution.TimedBalance',
        name: 'balance',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const phiatTokenABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_claimLockTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_claimStartTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_claimExpireTime',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_oa',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Claim',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'addClaim',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'claimByTreasury',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimExpireTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimLockTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'claimOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimStartTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256'
      }
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256'
      }
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxTreasuryMintable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'setClaim',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address'
      }
    ],
    name: 'setTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'treasuryMintedTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const phiatFeeAddress = '0x2761E22bE85f1F485059BCB9DB481EA4b9f90B45';
const phiatTokenAddress = '0x609BFD40359B3656858D83dc4c4E40D4fD34737F';
const plsUsdPriceOracle = '0x2b8a4e53D0d46B91fb581a99893A9791F054b74e';

const phiatFeeContract = new tplsClient.eth.Contract(phiatFeeABI as AbiItem[], phiatFeeAddress);
const phiatTokenContract = new tplsClient.eth.Contract(
  phiatTokenABI as AbiItem[],
  phiatTokenAddress
);

type UserDataItem = {
  underlyingAsset: string;
  aTokenBalance: number;
  usageAsCollateralEnabledOnUser: boolean;
  variableDebt: number;
  principalStableDebt: number;
  stableBorrowRate: string;
  stableBorrowLastUpdateTimes: string;
};

type UserDataResponse = UserDataItem[];

type UserRewardItem = {
  token: string;
  amount: number;
};

type UserRewardResponse = UserRewardItem[];

type PhiatStakingResponse = {
  stakingToken: string;
  totalSupply: string;
  totalStakedSupply: string;
  stakingTokenPrecisions: string;
  rewardDuration: string;
  unstakeDuration: string;
  withdrawDuration: string;
  rewardsPerToken: UserRewardItem[];
};

const calculatePhiatUserData = async (
  data: UserDataItem,
  reserveData: PhiatReserveDataItem,
  phiatData: PhiatData
) => {
  data.aTokenBalance = Number(data.aTokenBalance);
  data.variableDebt = Number(data.variableDebt);
  data.principalStableDebt = Number(data.principalStableDebt);

  if (data.aTokenBalance > 0) {
    const value = data.aTokenBalance * reserveData.priceInUsd;

    phiatData.LENDING.data.push({
      address: data.underlyingAsset,
      balance: data.aTokenBalance / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.LENDING.totalValue += value;
  }

  if (data.variableDebt > 0) {
    const value = data.variableDebt * reserveData.priceInUsd;

    phiatData.VARIABLE_DEBT.data.push({
      address: data.underlyingAsset,
      balance: data.variableDebt / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.VARIABLE_DEBT.totalValue += value;
  }

  if (data.principalStableDebt > 0) {
    const value = data.principalStableDebt * reserveData.priceInUsd;

    phiatData.STABLE_DEBT.data.push({
      address: data.underlyingAsset,
      balance: data.principalStableDebt / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.STABLE_DEBT.totalValue += value;
  }
};

const calculatePhiatToken = async (
  rewardAmount: number,
  reserve: PhiatReserveDataItem,
  phiatData: PhiatData
) => {
  const value = rewardAmount * reserve.priceInUsd;

  phiatData.PH_TOKENS.data.push({
    address: reserve.aTokenAddress,
    symbol: reserve.symbol,
    balance: rewardAmount / 10 ** reserve.decimals,
    image: tokenImages[reserve.symbol],
    usdValue: rewardAmount * reserve.priceInUsd
  });

  phiatData.PH_TOKENS.totalValue += value;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PhiatResponse>) {
  res.setHeader('Cache-Control', 's-maxage=3600');
  const { address } = req.query;

  if (!address || typeof address === 'object') return res.status(400);

  const page: number = Number(req.query.page || 1);

  if (page < 1) return res.status(400);

  const price = await fetchPrices();

  if (!price) return res.status(500);

  const reserverDataPromise = phiatProviderContract.methods
    .getPhiatReserveData(lendingPoolProviderAddress, plsUsdPriceOracle)
    .call();
  const userDataPromise = phiatProviderContract.methods
    .getPhiatUserData(lendingPoolProviderAddress, address)
    .call();
  const stakingDataPromise = phiatProviderContract.methods
    .getPhiatStakingData(phiatFeeAddress)
    .call();
  const userRewardsDataPromise = phiatFeeContract.methods.claimableRewards(address).call();
  const userStakePromise = await phiatFeeContract.methods.stakedBalance(address).call();

  const [phiatReserveData, userData, stakingData, userRewardsData, userStake] = await Promise.all<
    [PhiatReserveResponse, UserDataResponse, PhiatStakingResponse, UserRewardResponse, number]
  >([
    reserverDataPromise,
    userDataPromise,
    stakingDataPromise,
    userRewardsDataPromise,
    userStakePromise
  ]);

  const phiatReserveLookupMap: Record<string, PhiatReserveDataItem> = {};
  const phiatReserveATokenLookupMap: Record<string, PhiatReserveDataItem> = {};

  for (let i = 0; i < phiatReserveData.length; i++) {
    const data = { ...phiatReserveData[i] };
    data.decimals = Number(data.decimals);
    data.priceInUsd = Number(data.priceInUsd) / 10 ** data.decimals / 10 ** 18;
    phiatReserveLookupMap[data.underlyingAsset] = data;
    phiatReserveATokenLookupMap[data.aTokenAddress] = data;
  }

  let phiatData = {
    STABLE_DEBT: {
      data: [],
      totalValue: 0
    },
    VARIABLE_DEBT: {
      data: [],
      totalValue: 0
    },
    LENDING: {
      data: [],
      totalValue: 0
    },
    STAKING: {
      data: [],
      totalValue: 0
    },
    PH_TOKENS: {
      data: [],
      totalValue: 0
    },
    STAKING_APY: 0
  } as PhiatData;

  const userDataCountGreater = userData.length > page * 25;
  const userRewardCountGreater = userRewardsData.length > page * 25;

  const phiatUserDataPromises = [];

  for (let i = (page - 1) * 25; i < (userDataCountGreater ? page * 25 : userData.length); i++) {
    const data = { ...userData[i] };
    const reserveData = phiatReserveLookupMap[data.underlyingAsset];

    phiatUserDataPromises.push(calculatePhiatUserData(data, reserveData, phiatData));
  }

  await Promise.all(phiatUserDataPromises);

  if (userStake > 0) {
    const value = (userStake / 10 ** 18) * price['PHSAC'];

    phiatData.STAKING.data.push({
      address: '',
      balance: userStake / 10 ** 18,
      symbol: 'PHSAC',
      image: tokenImages['PHSAC'],
      usdValue: value
    });

    phiatData.STAKING.totalValue += value;
  }

  const phiatTokenPromises = [];

  for (
    let i = (page - 1) * 25;
    i < (userRewardCountGreater ? page * 25 : userRewardsData.length);
    i++
  ) {
    const rewardAmount = Number(userRewardsData[i].amount);
    const reserve = phiatReserveATokenLookupMap[userRewardsData[i].token];

    if (!reserve) continue;

    phiatTokenPromises.push(calculatePhiatToken(rewardAmount, reserve, phiatData));
  }

  await Promise.all(phiatTokenPromises);

  const stakingApyUSD = stakingData.rewardsPerToken.reduce((prev, cur) => {
    const reserve = phiatReserveATokenLookupMap[cur.token];

    if (reserve) prev += Number(cur.amount) * reserve.priceInUsd;

    return prev;
  }, 0);

  phiatData.STAKING_APY = (stakingApyUSD * 52) / price['PHSAC'];

  const resObj = {
    data: phiatData,
    next: userDataCountGreater || userRewardCountGreater ? page + 1 : null
  } as PhiatResponse;

  res.status(200).json(resObj);
}
