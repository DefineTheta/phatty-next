import { bscClient, fetchPrices, tokenImages } from '@app-src/services/web3';
import { PancakeFarmTokenItem, PancakeLPTokenItem, PancakeResponse } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

const pancakeLiquidityPoolABI = [
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'Burn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' }
    ],
    name: 'Mint',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'Swap',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' }
    ],
    name: 'Sync',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'burn',
    outputs: [
      { internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_token0', type: 'address' },
      { internalType: 'address', name: '_token1', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' }
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
const pancakeFarmABI = [
  {
    inputs: [
      { internalType: 'contract IMasterChef', name: '_MASTER_CHEF', type: 'address' },
      { internalType: 'contract IBEP20', name: '_CAKE', type: 'address' },
      { internalType: 'uint256', name: '_MASTER_PID', type: 'uint256' },
      { internalType: 'address', name: '_burnAdmin', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { indexed: true, internalType: 'contract IBEP20', name: 'lpToken', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'isRegular', type: 'bool' }
    ],
    name: 'AddPool',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'EmergencyWithdraw',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'Init', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'allocPoint', type: 'uint256' }
    ],
    name: 'SetPool',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'boostContract', type: 'address' }],
    name: 'UpdateBoostContract',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'oldMultiplier', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newMultiplier', type: 'uint256' }
    ],
    name: 'UpdateBoostMultiplier',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldAdmin', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newAdmin', type: 'address' }
    ],
    name: 'UpdateBurnAdmin',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'burnRate', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'regularFarmRate', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'specialFarmRate', type: 'uint256' }
    ],
    name: 'UpdateCakeRate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'lpSupply', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'accCakePerShare', type: 'uint256' }
    ],
    name: 'UpdatePool',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'isValid', type: 'bool' }
    ],
    name: 'UpdateWhiteList',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    inputs: [],
    name: 'ACC_CAKE_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'BOOST_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'CAKE',
    outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'CAKE_RATE_TOTAL_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MASTERCHEF_CAKE_PER_BLOCK',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MASTER_CHEF',
    outputs: [{ internalType: 'contract IMasterChef', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MASTER_PID',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_BOOST_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_allocPoint', type: 'uint256' },
      { internalType: 'contract IBEP20', name: '_lpToken', type: 'address' },
      { internalType: 'bool', name: '_isRegular', type: 'bool' },
      { internalType: 'bool', name: '_withUpdate', type: 'bool' }
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'boostContract',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'burnAdmin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bool', name: '_withUpdate', type: 'bool' }],
    name: 'burnCake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bool', name: '_isRegular', type: 'bool' }],
    name: 'cakePerBlock',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cakePerBlockToBurn',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cakeRateToBurn',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cakeRateToRegularFarm',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'cakeRateToSpecialFarm',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_pid', type: 'uint256' }],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_pid', type: 'uint256' }
    ],
    name: 'getBoostMultiplier',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'harvestFromMasterChef',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'contract IBEP20', name: 'dummyToken', type: 'address' }],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastBurnedBlock',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'lpToken',
    outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'massUpdatePools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' }
    ],
    name: 'pendingCake',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint256', name: 'accCakePerShare', type: 'uint256' },
      { internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256' },
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'uint256', name: 'totalBoostedShare', type: 'uint256' },
      { internalType: 'bool', name: 'isRegular', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'poolLength',
    outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
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
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'uint256', name: '_allocPoint', type: 'uint256' },
      { internalType: 'bool', name: '_withUpdate', type: 'bool' }
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalRegularAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSpecialAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_newBoostContract', type: 'address' }],
    name: 'updateBoostContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'uint256', name: '_newMultiplier', type: 'uint256' }
    ],
    name: 'updateBoostMultiplier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_newAdmin', type: 'address' }],
    name: 'updateBurnAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_burnRate', type: 'uint256' },
      { internalType: 'uint256', name: '_regularFarmRate', type: 'uint256' },
      { internalType: 'uint256', name: '_specialFarmRate', type: 'uint256' },
      { internalType: 'bool', name: '_withUpdate', type: 'bool' }
    ],
    name: 'updateCakeRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_pid', type: 'uint256' }],
    name: 'updatePool',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'accCakePerShare', type: 'uint256' },
          { internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256' },
          { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
          { internalType: 'uint256', name: 'totalBoostedShare', type: 'uint256' },
          { internalType: 'bool', name: 'isRegular', type: 'bool' }
        ],
        internalType: 'struct MasterChefV2.PoolInfo',
        name: 'pool',
        type: 'tuple'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'bool', name: '_isValid', type: 'bool' }
    ],
    name: 'updateWhiteList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'userInfo',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
      { internalType: 'uint256', name: 'boostMultiplier', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whiteList',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const liquidityPoolContracts = [
  {
    address: '0x7efaef62fddcca950418312c6c91aef321375a00',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x7efaef62fddcca950418312c6c91aef321375a00'
    )
  },
  {
    address: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae'
    )
  },
  {
    address: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16'
    )
  },
  {
    address: '0x0ed7e52944161450477ee417de9cd3a859b14fd0',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x0ed7e52944161450477ee417de9cd3a859b14fd0'
    )
  },
  {
    address: '0xec6557348085aa57c72514d67070dc863c0a5a8c',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0xec6557348085aa57c72514d67070dc863c0a5a8c'
    )
  },
  {
    address: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc'
    )
  },
  {
    address: '0xf45cd219aef8618a92baa7ad848364a158a24f33',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0xf45cd219aef8618a92baa7ad848364a158a24f33'
    )
  },
  {
    address: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0x61eb789d75a95caa3ff50ed7e47b96c132fec082'
    )
  },
  {
    address: '0xea26b78255df2bbc31c1ebf60010d78670185bd0',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0xea26b78255df2bbc31c1ebf60010d78670185bd0'
    )
  },
  {
    address: '0xd99c7f6c65857ac913a8f880a4cb84032ab2fc5b',
    contract: new bscClient.eth.Contract(
      pancakeLiquidityPoolABI as AbiItem[],
      '0xd99c7f6c65857ac913a8f880a4cb84032ab2fc5b'
    )
  }
];

