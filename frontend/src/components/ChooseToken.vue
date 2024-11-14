<template>
  <div class="body-wrapper">
    <div class="popup-container">
      <div class="popup-header">
        <h2 class="choose-token-text">Choose a token</h2>
        <div></div>
        <div v-html="iconSvg" @click="closePopUp" class="close-button"></div>
      </div>
      <div class="search-container">
        <input class="search" type="text" placeholder="Search for tokens">
      </div>
      <div class="tokens">
        <h3>Available tokens</h3>
        <div class="token-container">
          <div @click="selectToken('DRUM')" class="token-name-container">
            <div class="token-name">DrumSwap</div>
            <div class="symbol">DRUM</div>
          </div>
          <div v-if="getIsWalletConnected()" class="token-amount">{{ token1 }}</div>
        </div>
        <div class="token-container">
          <div @click="selectToken('DON')" class="token-name-container">
            <div class="token-name">DonChan</div>
            <div class="symbol">DON</div>
          </div>
          <div v-if="getIsWalletConnected()" class="token-amount">{{ token2 }}</div>
        </div>
        <div class="token-container">
          <div @click="selectToken('DKO')" class="token-name-container">
            <div class="token-name">Daiko</div>
            <div class="symbol">DKO</div>
          </div>
          <div v-if="getIsWalletConnected()" class="token-amount">{{ token3 }}</div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { store } from '../store/store'
import { DRUM_TOKEN_ADDRESS, DON_TOKEN_ADDRESS, DKO_TOKEN_ADDRESS } from "../main"
import { ethers } from "ethers";
const ERC20_ABI = require("../assets/erc20_abi.json")
const feather = require('feather-icons')

export default defineComponent({
  data() {
    return {
      token1: "0",
      token2: "0",
      token3: "0"
    }
  },
  methods: {
    closePopUp() {
      store.state.isChooseToken = false;
    },
    selectToken(symbol: any) {
      this.closePopUp();
      this.$emit('select-token', symbol);
    },
    async getTokenBalance(symbol: any) {
      if(symbol === "DRUM") {
        const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(DRUM_TOKEN_ADDRESS, ERC20_ABI, signer);
        const balance = await contract.balanceOf(store.state.address);
        const balanceFormatted= ethers.utils.formatUnits(balance, 18)
        return balanceFormatted;
      } else if(symbol === "DON") {
        const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(DON_TOKEN_ADDRESS, ERC20_ABI, signer);
        const balance = await contract.balanceOf(store.state.address);
        const balanceFormatted= ethers.utils.formatUnits(balance, 18)
        return balanceFormatted;
      } else if(symbol === "DKO") {
        const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(DKO_TOKEN_ADDRESS, ERC20_ABI, signer);
        const balance = await contract.balanceOf(store.state.address);
        const balanceFormatted= ethers.utils.formatUnits(balance, 18)
        return balanceFormatted;
      }
      return symbol;
    },
    getIsWalletConnected() {
        return store.state.isWalletConnected;
      },
  },
  async created() {
    this.token1 = await this.getTokenBalance("DRUM")
    this.token2 = await this.getTokenBalance("DON")
    this.token3 = await this.getTokenBalance("DKO")
  },
  computed: {
      iconSvg: function() {
        return feather.icons["x"].toSvg();
      },
  },
  emits: ['select-token'],
});
</script>

<style scoped>
div.body-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgba(0,0,0,0.2);
}

div.popup-container {
  width: 462px;
  max-width: 90vw;
  height: 600px;
  background-color: #0f0f0f;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: 4px 5px 6px 7px rgba(255, 0, 122, 0.4);
}

div.popup-header {
  width: 100%;
  display: flex;
  align-items: center;
}

h2.choose-token-text {
  width: 85%;
  margin-left: 5%;
}

div.close-button {
  cursor: pointer;
}

div.close-button:hover {
  color: rgba(255, 255, 255, 0.6);
}

div.search-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

input {
  width: 80%;
  background-color: #323232;
  border: none;
  outline: none;
  color: white;
  padding: 15px;
}

::placeholder {
  color: #999;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

div.tokens {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

div.token-container {
  width: 100%;
  display: flex;
  align-items: center;
}

div.token-container:hover {
  background-color: #323232;
  cursor: pointer;
}

div.token-name-container {
  width: 80%;
  margin-left: 5%;
}

div.token-name {
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
}

div.symbol {
  font-size: 12px;
}
</style>
