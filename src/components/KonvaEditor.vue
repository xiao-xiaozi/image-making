<script setup>
  import Konva from "konva";
  import { onMounted, ref } from "vue";
  import { debounce } from "lodash";
  import CanvasMaterial from "./CanvasMaterial.vue";
  import konvaStore from "../store/konvaStore";
  import {
    konvaDrawBackgroundImage,
    konvaDrawBackgroundReact,
    konvaDrawText,
  } from "@/utils";
  import { computed } from "vue";

  const kStore = konvaStore();

  let konvaInstance = computed(() => kStore.konvaInstance); // konva实例
  let stageWidth = ref(413);
  let stageHeight = ref(582);

  onMounted(() => {
    initKonva();
  });

  function initKonva() {
    const kInstance = new Konva.Stage({
      container: "konvaEditor-container",
      width: stageWidth.value,
      height: stageHeight.value,
    });
    let layer = new Konva.Layer();
    kInstance.add(layer);
    kStore.setKonvaInstance(kInstance);
  }

  // 修改画布宽度
  const stageWidthChange = debounce(function () {
    const stageWidthEle = document.getElementById("stageWidth");
    konvaInstance.value.setAttr("width", +stageWidthEle.value);
  }, 2000);

  // 修改画布高度
  const stageHeightChange = debounce(function () {
    const stageHeightEle = document.getElementById("stageHeight");
    konvaInstance.value.setAttr("height", +stageHeightEle.value);
  }, 2000);

  // 更新背景
  async function updateBackground(params) {
    // 移除原背景
    kStore.removeBackground("materialBackground");
    let result = null;
    if (params.bgType === "image") {
      result = await konvaDrawBackgroundImage(konvaInstance.value, params.url);
    } else if (params.bgType === "color") {
      result = konvaDrawBackgroundReact(konvaInstance.value, params.color);
    }
    // 加进图层
    kStore.pushDiagram(result);
  }

  // 绘制文本
  function insertTextFn(params) {
    let result = konvaDrawText(konvaInstance.value, params);
    kStore.unshiftDiagram(result);
  }

  // 将画布导出为图片
  function saveToImage() {
    konvaInstance.value.toDataURL({
      quality: 1,
      // mimeType:'image/jpeg',
      pixelRatio: 3,
      callback: function (dataUrl) {
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
</script>

<template>
  <div class="main-container">
    <CanvasMaterial
      @insertText="insertTextFn"
      @updateBackground="updateBackground" />
    <div class="konva-editor">
      <div class="konva-editor__header">
        <div class="stage-wh">
          <input
            type="number"
            :value="stageWidth"
            id="stageWidth"
            @change="stageWidthChange" />
          *
          <input
            type="number"
            @change="stageHeightChange"
            id="stageHeight"
            :value="stageHeight" />
        </div>
        <button @click="saveToImage" class="save-btn">导出为图片</button>
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
      // position: relative;
      overflow: hidden;
      &__header {
        display: flex;
        height: 50px;
        background-color: #fcfcfc;
        .save-btn {
          width: 100px;
          height: 26px;
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
            // border: 1px solid #000;
            box-shadow: 1px 1px 9px 5px #ccc;
          }
        }
      }
    }
  }
</style>
