import { createApp } from "vue";
import App from "./app.vue";
import "./registerServiceWorker";
import { ElButton, ElDivider, ElSlider } from "element-plus";

const app = createApp(App);
app.use(ElButton);
app.use(ElDivider);
app.use(ElSlider);

app.mount("#app");