const pancakeFarmAddress = '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652';
const pancakeFarmContract = new bscClient.eth.Contract(
  pancakeFarmABI as AbiItem[],
  pancakeFarmAddress
);

const pancakeFarmAddresses = [
  { address: '0x7efaef62fddcca950418312c6c91aef321375a00', pid: 7 },
  { address: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', pid: 13 },
  { address: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16', pid: 3 },
  { address: '0x0ed7e52944161450477ee417de9cd3a859b14fd0', pid: 2 },
  { address: '0xec6557348085aa57c72514d67070dc863c0a5a8c', pid: 48 },
  { address: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc', pid: 10 },
  { address: '0xf45cd219aef8618a92baa7ad848364a158a24f33', pid: 36 },
  { address: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082', pid: 11 },
  { address: '0xea26b78255df2bbc31c1ebf60010d78670185bd0', pid: 44 }
];

type LiquidityPoolReserve = {
  _reserve0: number;
  _reserve1: number;
  blockTimestampLast: string;
};

type PancakeFarmUserInfo = {
  amount: string;
  rewardDebt: string;
  boostMultiplier: string;
};

type PhiatReserveItem = {
  symbol: string;
  address: string;
  decimals: number;
  priceInUsd: number;
};

const calculateLiquidityPool = async (
  contract: Contract,
  address: string,
  liquidityPoolAddress: string,
  phiatReserveLookupMap: Record<string, PhiatReserveItem>
) => {
  const balancePromise = contract.methods.balanceOf(address).call();
  const supplyPromise = contract.methods.totalSupply().call();
  const reservesPromise = contract.methods.getReserves().call();
  const tokenOnePromise = contract.methods.token0().call();
  const tokenTwoPromise = contract.methods.token1().call();

  let [balance, supply, reserves, tokenOneAddress, tokenTwoAddress] = await Promise.all<
    [number, number, LiquidityPoolReserve, string, string]
  >([balancePromise, supplyPromise, reservesPromise, tokenOnePromise, tokenTwoPromise]);

  balance = Number(balance);
  supply = Number(supply);

  const ratio = balance / supply;

  const tokenOneReserve = phiatReserveLookupMap[tokenOneAddress];
  const tokenTwoReserve = phiatReserveLookupMap[tokenTwoAddress];

  const tokeOneBalance = (reserves._reserve0 / 10 ** tokenOneReserve.decimals) * ratio;
  const tokenOnePrice = tokenOneReserve.priceInUsd;
  const tokenOneValue = tokeOneBalance * tokenOnePrice;
  const tokeTwoBalance = (reserves._reserve1 / 10 ** tokenTwoReserve.decimals) * ratio;
  const tokenTwoPrice = tokenTwoReserve.priceInUsd;
  const tokenTwoValue = tokeTwoBalance * tokenTwoPrice;

  const value = tokenOneValue + tokenTwoValue;

  const resObj = {
    tokenOne: {
      address: tokenOneAddress,
      balance: tokeOneBalance,
      value: tokeOneBalance * tokenOneReserve.priceInUsd,
      symbol: tokenOneReserve.symbol,
      image: tokenImages[tokenOneReserve.symbol],
      price: tokenOnePrice,
      reserve: Number(reserves._reserve0),
      decimals: tokenOneReserve.decimals
    },
    tokenTwo: {
      address: tokenTwoAddress,
      balance: tokeTwoBalance,
      value: tokenTwoValue,
      symbol: tokenTwoReserve.symbol,
      image: tokenImages[tokenTwoReserve.symbol],
      price: tokenTwoPrice,
      reserve: Number(reserves._reserve1),
      decimals: tokenTwoReserve.decimals
    },
    usdValue: value,
    liquidityPoolAddress,
    ratio,
    supply
  } as PancakeLPTokenItem;

  return resObj;
};

const calculateFarm = async (
  address: string,
  farmPID: number,
  cakePrice: number,
  liquidityPoolItem: PancakeLPTokenItem
) => {
  const userInfoPromise = await pancakeFarmContract.methods.userInfo(farmPID, address).call();
  const pendingCakePromise = await pancakeFarmContract.methods.pendingCake(farmPID, address).call();

  let [userInfo, pendingCake] = await Promise.all<[PancakeFarmUserInfo, number]>([
    userInfoPromise,
    pendingCakePromise
  ]);

  pendingCake = Number(pendingCake) / 10 ** 18;
  const pendingCakeValue = pendingCake * cakePrice;
  const ratio = Number(userInfo.amount) / liquidityPoolItem.supply;

  const tokenOneBalance =
    (liquidityPoolItem.tokenOne.reserve * ratio) / 10 ** liquidityPoolItem.tokenOne.decimals;
  const tokenOneValue = liquidityPoolItem.tokenOne.price * tokenOneBalance;
  const tokenTwoBalance =
    (liquidityPoolItem.tokenTwo.reserve * ratio) / 10 ** liquidityPoolItem.tokenTwo.decimals;
  const tokenTwoValue = liquidityPoolItem.tokenTwo.price * tokenTwoBalance;

  const value = tokenOneValue + tokenTwoValue + pendingCakeValue;

  const resObj = {
    tokenOne: {
      balance: tokenOneBalance,
      value: tokenOneValue,
      symbol: liquidityPoolItem.tokenOne.symbol,
      image: liquidityPoolItem.tokenOne.image,
      price: liquidityPoolItem.tokenOne.price
    },
    tokenTwo: {
      balance: tokenTwoBalance,
      value: tokenTwoValue,
      symbol: liquidityPoolItem.tokenTwo.symbol,
      image: liquidityPoolItem.tokenTwo.image,
      price: liquidityPoolItem.tokenTwo.price
    },
    pendingCakeBalance: pendingCake,
    usdValue: value,
    pendingCakeValue
  } as PancakeFarmTokenItem;

  return resObj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PancakeResponse>) {
  res.setHeader('Cache-Control', 's-maxage=3600');
  const { address } = req.query;

  if (!address) return res.status(400);

  let page: number = Number(req.query.page || 1);

  if (page < 1) return res.status(400);

  const price = await fetchPrices();

  if (!price) return res.status(500);

  const phiatReservesLookupMap: Record<string, PhiatReserveItem> = {
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': {
      symbol: 'ETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      decimals: 18,
      priceInUsd: price['ETH']
    },
    '0x55d398326f99059fF775485246999027B3197955': {
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      priceInUsd: price['USDT']
    },
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': {
      symbol: 'WBNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      priceInUsd: price['WBNB']
    },
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': {
      symbol: 'USDC',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      priceInUsd: price['USDC']
    },
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': {
      symbol: 'BUSD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      priceInUsd: price['BUSD']
    },
    '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D': {
      symbol: 'SHIB',
      address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
      decimals: 18,
      priceInUsd: price['SHIB']
    },
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3': {
      symbol: 'DAI',
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      decimals: 18,
      priceInUsd: price['DAI']
    },
    '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD': {
      symbol: 'LINK',
      address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
      decimals: 18,
      priceInUsd: price['LINK']
    },
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82': {
      symbol: 'CAKE',
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      decimals: 18,
      priceInUsd: price['CAKE']
    },
    '0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1': {
      symbol: 'GMT',
      address: '0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1',
      decimals: 8,
      priceInUsd: price['GMT']
    },
    '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1': {
      symbol: 'UNI',
      address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      decimals: 18,
      priceInUsd: price['UNI']
    },
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c': {
      symbol: 'WBTC',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      decimals: 18,
      priceInUsd: price['WBTC']
    }
  };

  const pancakeLiquidityPoolPromises: Promise<PancakeLPTokenItem>[] = [];

  liquidityPoolContracts.forEach((lp) => {
    pancakeLiquidityPoolPromises.push(
      calculateLiquidityPool(lp.contract, address as string, lp.address, phiatReservesLookupMap)
    );
  });

  const liquidityPoolData = await Promise.all(pancakeLiquidityPoolPromises);
  const liquidityPoolLookupMap: Record<string, PancakeLPTokenItem> = {};

  let liquidityPoolTotal = 0;
  const filteredLiqudityPoolData: PancakeLPTokenItem[] = [];

  for (let i = 0; i < liquidityPoolData.length; i++) {
    liquidityPoolLookupMap[liquidityPoolData[i].liquidityPoolAddress] = liquidityPoolData[i];

    if (liquidityPoolData[i].usdValue > 0) {
      liquidityPoolTotal += liquidityPoolData[i].usdValue;
      filteredLiqudityPoolData.push(liquidityPoolData[i]);
    }
  }

  const pancakeFarmPromises: Promise<PancakeFarmTokenItem>[] = [];

  pancakeFarmAddresses.forEach((farm) => {
    pancakeFarmPromises.push(
      calculateFarm(
        address as string,
        farm.pid,
        price['CAKE'],
        liquidityPoolLookupMap[farm.address]
      )
    );
  });

  const pancakeFarmData = await Promise.all(pancakeFarmPromises);

  let farmingTotal = 0;
  const filteredFarmData: PancakeFarmTokenItem[] = [];

  for (let i = 0; i < pancakeFarmData.length; i++) {
    if (pancakeFarmData[i].usdValue > 0) {
      farmingTotal += pancakeFarmData[i].usdValue;
      filteredFarmData.push(pancakeFarmData[i]);
    }
  }

  const resObj = {
    data: {
      LIQUIDITY_POOL: {
        data: filteredLiqudityPoolData,
        totalValue: liquidityPoolTotal
      },
      FARMING: {
        data: filteredFarmData,
        totalValue: farmingTotal
      }
    }
  } as PancakeResponse;

  res.status(200).json(resObj);
}
