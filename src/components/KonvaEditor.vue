<script setup>
import Konva from "konva";
import { onMounted, ref, computed, provide } from "vue";
import { debounce } from "lodash";
import CanvasMaterial from "./CanvasMaterial/CanvasMaterial.vue";
import useKonvaStore from "../store/konvaStore";
import { createKonva } from "@/utils/konvaInstance"


const konvaStore = useKonvaStore();

let konvaInstance =  ref(null) // konva实例
/**
 * 通过注入的方式将konvaInstance提供给到子组件
 * 
 * getKonvaInstance方法在子组件顶层执行时，会比createKonva函数先一步执行。
 * 无法在子组件内声明顶层konvaInstance变量
 */
provide('konvaInstance', konvaInstance)

let stageWidth = ref(413);
let stageHeight = ref(582);
const currentActive = computed(() => konvaStore.currentActive);

onMounted(() => {
  initKonva();
});

function initKonva() {
  konvaInstance.value = createKonva({
    container: "konvaEditor-container",
    width: stageWidth.value,
    height: stageHeight.value,
  })

  let layer = new Konva.Layer();
  konvaInstance.value.add(layer);
  konvaInstance.value.on("click", function (e) {
    konvaStore.setCurrentActive(null);
    if (e.target instanceof Konva.Stage) return;
    if (e.target instanceof Konva.Rect) {
      let { attrs } = e.target;
      if (attrs.name === "materialBackground") return;
    }
    konvaStore.setCurrentActive(e.target);
  });
}

// 修改画布宽度
const stageWidthChange = debounce(function () {
  const stageWidthEle = document.getElementById("stageWidth");
  konvaInstance.value.setAttr("width", +stageWidthEle.value);
}, 500);

// 修改画布高度
const stageHeightChange = debounce(function () {
  const stageHeightEle = document.getElementById("stageHeight");
  konvaInstance.value.setAttr("height", +stageHeightEle.value);
}, 500);

// 将画布导出为图片
function saveToImage() {
  konvaInstance.value.toDataURL({
    quality: 1,
    // mimeType:'image/jpeg',
    pixelRatio: 3,
    callback (dataUrl) {
      downloadURI(dataUrl, "konva.png");
    },
  });

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Reflect.deleteProperty(window, link);
  }
}

// 删除选中的图形
function deleteDiagram(){
  konvaStore.destroyDiagram(konvaInstance.value)
}

</script>

<template>
  <div class="main-container">
    <CanvasMaterial />
    <div class="konva-editor">
      <div class="konva-editor__header">
        <div class="stage-wh">
          <label>宽度
            <input
              id="stageWidth"
              type="number"
              :value="stageWidth"
              class="stage-width-height"
              @change="stageWidthChange" />
          </label>
          <label>
            高度
            <input
              id="stageHeight"
              type="number"
              class="stage-width-height"
              :value="stageHeight"
              @change="stageHeightChange" />
          </label>
        </div>
        <div class="header-right">
          <button class="save-btn" @click="saveToImage">导出</button>
          <span
            class="iconfont icon-delete"
            title="删除选中的图形"
            :disabled="!currentActive"
            :class="!currentActive ? '' : 'icon-delete-active'"
            @click="deleteDiagram"></span>
        </div>
      </div>
      <div class="konva-editor__content">
        <div id="konvaEditor-container"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.main-container {
  height: 100vh;
  display: flex;
  .konva-editor {
    flex: 1;
    overflow: hidden;
    &__header {
      height: 50px;
      line-height:50px;
      padding-left:20px;
      padding-right:20px;
      background-color: #fcfcfc;
      position: relative;
      .stage-wh {
        display: inline-block;
      }
      .save-btn {
        display: inline-block;
        margin-right:10px;
      }
      .header-right {
        position: absolute;
        right: 20px;
        top: 0;
        .icon-delete {
          font-size: 22px;
          color: #ccc;
          cursor: not-allowed;
        }
        .icon-delete-active {
          cursor: pointer;
          color: #333;
        }
      }
    }
    &__content {
      height: calc(100% - 50px);
      background-color: #eee;
      overflow: auto;
      #konvaEditor-container {
        padding: 10px;
        display: flex;
        justify-content: center;
        .konvajs-content {
          box-shadow: 1px 1px 9px 5px #ccc;
        }
      }
    }
  }
}
</style>
