import { Graph, Node } from '@antv/x6';

import { iconMap } from './topologyIcons';


// shapeConfig.ts
export const NodeConfig ={
  width: 40,
  height: 40
}

export const registerSVGNode = (name: string) => {
  if (Node.registry.get(name)) return;

  Node.registry.register(name, {
    inherit: 'rect',
    width: NodeConfig.width,
    height: NodeConfig.height,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'foreignObject',
        selector: 'fo',
      },
      {
        tagName: 'text',
        selector: 'label', // 添加 label 标签
      },
    ],
    attrs: {
      body: {
        //strokeWidth: 1,
        stroke: 'none',
        fill: 'none',
      },
      fo: {
        width: NodeConfig.width,
        height: NodeConfig.height,
        html: iconMap[name] ? iconMap[name]('rgb(49,59,73)',30) : '',
      },
      label: {
        text: '', // 默认文本为空，createNode 时会覆盖
        ip:'',
        ident:'',
        nodeId:'',
        refX: '50%',
        refY: '120%',
        textAnchor: 'middle',
        fontSize: 12,
        fill: '#333',
      },
    },
    ports: { ...ports },
  });
};



export const getPortGroups = () => ({
  top: {
    position: 'top',
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        stroke: '#2D8CF0',
        strokeWidth: 1,
        fill: '#fff',
        style: { visibility: 'hidden' },
      },
    },
  },
  right: {
    position: 'right',
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        stroke: '#2D8CF0',
        strokeWidth: 1,
        fill: '#fff',
        style: { visibility: 'hidden' },
      },
    },
  },
  bottom: {
    position: 'bottom',
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        stroke: '#2D8CF0',
        strokeWidth: 1,
        fill: '#fff',
        style: { visibility: 'hidden' },
      },
    },
  },
  left: {
    position: 'left',
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        stroke: '#2D8CF0',
        strokeWidth: 1,
        fill: '#fff',
        style: { visibility: 'hidden' },
      },
    },
  },
})

export const ports = {
  get groups() {
    return getPortGroups()
  },
  items: [
    { group: 'top' },
    { group: 'bottom' },
    { group: 'left' },
    { group: 'right' },
  ],
}






// 注册节点组件
// Graph.registerNode('custom-gateway',{
//   inherit: 'image',
//   width: 30,
//   height: 15,
//   attrs: {
//     body: {
//       strokeWidth: 1,
//       fill: 'none',  
//     },
//     image: {
//       'xlink:href': '/image/topologyNode/gateway.png',  // 这里是图片的相对路径
//       width: 30,
//       height: 15,
//     }
//   },
//   ports: {...ports}
// })
