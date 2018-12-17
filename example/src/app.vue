<template>
  <div>
    <AuthModelMy :imgs="imgs"
                 :show="show"
                 @onClose="onTestClose" />

    <hr />
    <button @click="onTest">出现</button>
  </div>
</template>
<script>
import AuthModelMy from "../../dist/main.js";
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