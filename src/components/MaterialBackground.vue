<script setup>
import backgroundData from "@/assets/template";
import { inject, reactive, ref } from "vue";
import { debounce } from "lodash";
import useKonvaStore from "@/store/konvaStore";
import { getStageLayer } from "@/utils";

const konvaStore = useKonvaStore()

const konvaInstance = inject('konvaInstance')

let backgroundDataReactive = reactive(backgroundData);

let backgroundColor = ref("#ffffff");


/**
 * 添加图片
 */


function imageChoose(e) { // 选择本地图片
  var reader = new FileReader();
  reader.onload = function (e) {
    // e.target.result就是该文件的完整Base64 Data-URI
    backgroundDataReactive.unshift(e.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
}

async function imageClick(url) {
  const result = await konvaDrawBackgroundImage(url)
  konvaStore.pushDiagram(result); // 加进图层数组
}

function konvaDrawBackgroundImage(imageUrl) {
  return new Promise((resolve) => {
    let layer = getStageLayer(konvaInstance.value);
    const imageObj = new Image();
    let yoda = null;
    imageObj.onload = function () {
      yoda = new Konva.Image({
        x: 0,
        y: 0,
        name: "materialBackground",
        image: imageObj,
        width: konvaInstance.value.width(),
        height: konvaInstance.value.height(),
      });
      layer.add(yoda);
      yoda.moveToBottom(); // 将背景置于底层
      layer.batchDraw();
      resolve({
        name: "materialBackground",
        id: "materialBackground",
        value: yoda,
      });
    };
    imageObj.src = imageUrl;
  });
}



/**
 * 绘制背景色
 */
const colorInput = debounce(() => {
  let ele = document.getElementById("bg-color");
  konvaStore.removeBackground("materialBackground");// 移除原背景
  const result = konvaDrawBackgroundReact(ele.value) // 绘制
  konvaStore.pushDiagram(result);// 加进图层数组

}, 500);

function konvaDrawBackgroundReact(backgroundColor) {
  let layer = getStageLayer(konvaInstance.value);
  let rect = new Konva.Rect({
    x: 0,
    y: 0,
    name: "materialBackground",
    fill: backgroundColor,
    width: konvaInstance.value.width(),
    height: konvaInstance.value.height(),
  });

  layer.add(rect);
  rect.moveToBottom(); //将背景置于底层
  layer.draw();
  return {
    name: "materialBackground",
    value: rect,
    id: "materialBackground",
  };
}

</script>
<template>
  <div class="material-background">
    <div class="choose-local-image">
      <input type="file" accept="image/*" @input="imageChoose" />
    </div>
    <div class="background-color">
      <input id="bg-color" type="color" :value="backgroundColor" @input="colorInput" />
    </div>
    <img v-for="url in backgroundDataReactive" :key="url" :src="url" alt="item.name" :data-template="url"
      class="material-background__item" @click="imageClick(url)" />
    <!-- @click="$emit('materialBackground', url)" /> -->
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
