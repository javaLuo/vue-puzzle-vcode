<template>
  <div>
    <AuthModelMy
      :show="show"
      :imgs="imgs"
      @close="onTestClose"
      @success="onTestClose"/>

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
      imgs: [Img1, "https://isluo.com/kernel/index/img/welcome/girl1.png", "https://isluo.com/kernel/index/img/welcome/theback.jpg"],
      show: false
    };
  },
  components: {
    AuthModelMy
  },
  mounted() {
    // AuthModelMy({
    //   show: this.show
    // });
  },
  methods: {
    onTest() {
      this.show = true;
    },
    onFail(){

    },
    onTestClose() {
      console.log("出发：", this.show);
      this.show = false;
    }
  }
};
</script>