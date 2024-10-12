<script setup>
import useKonvaStore from "@/store/konvaStore";
import windImage from "@/assets/image/wind.png";
import sunImage from "@/assets/image/sun.png";
import cloudyImage from "@/assets/image/cloudy.png";
import { inject, reactive } from "vue";
import { debounce } from "lodash";
import { getStageLayer, addToTransformer } from "@/utils";
import Konva from "konva";

const konvaStore = useKonvaStore();

const konvaInstance = inject("konvaInstance")

let imageArray = reactive([windImage, sunImage, cloudyImage]);

// 选择本地图片
function imageChoose(e) {
  var reader = new FileReader();
  reader.onload = function (e) {
    // e.target.result就是该文件的完整Base64 Data-URI
    imageArray.push(e.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
}

// 往canvas中插入图片
const imgClick = debounce(
  async (e) => {
    let { dataset: { index }, } = e.target;
    let result = await konvaDrawImage(
      konvaInstance.value,
      imageArray[index]
    );
    konvaStore.unshiftDiagram(result);
  },
  500,
  { leading: true, trailing: false }
);

function konvaDrawImage(konvaStage, url) {
  return new Promise((resolve) => {
    let layer = getStageLayer(konvaStage);
    const imageObj = new Image();
    imageObj.onload = function () {
      let kImg = new Konva.Image({
        x: 30,
        y: 50,
        name: "image",
        image: imageObj,
        draggable: true,
      });
      addToTransformer(konvaStage, kImg); // 初始化时，加旋转缩放
      kImg.on("click", function () {
        addToTransformer(konvaStage, kImg); //点击stage会取消旋转缩放展示，点击图片时加载回来
      });
      layer.add(kImg);
      resolve({
        name: "image",
        value: kImg,
      });
    };
    imageObj.src = url;
  });
}

</script>
<template>
  <div class="material-image">
    <div class="choose-local-image">
      <input type="file" accept="image/*" @input="imageChoose" />
    </div>
    <div class="image-content" @click="imgClick">
      <img
        v-for="(url, index) in imageArray"
        :key="url"
        :src="url"
        :data-index="index"
        class="img"
        alt="wind" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.material-image {
  padding: 10px;

  .choose-local-image {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .image-content {
    .img {
      width: 50px;
      margin: 5px;
      transition: all 0.5s;
      cursor: pointer;

      &:hover {
        box-shadow: 1px 1px 2px 1px #ccc;
      }
    }
  }
}
</style>
