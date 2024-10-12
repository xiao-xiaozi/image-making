import Konva from "konva";
import { defineStore, acceptHMRUpdate } from "pinia";
import { cloneDeep } from "lodash"

const defaultActiveText = {
  fill: "#ffffff",
  fontFamily: "",
  text: "",
  fontSize: 26,
  id: null,
}

const useKonvaStore = defineStore("layerDiagram", {
  state: () => {
    return {
      diagramArray: [],
      currentActive: null, // 当前konva点击选中的图形
      activeMaterial: "text", // 当前激活的左侧菜单
      // 当前选中的文本
      activeText: cloneDeep(defaultActiveText),
    };
  },
  actions: {
    // konva.stage点击选中的图形
    setCurrentActive(value) {
      this.currentActive = value;
    },
    // 销毁当前点击选中的图形
    destroyDiagram(konvaInstance) {
      if (this.currentActive) {
        this.removeDiagram(this.currentActive.id());
        this.currentActive.destroy();
        // 图片可能开启了缩放旋转，删除图片时一并销毁transformer
        let transformer = konvaInstance.find("Transformer");
        if (transformer.length) transformer[0].destroy();
        this.currentActive = null;
      }
    },
    // 加到图层数组头部
    unshiftDiagram(params) {
      this.diagramArray.unshift(params);
    },
    // 加到图层数组尾部
    pushDiagram(params) {
      this.diagramArray.push(params);
    },
    // 按id值删除, 更新图形信息
    removeDiagram(id) {
      let index = this.diagramArray.findIndex((el) => el.value.id() === id);
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
    // setActiveText 获取文本节点的信息
    setActiveText(params) {
      this.activeText.fill = params.fill || "#000";
      this.activeText.fontFamily = params.fontFamily || "";
      this.activeText.fontSize = params.fontSize || "";
      this.activeText.text = params.text || "";
      this.activeText.id = params.id || null;
    },
    // 更新当前文本节点属性值
    setTextAttr(attr, value) {
      let textNode = this.diagramArray.find(
        (el) => el.value.id() === this.activeText.id
      );
      if (textNode && textNode.value instanceof Konva.Text) {
        textNode.value.setAttr(attr, value);
      }
      // 更新值
      this.activeText[attr] = value;
    },
    resetActiveText() {
      this.activeText = cloneDeep(defaultActiveText)
    },
    // 设置当前激活的左侧菜单
    setActiveMaterial(val) {
      this.activeMaterial = val;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKonvaStore, import.meta.hot));
}

export default useKonvaStore;
