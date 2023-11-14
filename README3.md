# vue3-puzzle-vcode [![npm](https://img.shields.io/npm/v/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode) [![npm downloads](https://img.shields.io/npm/dt/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode)

**DEMO**: https://isluo.com/work/vue-puzzle-vcode/

![img](public/demo.gif)


### 安装 vue3-puzzle-vcode

```node
  npm install vue3-puzzle-vcode --save
```

### Nuxt3: 如果你使用Nuxt3框架，请安装以下Nuxt专用版本
```node
  npm install vue3-puzzle-vcode@1.0.15-nuxt --save
```

- 为什么要这样?<br/>
`Nuxt3`打包服务器端代码使用了`Nitro`库，这个库打包时不知为何无法识别相对路径的CSS代码，因此我为Nuxt3专门制作了一个版本<br/>
以后每次发布新的版本时，都会同时发布一个专用于`Nuxt`的版本，后缀为`-nuxt`；
### 最简单例子
```vue
<template>
    <button @click="onShow">开始验证</button>
    <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
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
    onClose(); // 验证成功，需要手动关闭模态框
  };
</script>
```

### 参数

| 字段         | 类型    | 默认值             | 说明                                                                          |
| ------------ | ------- | ------------------ | ----------------------------------------------------------------------------- |
| show         | Boolean | false              | 是否显示验证码弹框                                                            |
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

### 事件

| 事件名  | 返回值 | 说明                                                          |
| ------- | ------ | ------------------------------------------------------------- |
| success | 偏差值 | 验证通过时会触发，返回值是用户移动的距离跟目标距离的偏差值 px |
| fail    | 偏差值 | 验证失败时会触发，返回值同上                                  |
| close   | null   | 用户点击遮罩层的回调                                          |
| reset    | null  | 用户手动点击右上角刷新按钮时的回调                            |

### 自定义图片
```vue
<template>
  <Vcode :imgs="imgs" />
</template>

<script setup>
import Vcode from "vue3-puzzle-vcode";
import Img1 from "~/assets/img1.png";
import Img2 from "~/assets/img2.png";

const imgs = [Img1, Img2];

</script>
```

### 说明

- 当不传递 imgs 字段或图片加载出错时，会自动生成随机图片
- 模态框的显示和隐藏完全由父级控制，所以用户通过验证后，需要手动隐藏模态框

### 更新日志
2022/12/01 - 1.0.7<br/>
- 修复: 修复了一个在判定中关闭模态框可能会导致reset失效的问题

2022/06/02 - 1.0.6<br/>
- 更新：支持TypeScript
- 修复：修复了因vue版本不同导致的报错问题

2021/10/18 - 1.0.4<br/>
- 修复：修复了在判定状态还未刷新时关闭模态框，重新打开不刷新的问题

2021/10/13 - 1.0.3<br/>
- 修复：解决了一个在safari中无法显示拼图块的问题（safari drawImage看起来像是异步操作）

2021/10/12 - 1.0.2<br/>
- 修复：删除了一个无用的ref变量引用，这个引用可能导致在vue3.2.19及以下的版本中出现问题

2021/10/12 - 1.0.1<br/>
- 修复：重复加载图片的问题
- 修复：png图片的透明部分现在会用白色填充
- 更新：初始化时不再自动加载图片，直到show出来时再加载
