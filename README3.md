# vue3-puzzle-vcode [![npm](https://img.shields.io/npm/v/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode) [![npm downloads](https://img.shields.io/npm/dt/vue3-puzzle-vcode.svg)](https://www.npmjs.com/package/vue3-puzzle-vcode)

以下是在Vue3.x中使用的文档

**DEMO**: https://isluo.com/work/vue-puzzle-vcode/

![img](public/demo.gif)


### Vue3.x 安装 vue3-puzzle-vcode

```node
  npm install vue3-puzzle-vcode --save
```

### 最简单例子
```vue
<template>
    <button @click="onShow">开始验证</button>
    <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
</template>

<script>
import { ref } from "vue";
import Vcode from "vue3-puzzle-vcode";
export default {
  components:{
    Vcode
  },
  setup() {
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

    return {
      isShow,
      onShow,
      onClose,
      onSuccess
    };
  }
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

### 事件

| 事件名  | 返回值 | 说明                                                          |
| ------- | ------ | ------------------------------------------------------------- |
| success | 偏差值 | 验证通过时会触发，返回值是用户移动的距离跟目标距离的偏差值 px |
| fail    | 偏差值 | 验证失败时会触发，返回值同上                                  |
| close   | null   | 用户点击遮罩层的回调                                          |


### 自定义图片
```vue
<template>
  <Vcode :imgs="imgs" />
</template>

<script>
import Img1 from "~/assets/img1.png";
import Img2 from "~/assets/img2.png";

export default {
  setup(){
    const imgs = [Img1, Img2];

    return {
      imgs
    }
  }
};
</script>
```

### 说明

- 当不传递 imgs 字段或图片加载出错时，会自动生成随机图片
- 模态框的显示和隐藏完全由父级控制，所以用户通过验证后，需要手动隐藏模态框

### 更新日志
2021/10/13 - 1.0.3<br/>
- 修复：解决了一个在safari中无法显示拼图块的问题（safari drawImage看起来像是异步操作）
- 
2021/10/12 - 1.0.2<br/>
- 修复：删除了一个无用的ref变量引用，这个引用可能导致在vue3.2.19及以下的版本中出现问题

2021/10/12 - 1.0.1<br/>
- 修复：重复加载图片的问题
- 修复：png图片的透明部分现在会用白色填充
- 更新：初始化时不再自动加载图片，直到show出来时再加载