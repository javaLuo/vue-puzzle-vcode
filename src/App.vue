

<template>
  <div @click="onClick">{{ name }}, {{ nameP }}</div>
  <div class="test">
    <Vcode
      :show="true"
      type="inside"
      :zIndex="998"
      :puzzleScale="1"
      @close="onClose"
      @success="onClose"
      @reset="onRest"
      className="test"
    />
  </div>
  
</template>

<script setup lang="ts">
// 关于打包
// 普通包，build后正常发
// nuxt包，build后把vue3-puzzle.vocde.es.js第一行改为 import "vue3-puzzle-vcode/css";
// package.json里已经配置了./css， 就是为nuxt设置的
// 发布时需要把这里的Vcode注释掉

// import { defineProps, defineEmits } from "vue";
import { ref } from "vue";
import Vcode from "./lib/main";
// import Vcode from "../dist/vue3-puzzle-vcode.es";

const $emit = defineEmits(["updata"]);

defineProps({
  nameP: { type: String, default: "小明" },
});

let name = ref("name1");

let show = ref(false);

function onClick() {
  show.value = true;
}

function onClose() {
  show.value = false;
}

function onRest() {
  console.log("重置");
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* :global(.test .vue-auth-box_) {
  background-color: #f00;
} */

.test{
  position: relative;
  width: 300px;
  height: 200px;
  background: #f00;
}
</style>
