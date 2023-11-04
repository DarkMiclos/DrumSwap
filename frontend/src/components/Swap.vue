<template>
  <div class="body-container">
    <div class="swap-container">
      <button class="slippage-cog">Cog</button>
      <div class="token-input-container">
        <div class="swap-text">You pay</div>
        <div class="token-input">
          <input type="number" class="token-input" placeholder="0">
          <button class="token-selector">Choose a token</button>
        </div>
      </div>
      <div class="swap-direction-arrow">Arrow</div>
      <div class="token-input-container">
        <div class="swap-text">You get</div>
        <div class="token-input">
          <input type="number" class="token-input" placeholder="0">
          <button class="token-selector">Choose a token</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'App',
    components: {
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
  height: 372px;
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
  width: 444px;
  max-width: fit-content;
  height: 118px;
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

@media only screen and (max-width: 900px) {
  input {
  width: 165px;
  }
}
</style>