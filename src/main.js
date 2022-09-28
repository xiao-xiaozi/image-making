import { createApp } from "vue";
import { createPinia } from "pinia";
import "normalize.css";
import "./style.css";
import "@/assets/style/iconfont/iconfont.css";

import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
