<template>
  <div class="boss">
      <div class="title">vue3-puzzle-vcode DEMO</div>
      <a href="https://www.npmjs.com/package/vue3-puzzle-vcode" rel="nofollow">
        <img src="https://camo.githubusercontent.com/bc3ee51ae20807740d3116de953937a749239cc75e48523d084825f297bd19d3/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f767565332d70757a7a6c652d76636f64652e737667" alt="npm" data-canonical-src="https://img.shields.io/npm/v/vue3-puzzle-vcode.svg" style="max-width:100%;">
      </a>
      <el-divider>基本</el-divider>
      <el-button plain @click="onShow1">开始验证</el-button>
      <div class="info">调整拼图块尺寸(puzzleScale, 单位：倍率，默认1)</div>
      <div class="slider"><el-slider v-model="slider1" :min="0.5" :max="2" :step="0.1"></el-slider></div>
      <div class="info">调整滑块尺寸(sliderSize, 单位：px, 默认50)</div>
      <div class="slider"><el-slider v-model="slider2" :min="20" :max="100" :step="1"></el-slider></div>
      <el-divider>自定义图片</el-divider>
      <el-button plain @click="onShow2">开始验证</el-button>
      <div class="info">图片宽高比例无所谓，最好是长方形，最后会以cover方式赋给canvas</div>
      <a class="link" href="https://github.com/javaLuo/vue-puzzle-vcode" target="_blank" rel="nofollow">github</a>
  </div>
    <Vcode :show="isShow1" @success="onSuccess1" @close="onClose1" :puzzleScale="slider1" :sliderSize="slider2"/>
    <Vcode :show="isShow2" @success="onSuccess2" @close="onClose2" :imgs="imgs" />
</template>

<script>
import {ref} from 'vue';
import { ElMessage } from 'element-plus';
import Vcode from "vue3-puzzle-vcode";
import Img1 from "./assets/1.png";
import Img2 from "./assets/2.png";
import Img3 from "./assets/3.png";
import Img4 from "./assets/4.png";
import Img5 from "./assets/5.png";
import Img6 from "./assets/6.png";

export default {
  name: "App",
  components: {
    Vcode
  },
  setup(){
    const slider1 = ref(1);
    const slider2 = ref(50);

    const isShow1 = ref(false);
    const onShow1 = () => {
      isShow1.value = true;
    };

    const onClose1 = () => {
      isShow1.value = false;
    };

    const onSuccess1 = (e) => {
      ElMessage({
        message: `验证成功：${e}`,
        duration: 2000
      });
      onClose1();
    };

    const imgs = [
      Img1,
      Img2,
      Img3,
      Img4,
      Img5,
      Img6
    ];
    const isShow2 = ref(false);
    const onShow2 = () => {
      isShow2.value = true;
    };

    const onClose2 = () => {
      isShow2.value = false;
    };

    const onSuccess2 = (e) => {
      ElMessage({
        message: `验证成功：${e}`,
        duration: 2000
      });
      onClose2();
    };

    return {
      slider1,
      slider2,
      isShow1,
      onShow1,
      onClose1,
      onSuccess1,
      isShow2,
      imgs,
      onShow2,
      onClose2,
      onSuccess2,
    }
  }
};
</script>

<style lang="less">
  .boss{
    max-width: 750px;
    margin:0 auto;
    text-align: center;
    .title{
      font-size: 24px;
      padding: 40px 0 20px 0;
    }
    .slider{
      width: 240px;
      margin:0 auto;
    }
    .info{
      margin: 20px 0;
      color: #888;
      font-size: 13px;
    }
    .link{
      color: #427ed8;
      text-decoration: none;
      margin-top: 40px;
      &:hover{
        color:#5994ec;
      }
    }
  }
</style>
