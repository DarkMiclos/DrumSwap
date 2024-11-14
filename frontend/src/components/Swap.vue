<template>
  <div class="body-container">
    <div class="swap-container">
      <div class="settings-container">
          <div v-html="cogSvg" class="settings"></div>
      </div>
      <div class="token-input-container">
        <div class="swap-text">You pay</div>
        <div class="token-input">
          <input v-model="token1Amount" type="number" class="token-input" placeholder="0">
          <button v-text="token1Name" @click="triggerPopUp(1)" class="token-selector"></button>
        </div>
      </div>
      <div v-html="downArrowSvg" @click="switchTokens" class="swap-direction-arrow"></div>
      <div class="token-input-container">
        <div class="swap-text">You get</div>
        <div class="token-input">
          <input v-model="token2Amount" type="number" class="token-input" placeholder="0">
          <button v-text="token2Name" @click="triggerPopUp(2)" class="token-selector"></button>
        </div>
      </div>
      <div class="confirm-button-container">
        <button @click="exactInputSingle(token1Amount, token2Amount)" class="confirm-button">Swap</button>
      </div>
    </div>
  </div>
  <ChooseToken @select-token="setSelectedToken" v-if="getIsChooseToken() === true"/>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ethers } from "ethers";
  import { store } from '../store/store'
  import ChooseToken from '../components/ChooseToken.vue'
  import { abi as SWAP_ROUTER_ABI } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
  const feather = require('feather-icons')

  let fee = 3000;
  let deadline = Math.floor(Date.now() / 1000) + 60 * 5;
  let sqrtPriceLimitX96 = 0;
  

  let getSwapRouter = () => {
    if ((window as any).ethereum) {
      const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract("0xBB16aA856629D0C9f6185B8d7eC4B9f095F26df4", SWAP_ROUTER_ABI, signer);
      return contract;
    }
  }
  
  
  export default defineComponent({
    data() {
      return {
        token1Amount: "",
        token2Amount: "",
        token1Name: "Choose a token",
        token2Name: "Choose a token",
      }
    },
    methods: {
      exactInputSingle(tokenIn: string, tokenOut: string) {
        let amountIn = parseInt(this.token1Amount);
        let amountOutMinimum = parseInt(this.token2Amount);
        let recipient = store.state.address;
        getSwapRouter()?.exactInputSingle(["0xA4e4d73c084bEcFc2F04cF259711AF9B3BC203f5", "0x2Bda99276bDDc8f31E9974637A2d6924846a11B1", fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96]);
      },
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
      }
    },
    components: {
      ChooseToken
    },
    computed: {
      downArrowSvg: function() {
        return feather.icons["arrow-down"].toSvg();
      },
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
  height: 420px;
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
  width: 90%;
  height: 25%;
  background-color: #323232;
  border-radius: 10px;
  margin: 20px;
}

button.token-selector {
  padding: 10px 15px;
  border-radius: 50px;
  border: none;
  color:#fefefe;
  background: rgb(255, 0, 122);
  margin: 5px 10px 30px 5px;
  cursor: pointer;
}

input {
  width: 260px;
  height: 42px;
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
  max-width: fit-content;
}

div.confirm-button-container {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 0 0 20px 0;
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

div.settings {
  cursor: pointer;
}

div.settings:hover {
  color: rgba(255, 255, 255, 0.6);
}

div.swap-direction-arrow {
  cursor: pointer;
}

div.swap-direction-arrow:hover {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
}

div.settings-container {
  display: flex;
  width: 80%;
  justify-content: end;
  margin: 20px 0 0 0;
}
</style>