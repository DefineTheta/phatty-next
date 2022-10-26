import { fetchPrices, tokenImages, tplsClient } from '@app-src/services/web3';
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

const phattyUIDataProviderABI = [
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'contract IChainlinkAggregator',
        name: 'plsUsdPriceOracle',
        type: 'address'
      }
    ],
    name: 'getPhiatReserveData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'decimals',
            type: 'uint256'
          },
          {
            internalType: 'uint128',
            name: 'variableBorrowBps',
            type: 'uint128'
          },
          {
            internalType: 'uint128',
            name: 'stableBorrowBps',
            type: 'uint128'
          },
          {
            internalType: 'bool',
            name: 'stableBorrowRateEnabled',
            type: 'bool'
          },
          {
            internalType: 'address',
            name: 'aTokenAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'stableDebtTokenAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'priceInPls',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'priceInUsd',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      }
    ],
    name: 'getPhiatStakingData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'stakingToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalStakedSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakingTokenPrecision',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'rewardDuration',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakeDuration',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawDuration',
            type: 'uint256'
          },
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
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'rewardsPerToken',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPhiatStakingUserData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'walletBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawTimestamp',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawableBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'expirationTimestamp',
            type: 'uint256'
          },
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
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'claimableRewards',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUserStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPhiatStakingUsersData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'walletBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawableBalance',
            type: 'uint256'
          },
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
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'claimableRewards',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUsersStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPhiatUserData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'aTokenBalance',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'usageAsCollateralEnabledOnUser',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'variableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'principalStableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stableBorrowRate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stableBorrowLastUpdateTimestamp',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUserReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPhiatUsersData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'aTokenBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'variableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'principalStableDebt',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUsersReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      }
    ],
    name: 'getPulsexPoolData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'token0',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name0',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'name1',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol0',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol1',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'decimals0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'decimals1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      }
    ],
    name: 'getPulsexPools',
    outputs: [
      {
        internalType: 'address[]',
        name: 'pools',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPulsexUserData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance1',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexUserPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPulsexUsersData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance1',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexUserPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const phiatFeeAddress = '0x2761E22bE85f1F485059BCB9DB481EA4b9f90B45';
const phiatTokenAddress = '0x609BFD40359B3656858D83dc4c4E40D4fD34737F';
const phsacAddress = '0x609BFD40359B3656858D83dc4c4E40D4fD34737F';
const plsUsdPriceOracle = '0x2b8a4e53D0d46B91fb581a99893A9791F054b74e';
const phattyUIDataProviderAddress = '0x050faCf199CE9bF0E982619880225C55c90b2536';
const lendingPoolProviderAdd = '0xa17f0A2634aE032dC9a4dD74F9f7D0beb194f320';

const phiatFeeContract = new tplsClient.eth.Contract(phiatFeeABI as AbiItem[], phiatFeeAddress);
const phiatTokenContract = new tplsClient.eth.Contract(
  phiatTokenABI as AbiItem[],
  phiatTokenAddress
);
const phiatProviderContract = new tplsClient.eth.Contract(
  phattyUIDataProviderABI as AbiItem[],
  phattyUIDataProviderAddress
);

type PhiatReserveDataItem = {
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
  variableBorrowBps: string;
  stableBorrowBps: string;
  stableBorrowRateEnables: boolean;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  priceInPls: string;
  priceInUsd: number;
};

type PhiatReserveResponse = PhiatReserveDataItem[];

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

  if (!address) return res.status(400);

  const page: number = Number(req.query.page || 1);

  if (page < 1) return res.status(400);

  const price = await fetchPrices();

  if (!price) return res.status(500);

  const reserverDataPromise = phiatProviderContract.methods
    .getPhiatReserveData(lendingPoolProviderAdd, plsUsdPriceOracle)
    .call();
  const userDataPromise = phiatProviderContract.methods
    .getPhiatUserData(lendingPoolProviderAdd, address)
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

// async function getPhiatDetails(testAdd) {
//   let phiatReserveData = await phiatProviderContract.methods
//     .getPhiatReserveData(lendingPoolProviderAdd, plsUsdPriceOracle)
//     .call();

//   function getTokenPX(tokenAdd_, tokenRes_) {
//     for (var i = 0; i < tokenRes_.length; i++) {
//       if (tokenAdd_ == tokenRes_[i]['underlyingAsset']) {
//         return [tokenRes_[i]['symbol'], tokenRes_[i]['decimals'], tokenRes_[i]['priceInUsd']];
//       }
//     }
//   }

//   let phiatDetails = {
//     stableDebt: [],
//     variableDebt: [],
//     Lending: [],
//     Staking: []
//   };
//   let zeroBal = true;

//   let userData = await providerContract.methods
//     .getPhiatUserData(lendingPoolProviderAdd, testAdd)
//     .call();
//   userData.forEach(function (element, index) {
//     let tokenPX = getTokenPX(element.underlyingAsset, phReserve);

//     if (element.aTokenBalance > 0) {
//       zeroBal = false;
//       phiatDetails['Lending'].push({
//         tokenAdd: element.underlyingAsset,
//         balance: element.aTokenBalance / 10 ** tokenPX[1],
//         tokenSymbol: tokenPX[0],
//         usdValue: (element.aTokenBalance * tokenPX[2]) / 10 ** tokenPX[1] / 10 ** 18
//       });
//     }

//     if (element.variableDebt > 0) {
//       zeroBal = false;
//       phiatDetails['variableDebt'].push({
//         tokenAdd: element.underlyingAsset,
//         balance: element.variableDebt / 10 ** tokenPX[1],
//         tokenSymbol: tokenPX[0],
//         usdValue: (element.variableDebt * tokenPX[2]) / 10 ** tokenPX[1] / 10 ** 18
//       });
//     }

//     if (element.principalStableDebt > 0) {
//       zeroBal = false;
//       phiatDetails['stableDebt'].push({
//         tokenAdd: element.principalStableDebt,
//         balance: element.variableDebt / 10 ** tokenPX[1],
//         tokenSymbol: tokenPX[0],
//         usdValue: (element.principalStableDebt * tokenPX[2]) / 10 ** tokenPX[1] / 10 ** 18
//       });
//     }
//   });

//   let userStake = await feeContract.methods.stakedBalance(testAdd).call();
//   let phsacADD = '0x609BFD40359B3656858D83dc4c4E40D4fD34737F';
//   let phsacPX = await axios.get('https://phiat.finance/getPulseXTokenPX?add=' + phsacADD);
//   phsacPX = await phsacPX.data;
//   phsacPX = phsacPX['price'];
//   if (userStake > 0) {
//     phiatDetails['Staking'].push({
//       tokenSymbol: 'PHSAC',
//       balance: userStake / 10 ** 18,
//       usdValue: (userStake / 10 ** 18) * phsacPX
//     });
//   }

//   let userRewards = await feeContract.methods.claimableRewards(testAdd).call(); // this has aToken
//   let phTokens = [
//     { tokenSymbol: 'phPLS', tokenAdd: '0x189246E1451757938b4C43c5309e54f5587C6DCC' },
//     { tokenSymbol: 'phPHIAT', tokenAdd: '0xc70Cbbadc81b0D39A5E8a5D4C565f6a64896D6D3' },
//     { tokenSymbol: 'phHEX', tokenAdd: '0xC5106910120cedC9b213fb29D0f03F760702599b' },
//     { tokenSymbol: 'phPLSX', tokenAdd: '0x74a2B18310E75697Abb484F6b47CFe51FE6d714A' },
//     { tokenSymbol: 'phHDRN', tokenAdd: '0xb729391DF6a6cbeB0Fe14c0f4b45355b4942CF84' },
//     { tokenSymbol: 'phHELGO', tokenAdd: '0x77AD698773699eFBA06d6b477B5eF5Ab86170d5e' },
//     { tokenSymbol: 'phUSDC', tokenAdd: '0x0D14F7b11fCBa90E66E7b26F21cf875Ddc83fF39' }
//   ];
//   for (let i = 0; i < phTokens.length; i++) {
//     userRewards.forEach(function (element) {
//       if (phTokens[i]['tokenAdd'] == element['token']) {
//         phTokens[i]['amount'] = element['amount'];
//       }
//     });
//   }
//   for (let j = 0; j < phTokens.length; j++) {
//     let reward = phTokens[j];
//     phReserve.forEach(function (element) {
//       if (element['aTokenAddress'] == reward['tokenAdd']) {
//         phTokens[j]['_symbol'] = element['symbol'];
//         phTokens[j]['balance'] = reward['amount'] / 10 ** element['decimals'];
//         phTokens[j]['usdValue'] = (reward['balance'] * element['priceInUsd']) / 10 ** 18;
//       }
//     });
//   }
//   phiatDetails['phTokens'] = phTokens;

//   let rwds = await providerContract.methods.getPhiatStakingData(feeAdd).call();
//   rwds = rwds.rewardsPerToken;
//   let apyUSD = 0;
//   for (let i = 0; i < rwds.length; i++) {
//     let reward = rwds[i];
//     phReserve.forEach(function (element) {
//       if (element['aTokenAddress'] == reward['token']) {
//         apyUSD +=
//           ((reward['amount'] / 10 ** element['decimals']) * element['priceInUsd']) / 10 ** 18;
//       }
//     });
//   }
//   let apy = (apyUSD * 52) / phsacPX;
//   phiatDetails['stakingAPY'] = apy;

//   console.log(phiatDetails);
//   return phiatDetails;
// }
