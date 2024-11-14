<template>
  <div class="body-container">
    <div class="swap-container">
      <div class="pool-navigation">
          <div class="add-liquidity">AddLiquidity</div>
          <div v-html="cogSvg" class="settings"></div>
      </div>
      <div class="select-pair-container">
        <div class="select-text-container">
          <div class="select-pair-text">Select pair</div>
        </div>
        <div class="token-select-container">
          <div class="token-selector-button-container">
            <button v-text="token1Name" @click="triggerPopUp(1)" class="token-selector"></button>
          </div>
          <div class="token-selector-button-container">
            <button v-text="token2Name" @click="triggerPopUp(2)" class="token-selector"></button>
          </div>
        </div>
      </div>
      <div class="fee-container">
        
      </div>
      <div class="current-price-container">
        <div class="current-price-text">Current price: {{ currentPrice }}</div>
      </div>
      <div class="price-range-text-container">
        <div class="price-range-text">Price range</div>
      </div>
      <div class="token-input-container">
        <div class="token-input">
          <div class="swap-text">Low price</div>
          <input v-model="token2Amount" type="number" class="token-input" placeholder="0">
        </div>
      </div>
      <div class="token-input-container">
        <div class="token-input">
          <div class="swap-text">High price</div>
          <input v-model="token2Amount" type="number" class="token-input" placeholder="0">
        </div>
      </div>
      <div class="deposit-amounts-text-container">
        <div class="deposit-amount-text">Deposit amounts</div>
      </div>
      <div class="token-input-container">
        <div class="token-input">
          <input v-model="token1Amount" type="number" class="token-input" placeholder="0">
        </div>
        <div class="token-selector-container">
          <button v-text="token1Name" @click="triggerPopUp(1)" class="token-selector"></button>
        </div>
      </div>
      <div class="token-input-container">
        <div class="token-input">
          <input v-model="token2Amount" type="number" placeholder="0">
        </div>
        <div class="token-selector-container">
          <button v-text="token2Name" @click="triggerPopUp(2)" class="token-selector"></button>
        </div>
      </div>
      <div class="confirm-button-container">
        <button @click="addLiquidity" class="confirm-button">Add liquidity</button>
      </div>
    </div>
  </div>
  <ChooseToken @select-token="setSelectedToken" v-if="getIsChooseToken() === true"/>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BigNumber, BigNumberish, FixedNumber, Signer, ethers } from "ethers";
  import { store } from '../store/store'
  import ChooseToken from '../components/ChooseToken.vue'
  import { abi as POSITION_MANAGER_ABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
  import { abi as FACTORY_ABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
  import { abi as POOL_ABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
  import { DRUM_TOKEN_ADDRESS, DON_TOKEN_ADDRESS, DKO_TOKEN_ADDRESS } from "../main"
  const feather = require('feather-icons')
  import { Token, BigintIsh, Percent } from '@uniswap/sdk-core'
  import { Pool, Position, nearestUsableTick, NonfungiblePositionManager, MintOptions  } from '@uniswap/v3-sdk'
  const bn = require('bignumber.js')
  const ERC20_ABI = require("../assets/erc20_abi.json")
  import JSBI from 'jsbi'

  bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })

  const fee = 3000;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
  const sqrtPriceLimitX96 = 0;
  const chainId = 167007;
  const tokenDecimals = 18;
  const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  let getPositionManager = () => {
    if ((window as any).ethereum) {
      let contract = new ethers.Contract("0xbe06Db6d83FCD830A7DA1442fF9c0836EaD98209", POSITION_MANAGER_ABI, signer);
      return contract;
    }
  }

  let getFactory = () => {
    if ((window as any).ethereum) {
      let contract = new ethers.Contract("0xf69251C51cfBc28b112248D0E9B6a8CD58859dd8", FACTORY_ABI, signer);
      return contract;
    }
  }

  let getPoolAddress = async (address1: string, address2: string)=> {
    let poolAddress = await getFactory()?.getPool(address1, address2, "3000");
    console.log(poolAddress)
    return poolAddress;
  }

  function encodePriceSqrt(reserve1: number, reserve0: number) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  )
}
  
  
  export default defineComponent({
    data() {
      return {
        token1Amount: "",
        token2Amount: "",
        token1Name: "Choose a token",
        token2Name: "Choose a token",
        currentPrice: "",
      }
    },
    methods: {
      triggerPopUp(tokenIndex: number) {
        store.state.tokenIndex = tokenIndex;
        store.state.isChooseToken = true;
      },
      getIsChooseToken() {
        return store.state.isChooseToken;
      },
      setSelectedToken(tokenName: string) {
        if(store.state.tokenIndex === 1) {
          this.token1Name = tokenName;
        } else {
          this.token2Name = tokenName;
        }
      },
      switchTokens() {
        let tmp = this.token1Name;
        this.token1Name = this.token2Name;
        this.token2Name = tmp;
      },
      async addLiquidity() { //TODO: Get token informations from a json tokenlist
        let token1: Token = new Token(chainId, DRUM_TOKEN_ADDRESS, tokenDecimals, this.token1Name, "DrumSwapToken");
        let token2: Token = new Token(chainId, DRUM_TOKEN_ADDRESS, tokenDecimals, this.token1Name, "DrumSwapToken");
        let address1 = "";
        let address2 = "";
        let token1Contract;
        let token2Contract;
        
        if(this.token1Name === "DRUM") {
          token1 = new Token(chainId, DRUM_TOKEN_ADDRESS, tokenDecimals, this.token1Name, "DrumSwapToken");
          address1 = DRUM_TOKEN_ADDRESS;
          token1Contract = new ethers.Contract(DRUM_TOKEN_ADDRESS, ERC20_ABI, signer);
        } else if(this.token1Name === "DON") {
          token1 = new Token(chainId, DON_TOKEN_ADDRESS, tokenDecimals, this.token1Name, "DonChanToken");
          address1 = DON_TOKEN_ADDRESS;
          token1Contract = new ethers.Contract(DON_TOKEN_ADDRESS, ERC20_ABI, signer);
        } else if(this.token1Name === "DKO") {
          token1 = new Token(chainId, DKO_TOKEN_ADDRESS, tokenDecimals, this.token1Name, "DaikoToken");
          address1 = DKO_TOKEN_ADDRESS;
          token1Contract = new ethers.Contract(DKO_TOKEN_ADDRESS, ERC20_ABI, signer);
        }
        if(this.token2Name === "DRUM") {
          token2 = new Token(chainId, DRUM_TOKEN_ADDRESS, tokenDecimals, this.token2Name, "DrumSwapToken");
          address2 = DRUM_TOKEN_ADDRESS;
          token2Contract = new ethers.Contract(DRUM_TOKEN_ADDRESS, ERC20_ABI, signer);
        } else if(this.token2Name === "DON") {
          token2 = new Token(chainId, DON_TOKEN_ADDRESS, tokenDecimals, this.token2Name, "DonChanToken");
          address2 = DON_TOKEN_ADDRESS;
          token2Contract = new ethers.Contract(DON_TOKEN_ADDRESS, ERC20_ABI, signer);
        } else if(this.token2Name === "DKO") {
          token2 = new Token(chainId, DKO_TOKEN_ADDRESS, tokenDecimals, this.token2Name, "DaikoToken");
          address2 = DKO_TOKEN_ADDRESS;
          token2Contract = new ethers.Contract(DKO_TOKEN_ADDRESS, ERC20_ABI, signer);
        }

        //let asd = await token1Contract?.approve("0xbe06Db6d83FCD830A7DA1442fF9c0836EaD98209", BigNumber.from(this.token1Amount).mul(BigNumber.from(10).pow(18)));
        //asd = await token2Contract?.approve("0xbe06Db6d83FCD830A7DA1442fF9c0836EaD98209", BigNumber.from(this.token2Amount).mul(BigNumber.from(10).pow(18)));

        let poolAddress = await getPoolAddress(address1, address2);
        const positionManager = getPositionManager();
        let price = (parseInt(this.token2Amount) / parseInt(this.token1Amount));
        let sqrtPriceX96 = encodePriceSqrt(parseInt(this.token1Amount), parseInt(this.token2Amount));
        if(poolAddress === "0x0000000000000000000000000000000000000000") {
          await positionManager?.createAndInitializePoolIfNecessary(address2, address1, 3000, sqrtPriceX96,
          { gasLimit: 5000000 });
        }
        poolAddress = await getPoolAddress(address1, address2);
        console.log(poolAddress)
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);

        let getPoolData = async (poolContract: any) => {
          const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
            poolContract.tickSpacing(),
            poolContract.fee(),
            poolContract.liquidity(),
            poolContract.slot0(),])

            return {
              tickSpacing: tickSpacing,
              fee: fee,
              liquidity: liquidity,
              sqrtPriceX96: slot0[0],
              tick: slot0[1],
            }
        }

        console.log(await getPoolData(poolContract));
        const poolData: any = await getPoolData(poolContract);
        const pool = new Pool(token1, token2, poolData.fee, poolData.sqrtPriceX96.toString(), poolData.liquidity.toString(), poolData.tick);
        const amount0: BigintIsh = parseInt(this.token1Amount) ** 18;
        const amount1: BigintIsh = parseInt(this.token2Amount) ** 18;

        console.log(amount0)
        console.log(amount1)

        const position = Position.fromAmounts({
          pool: pool,
          tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
          tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
          amount0: amount0,
          amount1: amount1,
          useFullPrecision: true,
        })

        const mintOptions: MintOptions = {
          recipient: store.state.address,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          slippageTolerance: new Percent(50, 10_000),
        }

        const { calldata, value } = NonfungiblePositionManager.addCallParameters(
          position,
          mintOptions
        )

        const transaction = {
          data: calldata,
          to: "0xbe06Db6d83FCD830A7DA1442fF9c0836EaD98209",
          value: value,
          from: store.state.address,
          maxFeePerGas: 1000000,
          maxPriorityFeePerGas: 1000000,
        }

        const tx = await signer.sendTransaction(transaction);
        console.log(tx);
      }
    },
    components: {
      ChooseToken
    },
    computed: {
      cogSvg: function() {
        return feather.icons["settings"].toSvg();
      }
    }
  });
