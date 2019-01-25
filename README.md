# vue-puzzle-vcode [![npm](https://img.shields.io/npm/v/vue-puzzle-vcode.svg)](https://www.npmjs.com/package/vue-puzzle-vcode) 

Vue 纯前端的拼图人机验证、右滑拼图验证<br/>
我知道有第 3 方的很好用,比如 GEETEST 的拼图验证，但要引入 SDK 跟后台配合，还有接口交互。<br/>
太麻烦了，有时候突然改需求来不及弄，为了应付老板，就弄了个纯前端的随便验一下得了。

![img](public/demo.gif)


### 安装

```
  npm install vue-puzzle-vcode --save
```

### 使用

```
import Vcode from "vue-puzzle-vcode";

<Vcode
  :show="isShow"
  @onSuccess="onSuccess"
/>
```

### 最简单例子

```vue
<template>
  <Vcode
    :show="isShow"
    @onSuccess="onSuccess"
    @onClose="onClose"
  />
  <button @click="onSubmit">登录</button>
</template>

<script>
  import Vcode from "vue-puzzle-vcode";
  export default {
    data(){
      return {
        isShow: false, // 验证码模态框是否出现
      }
    },
    components:{
      Vcode
    },
    methods:{
      onSubmit(){
        this.isShow = true;
      },
      // 用户通过了验证, msg是用户移动拼图的位置和目标位置的偏差px值
      onSuccess(msg){
        this.isShow = false; // 通过验证后，需要自行隐藏模态框
      },
      // 用户点击遮罩层，应该关闭模态框
      onClose(){
        this.isShow = false;
      }
    }
  }
</script>
```

### 参数

| 字段         | 类型    | 默认值             | 说明                   |
| ------------ | ------- | ------------------ | ---------------------- |
| show         | Boolean | false              | 是否显示验证码弹框     |
| canvasWidth  | Number  | 310                | 主图区域的宽度         |
| canvasHeight | Number  | 160                | 主图区域的高度         |
| imgs         | Array   | null               | 自定义图片，见下方例子 |
| successText  | String  | "验证通过！"       | 验证成功时的提示文字   |
| failText     | String  | "验证失败，请重试" | 验证失败时的提示文字   |
| sliderText   | String  | "拖动滑块完成拼图" | 下方滑动条里的文字     |

### 事件
| 事件名    | 返回值 | 说明                                                         |
| --------- | ------ | ------------------------------------------------------------ |
| onSuccess | 偏差值 | 验证通过时会触发，返回值是用户移动的距离跟目标距离的偏差值px |
| onFail    | 偏差值 | 验证失败时会触发，返回值同上                                 |
| onClose   | null   | 用户点击遮罩层的回调                                         |

### 自定义图片

```vue
<template>
  <Vcode :imgs="[Img1, Img2]" />
</template>

<script>
import Img1 from '~/assets/img1.png';
import Img2 from '~/assets/img2.png';

export default {
  data(){
    return {
      Img1,
      Img2
    }
  }
}
</script>
```
* 也可以是网络图片完整URL路径，但注意图片跨域问题


### 说明

* 当不传递imgs字段或图片加载出错时，会自动生成随机图片
* 模态框的显示和隐藏完全由父级控制，所以用户通过验证后，需要自行隐藏模态框
