import Konva from "konva";
import { uniqueId } from "lodash";
import konvaStore from "../store/konvaStore";

// const deleteCircleName = "deleteCircle";

// 往canvas中插入图片
export function konvaDrawImage(konvaStage, url) {
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

// 往canvas中插入文本
export function konvaDrawText(konvaStage, params) {
  const kStore = konvaStore();
  let layer = getStageLayer(konvaStage);
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
  textNode.on("dblclick", function (e) {
    kStore.setActiveText({ ...e.target.attrs, id: textNode.id() });
    kStore.setActiveMaterial("text"); // 双击选中文本进行编辑时，将左侧菜单切换到文本
  });
  layer.add(textNode);
  return {
    value: textNode,
    name: "文本信息",
  };
}

// 填充背景图片
export function konvaDrawBackgroundImage(konvaStage, imageUrl) {
  // let layer = getStageLayer(konvaStage);
  // const imageObj = new Image();
  // let yoda = null;
  // imageObj.onload = function () {
  //   yoda = new Konva.Image({
  //     x: 0,
  //     y: 0,
  //     name: "materialBackground",
  //     image: imageObj,
  //     width: konvaStage.width(),
  //     height: konvaStage.height(),
  //   });
  //   layer.add(yoda);
  //   yoda.moveToBottom(); // 将背景置于底层
  //   layer.batchDraw();
  // };
  // imageObj.src = imageUrl;
  // return {
  //   name: "materialBackground",
  //   id: "materialBackground",
  //   value: yoda,
  // };
  // fix:修复图片加载异步，导致返回值value为null，清空背景报错问题
  return new Promise((resolve) => {
    let layer = getStageLayer(konvaStage);
    const imageObj = new Image();
    let yoda = null;
    imageObj.onload = function () {
      yoda = new Konva.Image({
        x: 0,
        y: 0,
        name: "materialBackground",
        image: imageObj,
        width: konvaStage.width(),
        height: konvaStage.height(),
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
    // return {
    //   name: "materialBackground",
    //   id: "materialBackground",
    //   value: yoda,
    // };
  });
}

// 填充背景色
export function konvaDrawBackgroundReact(konvaStage, backgroundColor) {
  let layer = getStageLayer(konvaStage);
  let rect = new Konva.Rect({
    x: 0,
    y: 0,
    name: "materialBackground",
    fill: backgroundColor,
    width: konvaStage.width(),
    height: konvaStage.height(),
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

// 图形的删除标记
// function deleteDiagram(config) {
//   let { x, y, radius, fill } = config || {};
//   const circle = new Konva.Circle({
//     x: x || 3,
//     y: y || 3,
//     name: deleteCircleName, // 特殊标记
//     radius: radius || 10,
//     fill: fill || "red",
//     stroke: "#000",
//     strokeWidth: 2,
//   });
//   circle.on("click", function (e) {
//     const ground = e.target.parent;
//     if (ground instanceof Konva.Group) {
//       removeFromTransformer(ground.parent.parent, ground.id());
//       ground.destroy();
//       // 销毁时从图层数据中移除
//       const kStore = getKStore();
//       kStore.removeDiagram(ground.id());
//     }
//     document.body.style.cursor = "default";
//   });
//   circle.on("mouseover", function () {
//     document.body.style.cursor = "pointer";
//   });
//   circle.on("mouseout mouseleave", function () {
//     document.body.style.cursor = "default";
//   });

//   return circle;
// }

// 销毁transformer
// function removeFromTransformer(stage) {
//   let transformer = stage.find("Transformer");
//   if (transformer.length) transformer[0].destroy();
// }

// 创建transformer，将元素加入到transformer
function addToTransformer(stage, node) {
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
 * 通用ground创建函数
 * @param {*} groundConfig  ground配置
 * @param {*} deleteCircleConfig 删除小圆点的配置信息
 * @returns
 */
// function createGround(groundConfig, deleteCircleConfig) {
//   const normal = {
//     x: 0,
//     y: 0,
//     id: uniqueId(),
//     draggable: true,
//   };
//   const ground = new Konva.Group(Object.assign(normal, groundConfig));
//   // 鼠标移入时显示删除小圆点
//   ground.on("mouseenter", function () {
//     ground.add(deleteDiagram(deleteCircleConfig));
//   });
//   // 鼠标离开时销毁删除小圆点
//   ground.on("mouseleave", function () {
//     ground.children.forEach((node) => {
//       if (node.attrs.name === deleteCircleName) {
//         node.destroy();
//       }
//     });
//   });

//   return ground;
// }

// 获取konvaStore
// function getKStore() {
//   return konvaStore();
// }

function getStageLayer(konvaStage) {
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
