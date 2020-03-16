<template>
  <!-- 本体部分 -->
  <div
    :id="id"
    :class="['vue-puzzle-vcode', { show: show }]"
    @mousedown="onCloseMouseDown"
    @mouseup="onCloseMouseUp"
    @touchstart="onCloseMouseDown"
    @touchend="onCloseMouseUp"
  >
    <div class="vue-auth-box" @mousedown.stop @touchstart.stop>
      <div class="auth-body" :style="`height: ${canvasHeight}px`">
        <!-- 主图，有缺口 -->
        <canvas ref="canvas1" :width="canvasWidth" :height="canvasHeight" :style="`width:${canvasWidth}px;height:${canvasHeight}px`" />
        <!-- 成功后显示的完整图 -->
        <canvas
          ref="canvas3"
          :class="['auth-canvas3', { show: isSuccess }]"
          :width="canvasWidth"
          :height="canvasHeight"
          :style="`width:${canvasWidth}px;height:${canvasHeight}px`"
        />
        <!-- 小图 -->
        <canvas
          width="70"
          class="auth-canvas2"
          :height="canvasHeight"
          ref="canvas2"
          :style="`width:70px;height:${canvasHeight}px;transform:translateX(${styleWidth - 50 - 20 * ((styleWidth - 50) / (canvasWidth - 50))}px)`"
        />
        <div :class="['loading-box', { hide: !loading }]">
          <img :src="loadingSvg" />
        </div>
        <div :class="['info-box', { show: infoBoxShow }, { fail: infoBoxFail }]">{{ infoText }}</div>
        <div
          :class="['flash', { show: isSuccess }]"
          :style="`transform: translateX(${isSuccess ? `${canvasWidth + 100}px` : '-50px'}) skew(-30deg, 0);`"
        ></div>
        <img class="reset" @click="reset" :src="resetSvg" />
      </div>
      <div class="auth-control">
        <div class="range-box">
          <div class="range-text">{{ sliderText }}</div>
          <div class="range-slider" ref="range-slider" :style="`width:${styleWidth}px`">
            <div :class="['range-btn', { isDown: mouseDown }]" @mousedown="onRangeMouseDown($event)" @touchstart="onRangeMouseDown($event)">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import resetSvg from "./assets/reset.png";
