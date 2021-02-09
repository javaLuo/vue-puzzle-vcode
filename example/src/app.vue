<template>
  <div>
    <AuthModelMy :show="show"
                 @close="onTestClose" @success="onTestClose" @fail="onTestClose"/>

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
    onTestClose() {
      console.log("出发：", this.show);
      this.show = false;
    }
  }
};
</script>