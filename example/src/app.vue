<template>
  <div>
    <AuthModelMy :show="isShow"
                 @close="onClose" @success="onSuccess" @fail="onFail"/>

    <hr />
    <button @click="onShow">开始验证</button>
  </div>
</template>
<script>
import { ref } from "vue";
import AuthModelMy from "../../dist/vue3-puzzle-vcode.umd.min.js";
// import AuthModelMy from "../../src/app.vue";
import Img1 from "./assets/1.jpg";
export default {

  components: {
    AuthModelMy
  },
  setup(){
    const isShow = ref(false);
    const onShow = () => {
      isShow.value = true;
    }
    const onClose = () => {
      isShow.value = false;
    }

    const onSuccess = (e) => {
      console.log('验证成功:', e);
      onClose();
    }

    const onFail = (e) => {
      console.log('验证失败:', e);
      onClose();
    }
    return {
      isShow,
      onShow,
      onClose,
      onSuccess,
      onFail
    }
  }
};
</script>