</script>
  
<style scoped>
div.body-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 92vh;
}

div.swap-container {
  width: 462px;
  max-width: 90vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0f0f0f;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: 4px 5px 6px 7px rgba(255, 0, 122, 0.4);
}

div.token-input-container {
  display: flex;
  width: 90%;
  height: 10%;
  background-color: #323232;
  border-radius: 10px;
  margin: 10px;
}

button.token-selector {
  width: 100%;
  padding: 10px 15px;
  border-radius: 50px;
  border: none;
  color:#fefefe;
  background: rgb(255, 0, 122);
  cursor: pointer;
}

input {
  height: 100%;
  background-color: #323232;
  border: none;
  outline: none;
  color: white;
  margin: 5px;
}

::placeholder {
  color: #999;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

div.swap-text {
  margin: 5px;
  color: #999;
}

div.token-input {
  width: 100%;
  display: flex;
  flex-direction: column;
}

div.confirm-button-container {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 10px;
}

button.confirm-button {
  width: 100%;
  height: 100%;
  padding: 10px 0px;
  background-color: rgb(255, 0, 122);
  color:#fefefe;
}


button.confirm-button:hover, button.token-selector:hover {
  cursor: pointer;
  background-color: rgba(255, 0, 122, 0.8);
}

div.create-pool {
  cursor: pointer;
  margin-right: 5px;
}

div.create-pool:hover {
  color: rgba(255, 255, 255, 0.6);
}

div.add-liquidity {
  font-weight: bold;
}

div.pool-navigation {
  display: flex;
  width: 90%;
  justify-content: space-between;
  margin: 10px;
}

div.token-selector-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

div.select-pair-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

div.token-select-container {
  width: 95%;
  display: flex;
}

div.token-selector-button-container {
  margin: 5px;
  width: 50%;
}

div.select-text-container, div.price-range-text-container, div.current-price-container, div.deposit-amounts-text-container {
  width: 90%;
  display: flex;
  justify-content: start;
  margin: 10px;
}
</style>