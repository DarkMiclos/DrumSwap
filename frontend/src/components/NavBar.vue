<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    methods: {
      setActive() {
        let navbar = document.getElementById("nav-bar");
        navbar?.classList.toggle("active");
      },
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
    <a class="connect-wallet" href="">Connect Wallet</a>
  </header>
</template>

<style scoped>
header {
  height: 8vh;
  background: #11101b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5vw;
}

#logo {
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
  padding: 10px 25px;
  border-radius: 50px;
  color:#fefefe;
  background: rgb(255, 0, 122);
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