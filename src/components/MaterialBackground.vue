<script setup>
import backgroundData from "@/assets/template";
import { reactive, ref } from "vue";
import { debounce } from "lodash";

const emit = defineEmits(["backgroundColor", "materialBackground"]);

let backgroundDataReactive = reactive(backgroundData);

let backgroundColor = ref("#ffffff");

// 选择本地图片
function imageChoose(e) {
  var reader = new FileReader();
  reader.onload = function (e) {
    // e.target.result就是该文件的完整Base64 Data-URI
    backgroundDataReactive.unshift(e.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
}

const colorInput = debounce(() => {
  let ele = document.getElementById("bg-color");
  emit("backgroundColor", { color: ele.value });
}, 500);
</script>
<template>
  <div class="material-background">
    <div class="choose-local-image">
      <input type="file" accept="image/*" @input="imageChoose" />
    </div>
    <div class="background-color">
      <input
        id="bg-color"
        type="color"
        :value="backgroundColor"
        @input="colorInput" />
    </div>
    <img
      v-for="url in backgroundDataReactive"
      :key="url"
      :src="url"
      alt="item.name"
      :data-template="url"
      class="material-background__item"
      @click="$emit('materialBackground', url)" />
  </div>
</template>
<style lang="scss" scoped>
  .material-background {
    margin: 10px;
    text-align: center;
    .choose-local-image {
      margin-bottom: 20px;
      overflow: hidden;
    }
    &__item {
      width: 160px;
      margin: 10px;
      cursor: pointer;
    }
  }
</style>
