<script setup>
import { computed } from "vue";
import MaterialBackground from "./MaterialBackground.vue";
import MaterialText from "./MaterialText.vue";
import LayerInfo from "./LayerInfo.vue";
import MaterialImage from "./MaterialImage.vue";
import useKonvaStore from "@/store/konvaStore.js";

const emit = defineEmits(["updateBackground", "insertText", "insertImage"]);

let konvaStore = useKonvaStore();

let activeMaterial = computed(() => konvaStore.activeMaterial);

// 切换选中的类型
function materialTypeClick(e) {
  let { material } = e.target.dataset;
  konvaStore.setActiveMaterial(material);
}

// 背景图片点击处理
function materialBackgroundClick(params) {
  emit("updateBackground", { url: params, bgType: "image" });
}

// 背景色更新处理
function materialBgColor(params) {
  emit("updateBackground", { ...params, bgType: "color" });
}

// 插入文本
function textClickFn(params) {
  emit("insertText", params);
}
</script>

<template>
  <div class="canvas-material">
    <div class="material-type" @click="materialTypeClick">
      <!-- <div
        class="type-item"
        data-material="template"
        :class="activeMaterial == 'template' ? 'material-type__active' : ''">
        模板
      </div> -->
      <div
        class="type-item"
        data-material="text"
        :class="activeMaterial == 'text' ? 'material-type__active' : ''">
        文本
      </div>
      <div
        class="type-item"
        :class="activeMaterial == 'image' ? 'material-type__active' : ''"
        data-material="image">
        图片
      </div>
      <!-- <div
        class="type-item"
        data-material="diagram"
        :class="activeMaterial == 'diagram' ? 'material-type__active' : ''">
        图形
      </div> -->
      <div
        class="type-item"
        data-material="background"
        :class="activeMaterial == 'background' ? 'material-type__active' : ''">
        背景
      </div>
      <div
        class="type-item"
        data-material="layer"
        :class="activeMaterial == 'layer' ? 'material-type__active' : ''">
        图层
      </div>
    </div>
    <div class="material-content">
      <MaterialBackground
        v-show="activeMaterial === 'background'"
        @background-color="materialBgColor"
        @material-background="materialBackgroundClick" />
      <MaterialText
        v-show="activeMaterial === 'text'"
        @text-click="textClickFn" />
      <LayerInfo v-show="activeMaterial === 'layer'" />
      <!-- <MaterialImage v-show="activeMaterial === 'image'" /> -->
      <MaterialImage v-show="activeMaterial === 'image'" />
      <div
        v-show="activeMaterial === 'template' || activeMaterial === 'diagram'">
        研发中~ 敬请期待！
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.canvas-material {
  width: 400px;
  display: flex;
  .material-type {
    width: 80px;
    text-align: center;
    border-right: 1px solid #f5f5f5;
    &__active {
      color: #333;
      background-color: #e4efec;
    }
    .type-item {
      padding: 14px 0;
      cursor: pointer;
    }
  }
  .material-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
