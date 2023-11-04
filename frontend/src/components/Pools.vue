<template>
  <div class="body-container">
    <div class="swap-container">
      <div>Add liquidity</div>
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
  height: 372px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0f0f0f;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: 1px 2px 3px 4px rgba(255, 0, 122, 0.4);
}

div.token-input-container {
  width: 444px;
  height: 118px;
  background-color: #323232;
  border-radius: 10px;
  margin: 5px;
}

button.token-selector {
  padding: 10px 15px;
  border-radius: 50px;
  border: none;
  color:#fefefe;
  background: rgb(255, 0, 122);
  margin: 5px;
}

input {
  width: 292px;
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
</style>