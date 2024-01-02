# vue3-puzzle-vcode [![npm](https://img.shields.io/npm/v/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode) [![npm downloads](https://img.shields.io/npm/dt/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode)

**DEMO**: https://isluo.com/work/vue-puzzle-vcode/

![img](public/demo.gif)

### 安装
```node
  npm install vue3-puzzle-vcode --save
```

### 最简单例子
```vue
<template>
    <Vcode :show="isShow" @success="onSuccess" @close="onClose"/>
    <button @click="onShow">开始验证</button>
</template>

<script setup>
  import { ref } from "vue";
  import Vcode from "vue3-puzzle-vcode";

  const isShow = ref(false);

  const onShow = () => {
    isShow.value = true;
  };

  const onClose = () => {
    isShow.value = false;
  };

  const onSuccess = () => {
    onClose(); // 验证成功，手动关闭模态框
  };
</script>
```

### 参数

| 字段         | 类型    | 默认值             | 说明                                                                          |
| ------------ | ------- | ------------------ | ----------------------------------------------------------------------------- |
| show         | Boolean | false              | 是否显示验证码弹框                                                            |
| type         | String  | "modal"            | "modal"模态框形式 / "inside"内嵌形式                                          |
| canvasWidth  | Number  | 310                | 主图区域的宽度，单位 px                                                       |
| canvasHeight | Number  | 160                | 主图区域的高度，单位 px                                                       |
| puzzleScale  | Number  | 1                  | 拼图块(小的拼图)的大小比例，0.2 ～ 2 ，数字越大，拼图越大                     |
| sliderSize   | Number  | 50                 | 左下角用户拖动的那个滑块的尺寸，单位 px                                       |
| range        | Number  | 10                 | 判断成功的误差范围，单位 px, 滑动的距离和拼图的距离小于等于此值时，会判定重合 |
| imgs         | Array   | null               | 自定义图片，见下方例子                                                        |
| successText  | String  | "验证通过！"       | 验证成功时的提示文字                                                          |
| failText     | String  | "验证失败，请重试" | 验证失败时的提示文字                                                          |
| sliderText   | String  | "拖动滑块完成拼图" | 下方滑动条里的文字                                                            |
| className    | String  | ""               | 给根元素一个class类用于自定义样式                                              |
| zIndex       | Number  | 999               | 设置根元素一个层级z-index                                              |
### 事件

| 事件名  | 返回值 | 说明                                                          |
| ------- | ------ | ------------------------------------------------------------- |
| success | 偏差值 | 验证通过时会触发，返回值是用户移动的距离跟目标距离的偏差值 px |
| fail    | 偏差值 | 验证失败时会触发，返回值同上                                  |
| close   | null   | 用户点击遮罩层的回调                                          |
| reset   | null   | 用户手动点击右上角刷新按钮时触发的回调                         |

### 内嵌形式

入参type="inside"， 将启用内嵌模式
应该用一个元素包裹`<Vcode />`：

```vue
<template>
  <div class="box">
    <Vcode type="inside" :show="isShow" />
  </div>
</template>

<style>
  .box{
    position: relative;
    width: 320px;
    height: auto;
  }
</style>
```

### Nuxt.js注意

Nuxt.js中如果发现样式有问题，请使用`npm install vue3-puzzle-vcode@1.1.2-nuxt`这个版本试试。

