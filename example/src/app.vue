<template>
  <div>
    <AuthModelMy :show="show"
                 @onClose="onTestClose" />

    <hr />
    <button @click="onTest">验证</button>
  </div>
</template>
<script>
import AuthModelMy from "../../dist/main.js";
// import AuthModelMy from "../../src/app.vue";
import Img1 from "./assets/1.jpg";
export default {
  data() {
    return {
      imgs: [Img1],
      show: true
    };
  },
  components: {
    AuthModelMy
  },
  methods: {
    onTest() {
      this.show = true;
    },
    onTestClose() {
      this.show = false;
    }
  }
};
</script>