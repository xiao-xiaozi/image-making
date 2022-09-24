import Konva from "konva";
import { defineStore, acceptHMRUpdate } from "pinia";

const konvaStore = defineStore("layerDiagram", {
  state: () => {
    return {
      konvaInstance: null, // konva 实例
      diagramArray: [],
      // 当前选中的文本
      activeText: {
        fill: "#ffffff",
        fontFamily: "",
        text: "",
        fontSize: 0,
        groundId: null,
      },
    };
  },
  actions: {
    setKonvaInstance(params) {
      this.konvaInstance = params;
    },
    unshiftDiagram(params) {
      this.diagramArray.unshift(params);
    },
    pushDiagram(params) {
      this.diagramArray.push(params);
    },
    // 按id值删除
    removeDiagram(params) {
      let index = this.diagramArray.findIndex((el) => el.value.id() === params);
      if (index >= 0) this.diagramArray.splice(index, 1);
    },
    // 删除背景，如果有
    removeBackground() {
      let index = this.diagramArray.findIndex(
        (el) => el.name == "materialBackground"
      );
      if (index >= 0) {
        if (this.diagramArray[index].value)
          this.diagramArray[index].value.destroy();
        this.diagramArray.splice(index, 1);
      }
    },
    // setActiveText
    setActiveText(params) {
      this.activeText.fill = params.fill;
      this.activeText.fontFamily = params.fontFamily;
      this.activeText.fontSize = params.fontSize;
      this.activeText.text = params.text;
      this.activeText.groundId = params.groundId;
    },
    // 更新当前文本节点属性值
    // updateActiveTextAttr(params) {
    //   this.activeText[params.field] = params.value;
    // },
    setTextAttr(attr, value) {
      let textGround = this.diagramArray.find(
        (el) => el.value.id() === this.activeText.groundId
      );
      if (textGround) {
        let textNode = textGround.value.children.find(
          (el) => el instanceof Konva.Text
        );
        textNode.setAttr(attr, value);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(konvaStore, import.meta.hot));
}

export default konvaStore;
