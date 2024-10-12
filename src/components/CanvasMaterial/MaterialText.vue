<script setup>
import Konva from "konva";
import { reactive, computed, inject } from "vue";
import useKonvaStore from "@/store/konvaStore.js";
import { debounce, uniqueId } from "lodash";
import { getStageLayer, addToTransformer } from "@/utils";

const konvaStore = useKonvaStore();
const konvaInstance = inject("konvaInstance")

const activeText = computed(() => konvaStore.activeText);

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

const transformerOPtions={
  // enabledAnchors:['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
  enabledAnchors: ['top-left',  'top-right',  'bottom-left',  'bottom-right'],
  // boundBoxFunc: (oldBox,newBox)=>{ // 限制盒子的最小宽高
  //   newBox.width = Math.max(60, newBox.width)
  //   newBox.height = Math.max(40, newBox.height)
  //   return newBox
  // }
}

// 更新字体
function fontFamilyChange(e) {
  konvaStore.setTextAttr("fontFamily", e.target.value);
}

// 更新文字大小
function fontSizeChange(e) {
  konvaStore.setTextAttr("fontSize", Number(e.target.value));
}

// 更新文字颜色
const fontColorChange = debounce(
  (e) => {
    konvaStore.setTextAttr("fill", e.target.value);
  },
  500,
  { leading: true, trailing: false }
);



// 插入文本
const fontFamilyClick = debounce(
  () => {
    const result = konvaDrawText(konvaStore.activeText)
    konvaStore.unshiftDiagram(result);
    konvaStore.resetActiveText();
  },
  500,
  { leading: true, trailing: false }
);

function konvaDrawText(params) {
  const kStore = useKonvaStore();
  let layer = getStageLayer(konvaInstance.value);
  let textNode = new Konva.Text({
    x: 5,
    y: 5,
    text: params.text || "文本信息",
    fontSize: params.fontSize || 16,
    id: uniqueId("text_"),
    fontFamily: params.fontFamily || "SimHei",
    fill: params.fill || "#000",
    draggable: true,
  });

  textNode.on('click', function (e) {
    addToTransformer(konvaInstance.value, textNode, transformerOPtions)
    kStore.setActiveText({ ...e.target.attrs, id: textNode.id() })
    kStore.setActiveMaterial("text"); // 双击选中文本进行编辑时，将左侧菜单切换到文本
  })

  textNode.on('dblclick', function () {
    // hide text node and destroy transformer:
    const transformers = konvaInstance.value.find("Transformer");
    textNode.hide();
    if(Array.isArray(transformers) && transformers.length) {
      transformers.forEach(transformer => {
        transformer.destroy()
      })
    }
    layer.draw();

    // at first lets find position of text node relative to the stage:
    var textPosition = textNode.absolutePosition();


    const divEle = document.createElement('div')
    divEle.style.width = konvaInstance.value.getAttr('width') + 'px'
    divEle.style.height = konvaInstance.value.getAttr('height') + 'px'
    divEle.style.position = "absolute"
    var textarea = document.createElement('textarea');
    divEle.appendChild(textarea)
    konvaInstance.value.container().appendChild(divEle)


    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = textPosition.y + 'px';
    textarea.style.left = textPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    let rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();


    function removeTextarea() {
      // textarea.parentNode.removeChild(textarea);
      divEle.parentNode.removeChild(divEle)
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      // tr.show();
      // tr.forceUpdate();
      layer.draw();
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
      console.log('keydoown',e)
      // hide on enter
      // but don't hide on shift + enter
      // if (e.keyCode === 13 && !e.shiftKey) {
      if (e.key === 'Enter' && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      // if (e.keyCode === 27) {
      if (e.key === 'Escape') {
        removeTextarea();
      }
    });

    textarea.addEventListener('keydown', function () {
      let scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  })

  layer.add(textNode);

  addToTransformer(konvaInstance.value, textNode, transformerOPtions)

  return {
    value: textNode,
    name: "文本信息",
  };
}


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
      <!-- <textarea
        id="text-content"
        rows="5"
        class="text-textarea"
        :value="activeText.text"
        @input="textChange" /> -->
      <!-- </label> -->
    </div>
    <!-- <button
      class="insertText-btn"
      :disabled="!showInsertTextBtn"
      @click="fontFamilyClick">
      插入文本
    </button> -->
    <button class="insertText-btn" @click="fontFamilyClick">
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
