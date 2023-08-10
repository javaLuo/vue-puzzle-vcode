

<template>
  <div @click="onClick">{{ name }}, {{ nameP }}</div>
  <!-- <Vcode
    :show="show"
    :zIndex="998"
    @close="onClose"
    @success="onClose"
    @reset="onRest"
    className="test"
  /> -->
</template>

<script setup lang="ts">
// 关于打包
// 普通包，build后正常发
// nuxt包，build后把vue3-puzzle.vocde.es.js第一行改为 import "vue3-puzzle-vcode/css";
// package.json里已经配置了./css， 就是为nuxt设置的

// import { defineProps, defineEmits } from "vue";
import { ref } from "vue";
// import Vcode from "./lib/main";
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

:global(.test .vue-auth-box_) {
  background-color: #f00;
}
</style>
