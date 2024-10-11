import Konva from "konva";


/**
 * 创建transformer，将元素加入到transformer
 * @param {*} stage 
 * @param {*} node 
 */
export function addToTransformer(stage, node) {
  let transformer = stage.find("Transformer");
  if (transformer.length) {
    transformer[0].nodes([node]);
  } else {
    const newTransformer = new Konva.Transformer();
    let layer = getStageLayer(stage);
    layer.add(newTransformer);
    newTransformer.nodes([node]);
    layer.draw();
    stage.on("click", function (e) {
      // 点击stage 或 背景时 销毁destroy
      let name = e.target.attrs.name;
      if (e.target instanceof Konva.Stage || name === "materialBackground")
        newTransformer.destroy();
    });
  }
}

/**
 * 获取图层信息
 * @param {*} konvaStage 
 * @returns 
 */
export function getStageLayer(konvaStage) {
  let layers = konvaStage.getLayers();
  let layer = null;
  if (layers.length) {
    layer = layers[layers.length - 1];
  } else {
    layer = new Konva.Layer();
    konvaStage.add(layer.children);
  }
  return layer;
}
