import { Graph, Addon, Shape, FunctionExt } from '@antv/x6'
import {registerSVGNode, NodeConfig} from './shape'
import {iconMap} from './topologyIcons'

export default class FlowGraph {
  public static graph: Graph
  private static stencil: Addon.Stencil

  public static init() {
    this.graph = new Graph({
      container: document.getElementById('container')!,
      width: 200, // 设置为浏览器窗口宽度
      height: 100, // 设置为浏览器窗口高度
     
      // 网格
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#E7E8EA',
            thickness: 1,
          },
          {
            color: '#CBCED3',
            thickness: 1,
            factor: 5,
          },
        ],
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
        modifiers: 'ctrl',
      },
      // 鼠标滚轮的默认行为是滚动页面
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      // 节点连接
      connecting: {
        router: 'normal', // 路由方式，'manhattan' 让连线沿直线或直角路径走
        // connector: {
        //   name: 'rounded', //连接线样式，'rounded'使连线拐角更圆滑
        //   args: {
        //     radius: 8, //拐角半径
        //   },
        // },
        anchor: 'center', //连接点锚点位置，'center'代表在连接点中点
        connectionPoint: 'anchor', //连接方式，'anchor'代表按锚点方式连接
        snap: true, // 自动吸附，确保连接线接到最接近的可用锚点
        allowBlank: false, // 是否允许连接到画布空白位置的点
        allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
        allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#000', // 线条颜色
                strokeWidth: 1, // 线条宽度
                targetMarker: null, 
                sourceMarker: null,
              },
            },
            tools: [],
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet // 只有目标元素存在磁吸点（锚点）时，才允许连接
        },
      },

      // 高亮
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#D06269',
              stroke: '#D06269',
            },
          },
        },
      },
      resizing: true, // 缩放节点，默认禁用
      rotating: true, // 旋转节点，默认禁用
      // 启动选择节点
      selecting: {
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
      },
      snapline: true, // 对齐线
      keyboard: true, // 键盘快捷键，默认禁用
      history: true, // 启动历史记录
      // 小地图，默认禁用
      
      minimap: {
        enabled: false,
        container: document.getElementById('minimap')!,
        width: 198,
        height: 198,
        padding: 10,
        scalable: true,
      },
      clipboard: true, // 剪切板，默认禁用
    })
    this.initStencil()
    this.initShape()
    this.initEvent()
    return this.graph
  }

  //初始化并配置 AntV X6 的 Stencil（模板区域）
  private static initStencil() {
    this.stencil = new Addon.Stencil({
      title: '节点',
      target: this.graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: document.body.offsetHeight - 96,
      layoutOptions: {//设置每行显示几个节点
        columns: 1,
        columnWidth: 200,
        rowHeight: 50,
        marginY: 20
      },
      getDropNode: (node: any) => {
        const size = node.size();
        const { type } = node.store.data;
        const label: String = this.getLabel(type);
        return node.clone()
          .size(size.width, size.height)
          .attr('label/text', label)
          .attr('label/ip', '')
          .attr('label/ident','')
          .attr('label/nodeId','')
          .attr('label/refY', '120%')
          .attr('label/fontSize', 12)
      }
    })

    const stencilContainer = document.querySelector('#stencil')!
    if (stencilContainer) {
      stencilContainer.appendChild(this.stencil.container)
    }

    // 监听节点从模板拖拽到画布事件，设置节点位置为鼠标释放点
    this.stencil.on('node:dropped', ({ node, e }) => {
      if (e) {
        // e 是原生鼠标事件，clientX/Y 是视口坐标
        const point = this.graph.clientToLocal(e.clientX, e.clientY)
        node.position(point.x, point.y)
      }
  })
  }

  // 给左侧添加
  private static initShape() {
    const graph = this.graph
    const createNode = (shape: string, label: string, color = 'rgb(49,59,73)',size=30) => {
      registerSVGNode(shape)    
      return graph.createNode({
        shape,
        type: label,
        attrs: {
          fo: {
            html: iconMap[shape]?.(color,size),
          },
          label: {
            text: label,
            ip:'',
            ident:'',
            nodeId:'',
            refY: '120%',
            textAnchor: 'middle',
            fontSize: 12,
            fill: '#333',
          },
        },
        size: {
          width: NodeConfig.width, //控制rect框的大小
          height: NodeConfig.height,
        },
      })
    }

    const nodes = [
      createNode('custom-gateway', '网关', 'rgb(49,59,73)'),
      createNode('custom-loadbalance', '负载均衡', 'rgb(49,59,73)'),
      createNode('custom-router', '路由器', 'rgb(49,59,73)'),
      createNode('custom-switch', '交换机', 'rgb(49,59,73)'),
      //createNode('custom-firewall', '防火墙', 'rgb(49,59,73)'),
      createNode('custom-database', '数据库', 'rgb(49,59,73)'),
      createNode('custom-middleware', '中间件', 'rgb(49,59,73)'),
      createNode('custom-pc', '终端', 'rgb(49,59,73)'),
      createNode('custom-server', '服务器', 'rgb(49,59,73)'),
      createNode('custom-storage','存储', 'rgb(49,59,73)'),
      // 更多节点 ...
    ];
     
    this.stencil.load(nodes);
  }

  // 显示边连接点
  private static showPorts(ports: NodeListOf<SVGElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  
  // 初始化注册事件
  private static initEvent() {
    const graph = this.graph
    const container = document.getElementById('container')!

    // 节点鼠标移入
    graph.on('node:mouseenter', FunctionExt.debounce((nodeAttr: any) => {
      // 显示连接点
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.showPorts(ports, true)
      
      // 添加删除
      const { node } = nodeAttr
      const { width } = node.store.data.size
    
      node.addTools({
        name: 'button-remove',
        args: {
          x: 0,
          y: 0,
          offset: { x: width / 2 + 5, y: 20 },
        },
      })
    }), 500)
    // 节点鼠标移出
    graph.on('node:mouseleave', ({ node }) => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.showPorts(ports, false)

      // 移除删除
      node.removeTools()
    })
    // 连接线鼠标移入
    graph.on('edge:mouseenter', ({ edge }) => {
      // 添加删除
      edge.addTools([
        'source-arrowhead',
        'target-arrowhead',
        {
          name: 'button-remove',
          args: {
            distance: -30,
          }
        }
      ])
    })
    graph.on('edge:mouseleave', ({ edge }) => {
      // 移除删除
      edge.removeTools()
    })
    //添加键盘删除监听
    document.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      if (['input', 'textarea'].includes(tagName) || target.isContentEditable) return

      const key = e.key
      if (key === 'Delete' || key === 'Backspace') {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.removeCells(cells)
        }
      }
    })
    // 快捷键绑定：撤销、重做、复制、粘贴、剪切
    graph.bindKey(['ctrl+z', 'meta+z'], () => {
      if (graph.canUndo()) graph.undo()
    })

    graph.bindKey(['ctrl+y', 'meta+y'], () => {
      if (graph.canRedo()) graph.redo()
    })

    graph.bindKey(['ctrl+c', 'meta+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) graph.copy(cells)
    })

    graph.bindKey(['ctrl+v', 'meta+v'], async () => {
      if (!graph.isClipboardEmpty()) {
        const cells = await graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
    })

    graph.bindKey(['ctrl+x', 'meta+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) graph.cut(cells)
    })

  }
  
  // 根据 type => label
  private static getLabel(type: String) {
    let label: String = ''
    
    switch(type) {
      case '网关':
        label = '网关'
        break
      case '负载均衡':
        label = '负载均衡'
        break
      case '交换机':
        label = '交换机'
        break
      case '路由器':
        label = '路由器'
        break
      case '中间件':
        label = '中间件'
        break
      case '数据库':
        label = '数据库'
        break
      case '终端':
        label = '终端'
        break
      case '防火墙':
        label = '防火墙'
        break
      case '服务器':
        label = '服务器'
        break
      case '存储':
        label = '存储'
        break
      case 'circle':
        label = '圆形节点'
        break
    }

    return label
  }
}