# Image Making

一个简易的图片制作工具。待完善中...

[![IZv4i.md.jpg](https://s1.328888.xyz/2022/09/24/IZv4i.md.jpg)](https://imgloc.com/i/IZv4i)













### Todo

- [ ] 修改画布大小时，背景图片没有重载以覆盖画布
- [ ] 当前的插入文字进行修改存在问题，无法添加第二个。操作均对首次加入的文字生效。
- [ ] 将`konvaStore`中的konva实例移除，通过单例模式实现。(避免响应式追踪一整个konva实例)
- [ ] 将左侧功能区对应的功能写入各个功能组件，取消组件层层事件传递到`KonvaEditor`组件进行处理。（例如：`MaterialText`组件）