<script lang="ts">
  import { defineComponent, onMounted, ref, computed } from "vue";
  import { key, store } from '../store/store'
  const isMetamaskSupported = ref(false);
  onMounted(() => {
    isMetamaskSupported.value = (window as any).ethereum != "undefined";
  })
  export default defineComponent({
    methods: {
      setActive() {
        let navbar = document.getElementById("nav-bar");
        navbar?.classList.toggle("active");
      },
      async connectWallet() {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        store.state.address = accounts[0];
        store.state.isWalletConnected = true;
      },
      getIsWalletConnected() {
        return store.state.isWalletConnected;
      },
      getAddress() {
        return store.state.address.substring(0,6) + "..." + store.state.address.substring(38,42);
      },
      disconnectWallet() {
        store.state.isWalletConnected = false;
      }
    }
  })
</script>

<template>
  <header>
    <router-link to="/" id="logo">DrumSwap</router-link>
    <div id="hamburger" @click="setActive">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <nav id="nav-bar">
      <ul>
        <li>
          <router-link to="/" class="active">Swap</router-link>
        </li>
        <li>
          <router-link to="/pools" >Pools</router-link>
        </li>
      </ul>
    </nav>
    <div class="connect-wallet-container">
      <div class="address" v-if="getIsWalletConnected() === true">{{ getAddress() }}</div>
      <a class="connect-wallet" @click="disconnectWallet" v-if="getIsWalletConnected() === true">Disconnect</a>
      <a class="connect-wallet" @click="connectWallet()" v-if="getIsWalletConnected() === false">Connect Wallet</a>
    </div>
    
  </header>
</template>

<style scoped>
header {
  height: 8vh;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4vw;
}

#logo {
  width: 150px;
  font-size: 28px;
  font-weight: bold;
  color: rgb(255, 0, 122);
}

#hamburger {
  display: none;
}

#nav-bar ul {
  display: flex;
}

#nav-bar ul li a {
  display: block;
  color: #fefefe;
  font-size: 2vh;
  padding: 2vh 25px;
  transition: 0.2s;
}

#nav-bar ul li a:hover {
  color:rgb(255, 0, 122);
  border-bottom: 1px solid rgb(255, 0, 122);
}

#nav-bar ul li a.active{
  color:rgb(255, 0, 122);
  border-bottom: 1px solid rgb(255, 0, 122);
}

a.connect-wallet {
  width: 150px;
  padding: 10px 25px;
  text-align: center;
  border-radius: 50px;
  color:#fefefe;
  background: rgb(255, 0, 122);
  margin: 0px 0px 0px 20px;
  cursor: pointer;
}

a.connect-wallet:hover {
  background-color: rgba(255, 0, 122, 0.8);
}

div.connect-wallet-container {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  
}

@media only screen and (max-width: 900px) {
  #hamburger {
    display: block;
    cursor: pointer;
  }

  #hamburger .line {
    width: 30px;
    height: 3px;
    background: #fefefe;
    margin: 6px 0;
  }

  #nav-bar {
    position: absolute;
    top: 8vh;
    left: 0;
    right: 0;
    width: 100vw;
    background: #11101b;
    transition: 0.2s;
    opacity: 0;
  }

  #nav-bar.active{
    height: 92vh;
    opacity: 1;
  }

  #nav-bar ul {
    display: block;
    margin: none;
    text-align: center;
    transition: 0.2s;
  }

  #nav-bar ul li a {
    padding: 3vh 0vw;
    width: 100%;
    border-bottom: 1px solid grey;
  }

  #nav-bar ul li:first-child a {
    border-top: 1px solid grey;
  }

  #nav-bar ul li a:hover {
  color:rgb(255, 0, 122);
  border-bottom: 1px solid grey;
  }

  #nav-bar ul li a.active{
    color:rgb(255, 0, 122);
    border-bottom: 1px solid grey;
  }

  #logo {
    display: none;
  }
}
</style>