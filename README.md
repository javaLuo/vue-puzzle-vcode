# vue-puzzle-vcode [![npm](https://img.shields.io/npm/v/vue-puzzle-vcode.svg)](https://www.npmjs.com/package/vue-puzzle-vcode) [![npm downloads](https://img.shields.io/npm/dt/vue-puzzle-vcode.svg)](https://www.npmjs.com/package/vue-puzzle-vcode)
Vue 纯前端的拼图人机验证、右滑拼图验证<br/>
我知道有第 3 方的很好用,比如 GEETEST 的拼图验证，但要引入 SDK 跟后台配合，还有接口交互。<br/>
太麻烦了，有时候突然改需求来不及弄，为了应付老板，就弄了个纯前端的随便验一下得了。

**DEMO**: https://isluo.com/work/vue-puzzle-vcode/

![img](public/demo.gif)


## 重要更新

2020/03/16 v1.1.0 **事件名改变** <br/>
```
@onSuccess -> @success
@onClose -> @close
@onFail -> @fail
```
### 安装

```node
  npm install vue-puzzle-vcode --save
```

### 使用

```vue
import Vcode from "vue-puzzle-vcode";

<Vcode
  :show="isShow"
  @success="success"
  @close="close"
/>
```
### IE
我没加`babel-polyfill`,所以在IE10以下会报错：`SCRIPT1002: 语法错误`，<br/>
需要兼容IE的朋友，请直接复制`src/app.vue`和`src/assets`这两个东西到自己的项目里，给`app.vue`随便改个名字，就是个普通vue组件，直接用即可。<br/>
`src/assets`里是两张小图片，`app.vue`中有引用，注意自己匹配一下引用路径

### 最简单例子

```vue
<template>
  <div>
    <Vcode
      :show="isShow"
      @success="success"
      @close="close"
    />
    <button @click="submit">登录</button>
  </div>
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
      submit(){
        this.isShow = true;
      },
      // 用户通过了验证
      success(msg){
        this.isShow = false; // 通过验证后，需要手动隐藏模态框
      },
      // 用户点击遮罩层，应该关闭模态框
      close(){
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
| success | 偏差值 | 验证通过时会触发，返回值是用户移动的距离跟目标距离的偏差值px |
| fail    | 偏差值 | 验证失败时会触发，返回值同上                                 |
| close   | null   | 用户点击遮罩层的回调                                         |

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
* 也可以是网络图片完整URL路径，但注意图片跨域问题，因为canvas api无法调用跨域的图片


### 说明

* 当不传递imgs字段或图片加载出错时，会自动生成随机图片
* 模态框的显示和隐藏完全由父级控制，所以用户通过验证后，需要手动隐藏模态框
