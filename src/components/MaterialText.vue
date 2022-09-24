<script setup>
  import { reactive } from "vue";
  import konvaStore from "@/store/konvaStore.js";
  import { debounce } from "lodash";

  // import { computed } from "vue";

  const emit = defineEmits(["textClick"]);
  const kStore = konvaStore();
  // const activeText = computed({
  //   get() {
  //     return kStore.activeText;
  //   },
  //   set(val) {
  //     console.log(val);
  //   },
  // });

  const activeText = kStore.activeText;

  const fontFamilyArray = reactive([
    {
      value: "STHupo",
      label: "华文琥珀",
    },
    {
      value: "SimSun",
      label: "宋体",
    },
    {
      value: "SimHei",
      label: "黑体",
    },
    {
      value: "KaiTi",
      label: "楷体",
    },
    {
      value: "PingFang SC",
      label: "苹方",
    },
    {
      value: "LiSu",
      label: "隶书",
    },
    {
      value: "STCaiyun",
      label: "华文彩云",
    },
    {
      value: "STLiti",
      label: "华文隶书",
    },
  ]);

  // function updateTextAttr() {
  //   kStore.setTextAttrs();
  // }

  // 更新字体
  function fontFamilyChange(e) {
    kStore.setTextAttr("fontFamily", e.target.value);
  }

  function fontSizeChange(e) {
    kStore.setTextAttr("fontSize", e.target.value);
  }

  function fontColorChange(e) {
    kStore.setTextAttr("fill", e.target.value);
  }

  function textChange(e) {
    kStore.setTextAttr("text", e.target.value);
  }

  // 插入文本
  const fontFamilyClick = debounce(
    (e) => {
      emit("textClick", e.target.dataset.fontfamily);
    },
    500,
    { leading: true, trailing: false }
  );
</script>
<template>
  <div class="material-text">
    <!-- fill;fontFamily;fontSize;text -->
    <div class="active-text">
      <label for="fontF" class="text-attr">
        字体
        <select id="fontF" @change="fontFamilyChange">
          <option
            v-for="item in fontFamilyArray"
            :key="item.value"
            :value="item.value"
            :selected="item.value == activeText.fontFamily">
            {{ item.label }}
          </option>
        </select>
      </label>
      <label for="fontS" class="text-attr">
        大小
        <input
          type="number"
          :value="activeText.fontSize"
          @change="fontSizeChange"
          id="fontS" />
      </label>
      <label for="fontC" class="text-attr">
        颜色
        <input
          type="color"
          @input="fontColorChange"
          :value="activeText.fill"
          id="fontC" />
      </label>
      <!-- <label for="text-content"> -->
      <textarea
        rows="5"
        class="text-textarea"
        :value="activeText.text"
        @change="textChange"
        id="text-content" />
      <!-- </label> -->
    </div>
    <div class="material-text__content" @click="fontFamilyClick">
      <p class="fontFamily fontFamily-1" data-fontFamily="STHupo">华文琥珀</p>
      <p class="fontFamily fontFamily-2" data-fontFamily="SimSun">宋体</p>
      <p class="fontFamily fontFamily-3" data-fontFamily="SimHei">黑体</p>
      <p class="fontFamily fontFamily-4" data-fontFamily="KaiTi">楷体</p>
      <p class="fontFamily fontFamily-5" data-fontFamily="PingFang SC">苹方</p>
      <p class="fontFamily fontFamily-6" data-fontFamily="LiSu">隶书</p>
      <p class="fontFamily fontFamily-7" data-fontFamily="STCaiyun">华文彩云</p>
      <p class="fontFamily fontFamily-8" data-fontFamily="STLiti">华文隶书</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .material-text {
    &__content {
      display: flex;
      flex-wrap: wrap;
      .fontFamily {
        margin: 10px;
      }
      .fontFamily-1 {
        font-family: "华文琥珀";
      }
      .fontFamily-2 {
        font-family: "宋体";
      }
      .fontFamily-3 {
        font-family: "黑体";
      }
      .fontFamily-4 {
        font-family: "楷体";
      }
      .fontFamily-5 {
        font-family: "苹方";
      }
      .fontFamily-6 {
        font-family: "隶书";
      }
      .fontFamily-7 {
        font-family: "华文彩云";
      }
      .fontFamily-8 {
        font-family: "华文隶书";
      }
    }
    .text-attr {
      display: block;
      margin: 10px 0 10px 10px;
    }
    .text-textarea {
      margin: 10px 0 10px 10px;
      resize: none;
    }
  }
</style>
