<template>
  <teleport to="body" :disabled="state.isInside">
    <div
      :class="['vue-puzzle-vcode', { inside_: state.isInside, show_: show }, className]"
      :style="bodyStyle"
      @mousedown="onCloseMouseDown"
      @mouseup="onCloseMouseUp"
      @touchstart="onCloseMouseDown"
      @touchend="onCloseMouseUp"
    >
      <div class="vue-auth-box_" @mousedown.stop @touchstart.stop>
        <div class="auth-body_" :style="`width:${canvasWidth}px;height: ${canvasHeight}px`">
          <!-- 主图，有缺口 -->
          <canvas
            ref="canvas1"
            class="auth-canvas1_"
            :width="canvasWidth"
            :height="canvasHeight"
          />
          <!-- 成功后显示的完整图 -->
          <canvas
            ref="canvas3"
            :class="['auth-canvas3_', { show: state.isSuccess }]"
            :width="canvasWidth"
            :height="canvasHeight"
          />
          <!-- 小图 -->
          <canvas
            ref="canvas2"
            class="auth-canvas2_"
            :width="puzzleBaseSize"
            :height="canvasHeight"
            :style="`width:${puzzleBaseSize}px;height:${canvasHeight}px;transform:translateX(${
              styleWidth -
              sliderBaseSize -
              (puzzleBaseSize - sliderBaseSize) *
                ((styleWidth - sliderBaseSize) / (canvasWidth - sliderBaseSize))
            }px)`"
          />
          <div :class="['loading-box_', { hide_: !state.loading }]">
            <div class="loading-gif_">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div
            :class="[
              'info-box_',
              { show: state.infoBoxShow },
              { fail: state.infoBoxFail },
            ]"
          >
            {{ state.infoText }}
          </div>
          <div
            :class="['flash_', { show: state.isSuccess }]"
            :style="`transform: translateX(${
              state.isSuccess
                ? `${canvasWidth + canvasHeight * 0.578}px`
                : `-${canvasHeight * 0.578}px`
            }) skew(-30deg, 0);`"
          ></div>
          <img class="reset_" @click="reset(true)" src="./assets/reset.png" />
        </div>
        <div class="auth-control_">
          <div class="range-box" :style="`height:${sliderBaseSize}px;width:${canvasWidth}px`">
            <div class="range-text">{{ sliderText }}</div>
            <div
              class="range-slider"
              ref="rangeSlider"
              :style="`width:${styleWidth}px`"
            >
              <div
                :class="['range-btn', { isDown: state.mouseDown }]"
                :style="`width:${sliderBaseSize}px`"
                @mousedown="onRangeMouseDown($event)"
                @touchstart="onRangeMouseDown($event)"
              >
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { defineProps, defineEmits } from "vue";

onMounted(() => {
  document.addEventListener("mousemove", onRangeMouseMove, false);
  document.addEventListener("mouseup", onRangeMouseUp, false);

  document.addEventListener("touchmove", onRangeMouseMove, { passive: false });
  document.addEventListener("touchend", onRangeMouseUp, false);

  // 为了SSR渲染，延迟设置
  state.isInside = props.type === 'inside';

  if (props.show) {
    !state.isInside && document.body.classList.add("vue-puzzle-overflow");
    reset();
  }
});

onUnmounted(() => {
  state.timer1 && clearTimeout(state.timer1);
  document.removeEventListener("mousemove", onRangeMouseMove, false);
  document.removeEventListener("mouseup", onRangeMouseUp, false);

  document.removeEventListener("touchmove", onRangeMouseMove);
  document.removeEventListener("touchend", onRangeMouseUp, false);
});

const rangeSlider = ref<HTMLDivElement>();
const canvas1 = ref<HTMLCanvasElement>();
const canvas2 = ref<HTMLCanvasElement>();
const canvas3 = ref<HTMLCanvasElement>();

interface State {
  isInside: boolean; // 为了SSR， 是否是内置模式
  mouseDown: boolean; // 鼠标是否在按钮上按下
  startWidth: number; // 鼠标点下去时父级的width
  startX: number; // 鼠标按下时的X
  newX: number; // 鼠标当前的偏移X
  pinX: number; // 拼图的起始X
  pinY: number; // 拼图的起始Y
  loading: boolean; // 是否正在加在中，主要是等图片onload
  isCanSlide: boolean; // 是否可以拉动滑动条
  error: boolean; // 图片加在失败会出现这个，提示用户手动刷新
  infoBoxShow: boolean; // 提示信息是否出现
  infoText: string; // 提示等信息
  infoBoxFail: boolean; // 是否验证失败
  timer1: NodeJS.Timeout | undefined; // setTimout1
  closeDown: boolean; // 为了解决Mac上的click BUG
  isSuccess: boolean; // 验证成功
  imgIndex: number; // 用于自定义图片时不会随机到重复的图片
  isSubmting: boolean; // 是否正在判定，主要用于判定中不能点击重置按钮
}

const emit = defineEmits(["success", "fail", "close", "reset"]);
const props = defineProps({
  type: {type: String, default: 'modal'}, // 模式 modal,inside
  canvasWidth: { type: Number, default: 310 }, // 主canvas的宽
  canvasHeight: { type: Number, default: 160 }, // 主canvas的高
  show: { type: Boolean, default: false }, // 是否出现，由父级控制
  puzzleScale: { type: Number, default: 1 }, // 拼图块的大小缩放比例
  sliderSize: { type: Number, default: 50 }, // 滑块的大小
  range: { type: Number, default: 10 }, // 允许的偏差值
  zIndex: { type: Number, default: 999 }, // 层级
  imgs: {
    type: Array,
    default: null,
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
  className: {
    type: String,
    default: "",
  },
});

const state = reactive<State>({
  isInside: false,
  mouseDown: false,
  startWidth: 50,
  startX: 0,
  newX: 0,
  pinX: 0,
  pinY: 0,
  loading: false,
  isCanSlide: false,
  error: false,
  infoBoxShow: false,
  infoText: "",
  infoBoxFail: false,
  timer1: undefined,
  closeDown: false,
  isSuccess: false,
  imgIndex: -1,
  isSubmting: false,
});

// 每次出现都应该重新初始化
watch(
  () => props.show,
  (newV) => {
    if (newV) {
      console.log('你触发了？', newV);
      !state.isInside && document.body.classList.add("vue-puzzle-overflow");
      reset();
    } else {
      // 关闭的时候回到初始状态
      state.isSubmting = false;
      state.isSuccess = false;
      state.infoBoxShow = false;
      document.body.classList.remove("vue-puzzle-overflow");
    }
  }
);

watch(()=> props.type, (newV) =>{
  if(newV === 'inside'){
    state.isInside = true;
    document.body.classList.remove("vue-puzzle-overflow");
  } else {
    state.isInside = false;
  }
});

// styleWidth是底部用户操作的滑块的父级，就是轨道在鼠标的作用下应该具有的宽度
const styleWidth = computed(() => {
  const w = state.startWidth + state.newX - state.startX;
  return w < sliderBaseSize.value
    ? sliderBaseSize.value
    : w > props.canvasWidth
    ? props.canvasWidth
    : w;
});

// 图中拼图块的60 * 用户设定的缩放比例计算之后的值 0.2~2
const puzzleBaseSize = computed(() => {
  return Math.round(Math.max(Math.min(props.puzzleScale, 2), 0.2) * 52.5 + 6);
});

// 处理一下sliderSize，弄成整数，以免计算有偏差
const sliderBaseSize = computed(() => {
  return Math.max(
    Math.min(Math.round(props.sliderSize), Math.round(props.canvasWidth * 0.5)),
    10
  );
});

// body的style设置
const bodyStyle = computed(() => {
  if (props.zIndex !== 999) {
    return `z-index:${props.zIndex}`;
  }
  return "";
});

// 私有-关闭
const onC = () => {
  if (!state.mouseDown && !state.isSubmting) {
    state.timer1 && clearTimeout(state.timer1);
    emit("close");
  }
};

const onCloseMouseDown = () => {
  if(state.isInside) return;
  state.closeDown = true;
};

const onCloseMouseUp = () => {
  if (state.closeDown) {
    onC();
  }
  state.closeDown = false;
};

// 鼠标按下准备拖动
const onRangeMouseDown = (e: Event) => {
  if (state.isCanSlide) {
    state.mouseDown = true;
    state.startWidth = rangeSlider.value?.clientWidth || 0;
    state.newX =
      (e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX;
    state.startX =
      (e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX;
  }
};

// 鼠标移动
const onRangeMouseMove = (e: Event) => {
  if (state.mouseDown) {
    e.preventDefault();
    state.newX =
      (e as MouseEvent).clientX || (e as TouchEvent).changedTouches[0].clientX;
  }
};

// 鼠标抬起
const onRangeMouseUp = () => {
  if (state.mouseDown) {
    state.mouseDown = false;
    submit();
  }
};

/**
 * 私有-开始进行
 * @param withCanvas 是否强制使用canvas随机作图,只有图片加载错误后此值才会为真
 */
const init = (withCanvas = false) => {
  // 防止重复加载导致的渲染错误
  if (state.loading && !withCanvas) {
    return;
  }
  state.loading = true;
  state.isCanSlide = false;
  const c = canvas1.value;
  const c2 = canvas2.value;
  const c3 = canvas3.value;
  const ctx = c?.getContext("2d", { willReadFrequently: true });
  const ctx2 = c2?.getContext("2d");
  const ctx3 = c3?.getContext("2d");

  if (!ctx || !ctx2 || !ctx3) {
    console.error("not found ctx / ctx2 / ctx3");
    return;
  }

  const isFirefox =
    navigator.userAgent.indexOf("Firefox") >= 0 &&
    navigator.userAgent.indexOf("Windows") >= 0; // 是windows版火狐

  const img = document.createElement("img");
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx3.fillStyle = "rgba(255,255,255,1)";
  ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
  ctx2.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
  // 取一个随机坐标，作为拼图块的位置
  state.pinX = getRandom(
    puzzleBaseSize.value + 20,
    props.canvasWidth - puzzleBaseSize.value - 10
  ); // 留10的边距
  state.pinY = getRandom(20, props.canvasHeight - puzzleBaseSize.value - 10); // 主图高度 - 拼图块自身高度 - 10边距
  img.crossOrigin = "anonymous"; // 匿名，想要获取跨域的图片
  img.onload = () => {
    const [x, y, w, h] = makeImgSize(img);
    ctx.save();
    // 先画小图路径
    paintBrick(ctx);
    ctx.closePath();

    // 非火狐，在此画外阴影
    // 其他浏览器：先画阴影，阴影会按照路径的外围生成，再clip，会按照阴影的区域clip。如果先裁剪再画阴影，阴影显示不出来,因为阴影在clip区域外面去了
    // win版火狐，需要先clip，然后再画阴影，阴影可以超出clip的范围。不裁剪直接先画阴影的话，路径不生效，阴影会根据整个图片生成
    if (!isFirefox) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.clip(); // 按照外阴影区域切割
    } else {
      ctx.clip();
      ctx.save();
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.restore();
    }

    ctx.drawImage(img, x, y, w, h);
    ctx3.fillRect(0, 0, props.canvasWidth, props.canvasHeight);
    ctx3.drawImage(img, x, y, w, h);

    // 设置小图的内阴影
    ctx.globalCompositeOperation = "source-atop";

    paintBrick(ctx);

    ctx.arc(
      state.pinX + Math.ceil(puzzleBaseSize.value / 2),
      state.pinY + Math.ceil(puzzleBaseSize.value / 2),
      puzzleBaseSize.value * 1.2,
      0,
      Math.PI * 2,
      true
    );
    ctx.closePath();
    ctx.shadowColor = "rgba(255, 255, 255, .8)";
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.shadowBlur = Math.min(Math.ceil(8 * props.puzzleScale), 12);
    ctx.fillStyle = "#ffffaa";
    ctx.fill();

    // 将小图赋值给ctx2
    // ctx2.drawImage(
    //   c,
    //   state.pinX - 3,
    //   state.pinY - 20,
    //   state.pinX + puzzleBaseSize.value + 5,
    //   state.pinY + puzzleBaseSize.value + 5,
    //   0,
    //   state.pinY - 20,
    //   state.pinX + puzzleBaseSize.value + 5,
    //   state.pinY + puzzleBaseSize.value + 5
    // );
    // 之所以要用getImageData，是因为safari中可能有问题，drawImage是异步的
    const imgData = ctx.getImageData(
      state.pinX - 3, // 为了阴影 是从-3px开始截取，判定的时候要+3px
      state.pinY - 20,
      state.pinX + puzzleBaseSize.value + 5,
      state.pinY + puzzleBaseSize.value + 5
    );

    ctx2.putImageData(imgData, 0, state.pinY - 20);

    // 清理
    ctx.restore();
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);

    // 画缺口
    ctx.save();
    paintBrick(ctx);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
    // 画缺口的内阴影
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    paintBrick(ctx);
    ctx.arc(
      state.pinX + Math.ceil(puzzleBaseSize.value / 2),
      state.pinY + Math.ceil(puzzleBaseSize.value / 2),
      puzzleBaseSize.value * 1.2,
      0,
      Math.PI * 2,
      true
    );
    ctx.shadowColor = "#000";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();

    // 画整体背景图
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    state.loading = false;
    state.isCanSlide = true;
  };
  img.onerror = () => {
    init(true); // 如果图片加载错误就重新来，并强制用canvas随机作图
  };

  if (!withCanvas && props.imgs?.length) {
    let randomNum = getRandom(0, props.imgs.length - 1);
    if (randomNum === state.imgIndex) {
      if (randomNum === props.imgs.length - 1) {
        randomNum = 0;
      } else {
        randomNum++;
      }
    }
    state.imgIndex = randomNum;
    img.src = props.imgs[randomNum] as string;
  } else {
    img.src = makeImgWithCanvas();
  }
};

// 工具 - 范围随机数
const getRandom = (min: number, max: number): number => {
  return Math.ceil(Math.random() * (max - min) + min);
};

// 工具 - 设置图片尺寸cover方式贴合canvas尺寸 w/h
const makeImgSize = (img: HTMLImageElement) => {
  const imgScale = img.width / img.height;
  const canvasScale = props.canvasWidth / props.canvasHeight;
  let x = 0,
    y = 0,
    w = 0,
    h = 0;
  if (imgScale > canvasScale) {
    h = props.canvasHeight;
    w = imgScale * h;
    y = 0;
    x = (props.canvasWidth - w) / 2;
  } else {
    w = props.canvasWidth;
    h = w / imgScale;
    x = 0;
    y = (props.canvasHeight - h) / 2;
  }
  return [x, y, w, h];
};

// 私有-绘制拼图块的路径
const paintBrick = (ctx: CanvasRenderingContext2D) => {
  const moveL = Math.ceil(15 * props.puzzleScale); // 直线移动的基础距离
  ctx.beginPath();
  ctx.moveTo(state.pinX, state.pinY);
  ctx.lineTo(state.pinX + moveL, state.pinY);
  ctx.arcTo(
    state.pinX + moveL,
    state.pinY - moveL / 2,
    state.pinX + moveL + moveL / 2,
    state.pinY - moveL / 2,
    moveL / 2
  );
  ctx.arcTo(
    state.pinX + moveL + moveL,
    state.pinY - moveL / 2,
    state.pinX + moveL + moveL,
    state.pinY,
    moveL / 2
  );
  ctx.lineTo(state.pinX + moveL + moveL + moveL, state.pinY);
  ctx.lineTo(state.pinX + moveL + moveL + moveL, state.pinY + moveL);
  ctx.arcTo(
    state.pinX + moveL + moveL + moveL + moveL / 2,
    state.pinY + moveL,
    state.pinX + moveL + moveL + moveL + moveL / 2,
    state.pinY + moveL + moveL / 2,
    moveL / 2
  );
  ctx.arcTo(
    state.pinX + moveL + moveL + moveL + moveL / 2,
    state.pinY + moveL + moveL,
    state.pinX + moveL + moveL + moveL,
    state.pinY + moveL + moveL,
    moveL / 2
  );
  ctx.lineTo(
    state.pinX + moveL + moveL + moveL,
    state.pinY + moveL + moveL + moveL
  );
  ctx.lineTo(state.pinX, state.pinY + moveL + moveL + moveL);
  ctx.lineTo(state.pinX, state.pinY + moveL + moveL);

  ctx.arcTo(
    state.pinX + moveL / 2,
    state.pinY + moveL + moveL,
    state.pinX + moveL / 2,
    state.pinY + moveL + moveL / 2,
    moveL / 2
  );
  ctx.arcTo(
    state.pinX + moveL / 2,
    state.pinY + moveL,
    state.pinX,
    state.pinY + moveL,
    moveL / 2
  );
  ctx.lineTo(state.pinX, state.pinY);
};

// 私有-用canvas随机生成图片
const makeImgWithCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("not found ctx");
    return "";
  }
  canvas.width = props.canvasWidth;
  canvas.height = props.canvasHeight;
  ctx.fillStyle = `rgb(${getRandom(100, 255)},${getRandom(
    100,
    255
  )},${getRandom(100, 255)})`;
  ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight);
  // 随机画10个图形
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = `rgb(${getRandom(100, 255)},${getRandom(
      100,
      255
    )},${getRandom(100, 255)})`;
    ctx.strokeStyle = `rgb(${getRandom(100, 255)},${getRandom(
      100,
      255
    )},${getRandom(100, 255)})`;

    if (getRandom(0, 2) > 1) {
      // 矩形
      ctx.save();
      ctx.rotate((getRandom(-90, 90) * Math.PI) / 180);
      ctx.fillRect(
        getRandom(-20, canvas.width - 20),
        getRandom(-20, canvas.height - 20),
        getRandom(10, canvas.width / 2 + 10),
        getRandom(10, canvas.height / 2 + 10)
      );
      ctx.restore();
    } else {
      // 圆
      ctx.beginPath();
      const ran = getRandom(-Math.PI, Math.PI);
      ctx.arc(
        getRandom(0, canvas.width),
        getRandom(0, canvas.height),
        getRandom(10, canvas.height / 2 + 10),
        ran,
        ran + Math.PI * 1.5
      );
      ctx.closePath();
      ctx.fill();
    }
  }
  return canvas.toDataURL("image/png");
};

// 私有-开始判定
const submit = () => {
  state.isSubmting = true;
  // 偏差 x = puzzle的起始X - (用户真滑动的距离) + (puzzle的宽度 - 滑块的宽度) * （用户真滑动的距离/canvas总宽度）
  // 最后+ 的是补上slider和滑块宽度不一致造成的缝隙
  const x = Math.abs(
    state.pinX -
      (styleWidth.value - sliderBaseSize.value) +
      (puzzleBaseSize.value - sliderBaseSize.value) *
        ((styleWidth.value - sliderBaseSize.value) /
          (props.canvasWidth - sliderBaseSize.value)) -
      3
  );
  if (x < props.range) {
    // 成功
    state.infoText = props.successText;
    state.infoBoxFail = false;
    state.infoBoxShow = true;
    state.isCanSlide = false;
    state.isSuccess = true;
    // 成功后准备关闭
    state.timer1 && clearTimeout(state.timer1);
    state.timer1 = setTimeout(() => {
      // 成功的回调
      state.isSubmting = false;
      emit("success", x);
    }, 800);
  } else {
    // 失败
    state.infoText = props.failText;
    state.infoBoxFail = true;
    state.infoBoxShow = true;
    state.isCanSlide = false;
    emit("fail", x);
    // 800ms后重置
    state.timer1 && clearTimeout(state.timer1);
    state.timer1 = setTimeout(() => {
      state.isSubmting = false;
      reset();
    }, 800);
  }
};
// 重置 - 重新设置初始状态
const resetState = () => {
  state.infoBoxFail = false;
  state.infoBoxShow = false;
  state.isCanSlide = false;
  state.isSuccess = false;
  state.startWidth = sliderBaseSize.value; // 鼠标点下去时父级的width
  state.startX = 0; // 鼠标按下时的X
  state.newX = 0; // 鼠标当前的偏移X
};

// 重置 - 重新加载
const reset = (needEmit?: boolean) => {
  if (state.isSubmting) {
    return;
  }
  resetState();
  init();
  needEmit && emit("reset");
};

defineExpose({ reset });

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
  &.inside_{
    position: relative;
    background-color: transparent;
    width: 100%;
    height: 100%;
    .vue-auth-box_ {
      position: relative;
      top: 0;
      left: 0;
      transform: translate(0, 0);
      padding: 0;
      background: transparent;
      box-shadow: none;
    }
  }
  &.show_ {
    opacity: 1;
    pointer-events: auto;
  }
}
.vue-auth-box_ {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: #fff;
  user-select: none;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  .auth-body_ {
    position: relative;
    overflow: hidden;
    border-radius: 3px;
    .loading-box_ {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 20;
      opacity: 1;
      transition: opacity 100ms;
      display: flex;
      align-items: center;
      justify-content: center;
      &.hide_ {
        opacity: 0;
        pointer-events: none;
        .loading-gif_ {
          span {
            animation-play-state: paused;
          }
        }
      }
      .loading-gif_ {
        flex: none;
        height: 5px;
        line-height: 0;
        @keyframes load {
          0% {
            opacity: 1;
            transform: scale(1.3);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.3);
          }
        }
        span {
          display: inline-block;
          width: 5px;
          height: 100%;
          margin-left: 2px;
          border-radius: 50%;
          background-color: #888;
          animation: load 1.04s ease infinite;
          &:nth-child(1) {
            margin-left: 0;
          }
          &:nth-child(2) {
            animation-delay: 0.13s;
          }
          &:nth-child(3) {
            animation-delay: 0.26s;
          }
          &:nth-child(4) {
            animation-delay: 0.39s;
          }
          &:nth-child(5) {
            animation-delay: 0.52s;
          }
        }
      }
    }
    .info-box_ {
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
    .auth-canvas1_{
      width: 100%;
      height: 100%;
    }
    .auth-canvas2_ {
      position: absolute;
      top: 0;
      left: 0;
      width: 60px;
      height: 100%;
      z-index: 2;
    }
    .auth-canvas3_ {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 600ms;
      z-index: 3;
      &.show {
        opacity: 1;
      }
    }
    .flash_ {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: 3;
      &.show {
        transition: transform 600ms;
      }
    }
    .reset_ {
      position: absolute;
      top: 2px;
      right: 2px;
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
  .auth-control_ {
    .range-box {
      position: relative;
      width: 100%;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        width: 100%;
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
          height: 100%;
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
