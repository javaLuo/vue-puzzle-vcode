

<template>
  <div @click="onClick">{{ name }}, {{ nameP }}</div>
  <!-- <Vcode :show="show" @close="onClose" @success="onClose" /> -->
</template>

<script setup lang="ts">
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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
