import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key} from "./store/store"
import './assets/main.css'

export const DRUM_TOKEN_ADDRESS = "0xA4e4d73c084bEcFc2F04cF259711AF9B3BC203f5";
export const DON_TOKEN_ADDRESS = "0xC12cAc786dc8547534Acf849D26010b8bf1EaFBb";
export const DKO_TOKEN_ADDRESS = "0x2Bda99276bDDc8f31E9974637A2d6924846a11B1";

createApp(App)
.use(store, key)
.use(router)
.mount('#app')