import loadingSvg from "./assets/loading.js";
export default {
  /** 私有数据 **/
  data() {
    return {
      mouseDown: false, // 鼠标是否在按钮上按下
      startWidth: 50, // 鼠标点下去时父级的width
      startX: 0, // 鼠标按下时的X
      newX: 0, // 鼠标当前的偏移X
      pinX: 0, // 拼图的起始X
      pinY: 0, // 拼图的起始Y
      loading: true, // 是否正在加在中，主要是等图片onload
      isCanSlide: false, // 是否可以拉动滑动条
      error: false, // 图片加在失败会出现这个，提示用户手动刷新
      infoBoxShow: false, // 提示信息是否出现
      infoText: "", // 提示等信息
      infoBoxFail: false, // 是否验证失败
      timer1: null, // setTimout1
      closeDown: false, // 为了解决Mac上的click BUG
      isSuccess: false, // 验证成功
      resetSvg,
      loadingSvg,
    };
  },
  /** 父级参数 **/
  props: {
    id: { type: String },
    canvasWidth: { type: Number, default: 310 }, // 主canvas的宽
    canvasHeight: { type: Number, default: 160 }, // 主canvas的高
    // 是否出现，由父级控制
    show: { type: Boolean, default: false },
    // 所有的背景图片
    imgs: {
      type: Array,
    },
    successText: {
      type: String,
      default: "验证通过！",
    },
    failText: {
      type: String,
      default: "验证失败，请重试",
    },
    sliderText: {
      type: String,
      default: "拖动滑块完成拼图",
    },
  },

  /** 生命周期 **/
  mounted() {
    document.body.appendChild(this.$el);
    document.addEventListener("mousemove", this.onRangeMouseMove, false);
    document.addEventListener("mouseup", this.onRangeMouseUp, false);

    document.addEventListener("touchmove", this.onRangeMouseMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.onRangeMouseUp, false);
    if (this.show) {
      document.body.classList.add("vue-puzzle-overflow");
    }
    this.reset();
  },
  beforeDestroy() {
    clearTimeout(this.timer1);
    document.body.removeChild(this.$el);
    document.removeEventListener("mousemove", this.onRangeMouseMove, false);
    document.removeEventListener("mouseup", this.onRangeMouseUp, false);

    document.removeEventListener("touchmove", this.onRangeMouseMove, {
      passive: false,
    });
    document.removeEventListener("touchend", this.onRangeMouseUp, false);
  },

  /** 监听 **/
  watch: {
    show(newV) {
      // 每次出现都应该重新初始化
      if (newV) {
        document.body.classList.add("vue-puzzle-overflow");
        this.reset();
      } else {
        document.body.classList.remove("vue-puzzle-overflow");
      }
    },
  },

  /** 计算属性 **/
  computed: {
    styleWidth() {
      const w = this.startWidth + this.newX - this.startX;
      return w < 50 ? 50 : w > this.canvasWidth ? this.canvasWidth : w;
    },
  },

  /** 方法 **/
  methods: {
    // 关闭
    onClose() {
      if (!this.mouseDown) {
        clearTimeout(this.timer1);
        this.$emit("close");
      }
    },
    onCloseMouseDown() {
      this.closeDown = true;
    },
    onCloseMouseUp() {
      if (this.closeDown) {
        this.onClose();
      }
      this.closeDown = false;
    },
    // 鼠标按下准备拖动
    onRangeMouseDown(e) {
      if (this.isCanSlide) {
        this.mouseDown = true;
        this.startWidth = this.$refs["range-slider"].clientWidth;
        this.newX = e.clientX || e.changedTouches[0].clientX;
        this.startX = e.clientX || e.changedTouches[0].clientX;
      }
    },
    // 鼠标移动
    onRangeMouseMove(e) {
      if (this.mouseDown) {
        e.preventDefault();
        this.newX = e.clientX || e.changedTouches[0].clientX;
      }
    },
    // 鼠标抬起
    onRangeMouseUp() {
      if (this.mouseDown) {
        this.mouseDown = false;
        this.submit();
      }
    },
    /**
     * 开始进行
     * @param withCanvas 是否强制使用canvas随机作图
     */
    init(withCanvas) {
      this.loading = true;

      const c = this.$refs.canvas1;
      const c2 = this.$refs.canvas2;
      const c3 = this.$refs.canvas3;
      const ctx = c.getContext("2d");
      const ctx2 = c2.getContext("2d");
      const ctx3 = c3.getContext("2d");
      const img = document.createElement("img");
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx2.clearRect(0, 0, 70, this.canvasHeight);

      // 取一个随机坐标，作为拼图块的位置
      this.pinX = this.getRandom(90, this.canvasWidth - 90); // 留20的边距
      this.pinY = this.getRandom(20, this.canvasHeight - 90);
      img.crossOrigin = "anonymous"; // 匿名，想要获取跨域的图片
      img.onload = () => {
        ctx.save();
        // 先画小图
        this.paintBrick(ctx);
        ctx.closePath();
        if (!(navigator.userAgent.indexOf("Firefox") >= 0 && navigator.userAgent.indexOf("Windows") >= 0)) {
          // 非火狐，在此画外阴影
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = "#000";
          ctx.shadowBlur = 5;
          ctx.fill();
        }

        ctx.clip(); // 按照外阴影区域切割

        ctx.save();
        // 小图外阴影
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.restore();
        ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        ctx3.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);

        // 设置小图的内阴影
        ctx.globalCompositeOperation = "source-atop";

        this.paintBrick(ctx);

        ctx.arc(this.pinX + 35, this.pinY + 35, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.shadowColor = "rgba(255, 255, 255, .8)";
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffaa";
        ctx.fill();

        // 将小图赋值给ctx2
        const imgData = ctx.getImageData(
          this.pinX - 3, // 为了阴影 是从-3px开始截取，判定的时候要+3px
          this.pinY - 20,
          this.pinX + 75,
          this.pinY + 50,
        );
        ctx2.putImageData(imgData, 0, this.pinY - 20);

        // 清理
        ctx.restore();
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 画缺口
        ctx.save();
        this.paintBrick(ctx);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();

        // 画缺口的内阴影
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        this.paintBrick(ctx);
        ctx.arc(this.pinX + 35, this.pinY + 35, 80, 0, Math.PI * 2, true);
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();

        // 画整体背景图
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        ctx.restore();

        this.loading = false;
      };
      img.onerror = () => {
        this.init(true); // 如果图片加载错误就重新来，并强制用canvass随机作图
      };
      if (!withCanvas && this.imgs && this.imgs.length) {
        img.src = this.imgs[this.getRandom(0, this.imgs.length - 1)];
      } else {
        img.src = this.makeImgWithCanvas();
      }
    },
    // 工具 - 范围随机数
    getRandom(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    // 绘制拼图块的路径
    paintBrick(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.pinX, this.pinY);
      ctx.lineTo(this.pinX + 15, this.pinY);
      ctx.bezierCurveTo(this.pinX + 15, this.pinY - 20, this.pinX + 15 + 20, this.pinY - 20, this.pinX + 15 + 20, this.pinY);
      ctx.lineTo(this.pinX + 15 + 20 + 15, this.pinY);
      ctx.lineTo(this.pinX + 15 + 20 + 15, this.pinY + 15);
      ctx.bezierCurveTo(
        this.pinX + 15 + 20 + 15 + 20,
        this.pinY + 15,
        this.pinX + 15 + 20 + 15 + 20,
        this.pinY + 15 + 20,
        this.pinX + 15 + 20 + 15,
        this.pinY + 15 + 20,
      );
      ctx.lineTo(this.pinX + 15 + 20 + 15, this.pinY + 15 + 20 + 15);
      ctx.lineTo(this.pinX, this.pinY + 15 + 20 + 15);
      ctx.lineTo(this.pinX, this.pinY + 15 + 20);

      ctx.bezierCurveTo(this.pinX + 20, this.pinY + 15 + 20, this.pinX + 20, this.pinY + 15, this.pinX, this.pinY + 15);
      ctx.lineTo(this.pinX, this.pinY);
    },
    // 用canvas随机生成图片
    makeImgWithCanvas() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      ctx.fillStyle = `rgb(${this.getRandom(100, 255)},${this.getRandom(100, 255)},${this.getRandom(100, 255)})`;
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      // 随机画10个图形
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `rgb(${this.getRandom(100, 255)},${this.getRandom(100, 255)},${this.getRandom(100, 255)})`;
        ctx.strokeStyle = `rgb(${this.getRandom(100, 255)},${this.getRandom(100, 255)},${this.getRandom(100, 255)})`;

        if (this.getRandom(0, 2) > 1) {
          // 矩形
          ctx.save();
          ctx.rotate((this.getRandom(-90, 90) * Math.PI) / 180);
          ctx.fillRect(
            this.getRandom(-20, this.canvasWidth - 20),
            this.getRandom(-20, this.canvasHeight - 20),
            this.getRandom(10, this.canvasWidth / 2 + 10),
            this.getRandom(10, this.canvasHeight / 2 + 10),
          );
          ctx.restore();
        } else {
          // 圆
          ctx.beginPath();
          const ran = this.getRandom(-Math.PI, Math.PI);
          ctx.arc(
            this.getRandom(0, this.canvasWidth),
            this.getRandom(0, this.canvasHeight),
            this.getRandom(10, this.canvasHeight / 2 + 10),
            ran,
            ran + Math.PI * 1.5,
          );
          ctx.closePath();
          ctx.fill();
        }
      }
      return canvas.toDataURL("image/png");
    },
    // 开始判定
    submit() {
      // 偏差
      const x = Math.abs(this.pinX - (this.styleWidth - 50) + 20 * ((this.styleWidth - 50) / (this.canvasWidth - 50)) - 3);
      if (x < 10) {
        // 成功
        this.infoText = this.successText;
        this.infoBoxFail = false;
        this.infoBoxShow = true;
        this.isCanSlide = false;
        this.isSuccess = true;
        // 成功后准备关闭
        clearTimeout(this.timer1);
        this.timer1 = setTimeout(() => {
          // 成功的回调
          this.$emit("success", x);
        }, 800);
      } else {
        // 失败
        this.infoText = this.failText;
        this.infoBoxFail = true;
        this.infoBoxShow = true;
        this.isCanSlide = false;
        // 失败的回调
        this.$emit("fail", x);
        // 800ms后重置
        clearTimeout(this.timer1);
        this.timer1 = setTimeout(() => {
          this.reset();
        }, 800);
      }
    },
    // 重置
    reset() {
      this.infoBoxFail = false;
      this.infoBoxShow = false;
      this.isCanSlide = true;
      this.isSuccess = false;
      this.startWidth = 50; // 鼠标点下去时父级的width
      this.startX = 0; // 鼠标按下时的X
      this.newX = 0; // 鼠标当前的偏移X
      this.init();
    },
  },
};
</script>
<style lang="less">
.vue-puzzle-vcode {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms;
  &.show {
    opacity: 1;
    pointer-events: auto;
  }
}
.vue-auth-box {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: #fff;
  user-select: none;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  .auth-body {
    position: relative;
    overflow: hidden;
    border-radius: 3px;
    .loading-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 20;
      opacity: 1;
      transition: opacity 200ms;
      display: flex;
      align-items: center;
      justify-content: center;
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
      img {
        width: 120px;
        height: auto;
      }
    }
    .info-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      overflow: hidden;
      font-size: 13px;
      background-color: #83ce3f;
      opacity: 0;
      transform: translateY(24px);
      transition: all 200ms;
      color: #fff;
      z-index: 10;
      &.show {
        opacity: 0.95;
        transform: translateY(0);
      }
      &.fail {
        background-color: #ce594b;
      }
    }
    .auth-canvas2 {
      position: absolute;
      top: 0;
      left: 0;
      width: 70px;
      height: 100%;
      z-index: 2;
    }
    .auth-canvas3 {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 600ms;
      z-index: 3;
      &.show {
        opacity: 1;
      }
    }
    .flash {
      position: absolute;
      top: 0;
      left: -50px;
      width: 30px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: 3;
      &.show {
        transition: transform 600ms;
      }
    }
    .reset {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 35px;
      height: auto;
      z-index: 12;
      cursor: pointer;
      transition: transform 200ms;
      transform: rotate(0deg);
      &:hover {
        transform: rotate(-90deg);
      }
    }
  }
  .auth-control {
    .range-box {
      position: relative;
      width: 100%;
      height: 50px;
      background-color: #eef1f8;
      margin-top: 20px;
      border-radius: 3px;
      box-shadow: 0 0 8px rgba(240, 240, 240, 0.6) inset;
      .range-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #b7bcd1;
      }
      .range-slider {
        position: absolute;
        height: 100%;
        width: 50px;
        background-color: rgba(106, 160, 255, 0.8);
        border-radius: 3px;
        .range-btn {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 0;
          width: 50px;
          height: 50px;
          background-color: #fff;
          border-radius: 3px;
          box-shadow: 0 0 4px #ccc;
          cursor: pointer;
          & > div {
            width: 0;
            height: 40%;

            transition: all 200ms;
            &:nth-child(2) {
              margin: 0 4px;
            }
            border: solid 1px #6aa0ff;
          }
          &:hover,
          &.isDown {
            & > div:first-child {
              border: solid 4px transparent;
              height: 0;
              border-right-color: #6aa0ff;
            }
            & > div:nth-child(2) {
              border-width: 3px;
              height: 0;
              border-radius: 3px;
              margin: 0 6px;
              border-right-color: #6aa0ff;
            }
            & > div:nth-child(3) {
              border: solid 4px transparent;
              height: 0;
              border-left-color: #6aa0ff;
            }
          }
        }
      }
    }
  }
}
.vue-puzzle-overflow {
  overflow: hidden !important;
}
</style>
