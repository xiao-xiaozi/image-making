<script setup>
import { reactive, computed } from "vue";
import useKonvaStore from "@/store/konvaStore.js";
import { debounce } from "lodash";

const emit = defineEmits(["textClick"]);
const konvaStore = useKonvaStore();

const activeText = computed(() => konvaStore.activeText);
const showInsertTextBtn = computed(() => {
  let { text, id } = konvaStore.activeText;
  return text && !id;
});
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

// 更新字体
function fontFamilyChange(e) {
  konvaStore.setTextAttr("fontFamily", e.target.value);
}

function fontSizeChange(e) {
  konvaStore.setTextAttr("fontSize", Number(e.target.value));
}

const fontColorChange = debounce(
  (e) => {
    konvaStore.setTextAttr("fill", e.target.value);
  },
  500,
  { leading: true, trailing: false }
);

const textChange = debounce((e) => {
  konvaStore.setTextAttr("text", e.target.value);
}, 1000);

// 插入文本
const fontFamilyClick = debounce(
  () => {
    emit("textClick", konvaStore.activeText);
    konvaStore.resetActiveText();
  },
  500,
  { leading: true, trailing: false }
);
</script>
<template>
  <div class="material-text">
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
          id="fontS"
          v-model.number="activeText.fontSize"
          type="number"
          @change="fontSizeChange" />
      </label>
      <div class="text-attr">
        <label for="fontC">
          颜色
          <input
            id="fontC"
            type="color"
            :value="activeText.fill"
            @input="fontColorChange" />
        </label>
      </div>
      <!-- <label for="text-content"> -->
      <textarea
        id="text-content"
        rows="5"
        class="text-textarea"
        :value="activeText.text"
        @input="textChange" />
      <!-- </label> -->
    </div>
    <!-- <div class="material-text__content" @click="fontFamilyClick">
      <p class="fontFamily fontFamily-1" data-fontFamily="STHupo">华文琥珀</p>
      <p class="fontFamily fontFamily-2" data-fontFamily="SimSun">宋体</p>
      <p class="fontFamily fontFamily-3" data-fontFamily="SimHei">黑体</p>
      <p class="fontFamily fontFamily-4" data-fontFamily="KaiTi">楷体</p>
      <p class="fontFamily fontFamily-5" data-fontFamily="PingFang SC">苹方</p>
      <p class="fontFamily fontFamily-6" data-fontFamily="LiSu">隶书</p>
      <p class="fontFamily fontFamily-7" data-fontFamily="STCaiyun">华文彩云</p>
      <p class="fontFamily fontFamily-8" data-fontFamily="STLiti">华文隶书</p>
    </div> -->
    <button
      class="insertText-btn"
      :disabled="!showInsertTextBtn"
      @click="fontFamilyClick">
      插入文本
    </button>
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
  .insertText-btn {
    margin-left: 10px;
  }
}
</style>
