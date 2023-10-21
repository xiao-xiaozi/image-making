<script setup>
import { computed } from "vue";
import konvaStore from "../store/konvaStore";

const kStore = konvaStore();

const diagramArray = computed(() => kStore.diagramArray);
</script>
<template>
  <div class="diagram-layer">
    <!-- <div v-for="item in diagramArray" :key="item.value.id()" class="layer-item"> -->
    <div
      v-for="(item, index) in diagramArray"
      :key="item.name + index"
      class="layer-item">
      {{ item.name }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .diagram-layer {
    padding: 10px;
    .layer-item {
      padding: 10px;
      border: 1px dashed #ccc;
      margin-bottom: 2px;
    }
  }
</style>
