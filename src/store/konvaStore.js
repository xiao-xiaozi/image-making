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
    /**
     * 当前点击选中的图形
     * @param {Object} value 图形的实例
     */
    setCurrentActive(value) {
      this.currentActive = value;
    },
    /**
     * 销毁当前点击选中的图形
     * @param {*} konvaInstance konva实例
     */
    destroyDiagram(konvaInstance) {
      if (this.currentActive) {
        this.removeDiagramForID(this.currentActive.id()); // 将图形从图形数组移除
        this.currentActive.destroy();
        // 图片可能开启了缩放旋转，删除图片时一并销毁transformer
        let transformer = konvaInstance.find("Transformer");
        if (transformer.length) transformer[0].destroy();
        this.currentActive = null;
      }
    },
    /**
     * 插入到图型数组头部
     * @param {Object} params { value:DiagramInstance,  type:"" }
     */
    unshiftDiagram(params) {
      this.diagramArray.unshift(params);
    },
    /**
     * 插入到图形数组尾部
     * @param {Object} params { value:DiagramInstance,  type:"" }
     */
    pushDiagram(params) {
      this.diagramArray.push(params);
    },
    /**
     * 按id值删除指定图形, 更新图形信息
     * @param {String} id 
     */
    removeDiagramForID(id) {
      let index = this.diagramArray.findIndex((el) => el.value.id() === id);
      if (index >= 0) this.diagramArray.splice(index, 1);
    },
    /**
     * 按 type 值移除diagramArray中的某一类图形
     * @param {String} type 
     */
    removeDiagramForType(type){
      let diagramIndex = this.diagramArray.findIndex(el => el.type === type)
      while(diagramIndex) {
        this.diagramArray[diagramIndex].value.destroy() // 销毁图形
        this.diagramArray.splice(diagramIndex,1) // 从数组中移除

        diagramIndex = this.diagramArray.findIndex(el => el.type === type)
      }
    },
    /**
     * 设置当前选中文本节点的信息
     * @param {*} params 
     */
    setActiveText(params) {
      this.activeText.fill = params.fill || "#000";
      this.activeText.fontFamily = params.fontFamily || "";
      this.activeText.fontSize = params.fontSize || "";
      this.activeText.text = params.text || "";
      this.activeText.id = params.id || null;
    },
    /**
     * 更新当前文本节点属性值
     * @param {*} attr 
     * @param {*} value 
     */
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
    /**
     * 重置当前选中文本节点的属性
     */
    resetActiveText() {
      this.activeText = cloneDeep(defaultActiveText)
    },
    /**
     * 设置当前激活的左侧菜单
     * @param {String} val 
     */
    setActiveMaterial(val) {
      this.activeMaterial = val;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKonvaStore, import.meta.hot));
}

export default useKonvaStore;
