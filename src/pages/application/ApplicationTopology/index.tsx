import React, { useEffect, useState, useRef } from 'react'
import type { Node } from '@antv/x6'
import {message} from 'antd'
import './index.less'
import ToolBar from './components/ToolBar'
import RightDrawer from './components/RightDrawer'
import FlowGraph from './Graph'
import { iconMap } from './Graph/topologyIcons'
import { getAppHealth,getTopologyData } from '@/services/application'
import { convertStandardToTopologyData } from './util'
import { getMonObjectList } from '@/services/targets'

type NodeIdentInfo = {
  id: string
  ident: string
  host_ip: string
  health_level: number
  cpu_util: number
  mem_util: number
  alert_num: number
  state: string
  target_up: number
  arch: string
}

type AppInfo = {
  id: string
  name: string
}

const Index = () => {
  const [isReady, setIsReady] = useState(false)
  const [isRightDrawer, setIsRightDrawer] = useState(false)
  const [selectCell, setSelectCell] = useState({})
  const [switchID, setSwitchID] = useState<string>()
  const [loadbalanceID, setLoadbalanceID] = useState<string>()
  const [gatewayID, setGatewayID] = useState<string>()
  const [routerID, setRouterID] = useState<string>()
  const [storageID, setStorageID] = useState<string>()
  const [appName, setAppName] = useState<string>('')
  const [appID, setAppID] = useState<string>()
  const graph = useRef<any>(null) // 全局访问 graph，可这样保存

  useEffect(() => {
    getAppHealth().then((res) => {
      if (res && Array.isArray(res)) {
        const switchGroup = res.find((item) => item.name .includes("交换机"))
        setSwitchID(switchGroup?.id ?? '100000')
        const loadbalanceGroup = res.find((item) => item.name .includes("负载均衡"))
        setLoadbalanceID(loadbalanceGroup?.id ?? '100000')
        const gatewayGroup = res.find((item) => item.name .includes("网关"))
        setGatewayID(gatewayGroup?.id ?? '100000')
        const routerGroup = res.find((item) => item.name .includes("路由器"))
        setRouterID(routerGroup?.id ?? '100000')
        const storageGroup = res.find((item) => item.name .includes("存储"))
        setStorageID(storageGroup?.id ?? '100000')
      }
    })
    const g = FlowGraph.init()
    graph.current = g
    setIsReady(true)

    g.on('selection:changed', (args) => {
      const selected = args.selected
    
      const firstNode = selected.find((cell): cell is Node => {
        const shape = cell.getData()?.shape
        return cell.isNode() && shape !== 'edge'
      })
      
      if (firstNode) {
        setSelectCell((prev: Node | null) => {
          return prev?.id !== firstNode.id ? firstNode : prev
        })
        setIsRightDrawer(true)
      } else {
        setIsRightDrawer(false)
      }
    })
    
    

    g.on('blank:click', () => {
      setIsRightDrawer(false)
    })

    const resizeFn = () => {
      const { width, height } = getContainerSize()
      g.resize(width, height)
    }
    resizeFn()

    window.addEventListener('resize', resizeFn)
    return () => {
      window.removeEventListener('resize', resizeFn)
    }

    
  }, [])

  const getContainerSize = () => {
    return {
      width: document.body.offsetWidth - 214,
      height: document.body.offsetHeight - 95,
    }
  }


  const closeRightDrawer = () => {
    setIsRightDrawer(false)
  }

  const handleAppChange = async (name: string, id: string) => {
    setAppName(name)
    setAppID(id)
    
    try {
      const standardData = await getTopologyData(id)
      if (!standardData) {
        console.warn('未获取到拓扑图数据')
        return
      }

      const topologyData = convertStandardToTopologyData(standardData)
      // 定义三个分类的数据源
      let machineList: NodeIdentInfo[] = []
      let switchList: NodeIdentInfo[] = []
      let loadbalanceList: NodeIdentInfo[] = []
      let gatewayList: NodeIdentInfo[] = []
      let routerList: NodeIdentInfo[] = []
      let storageList: NodeIdentInfo[] = []
      try {
        const [machineRes, switchRes, loadbalanceRes, gatewayRes, routerRes, storageRes] = await Promise.all([
          getMonObjectList({ gids: topologyData.group_id }),   // 普通节点
          getMonObjectList({ gids: switchID }), // 交换机节点
          getMonObjectList({ gids: loadbalanceID }), // 负载均衡节点
          getMonObjectList({gids: gatewayID}),
          getMonObjectList({gids: routerID}),
          getMonObjectList({gids: storageID}),
        ])
        machineList = machineRes?.dat?.list || []
        switchList = switchRes?.dat?.list || []
        loadbalanceList = loadbalanceRes?.dat?.list || []
        gatewayList = gatewayRes?.dat?.list || []
        routerList = routerRes?.dat?.list || []
        storageList = storageRes?.dat?.list || []
      } catch (e) {
        console.warn('部分应用分组数据加载失败', e)
      }
      const monData = await getMonObjectList({ gids: topologyData.group_id })
      const list: NodeIdentInfo[] = monData.dat.list || []

      //遍历节点
      const updatedNodes = topologyData.nodes.map((node: any) => {
        const nodeId = node.attrs?.label?.nodeId
        const shape = node.shape || ''
        let matched: NodeIdentInfo | undefined

        if (shape.includes('switch')) {
          matched = switchList.find((item) => String(item.id).trim() === String(nodeId).trim())
        } else if (shape.includes('loadbalance')) {
          matched = loadbalanceList.find((item) => String(item.id).trim() === String(nodeId).trim())
        } else if(shape.includes('gateway')){
          matched = gatewayList.find((item) => String(item.id).trim() === String(nodeId).trim())
        }else if(shape.includes('router')){
          matched = routerList.find((item) => String(item.id).trim() === String(nodeId).trim())
        }else if(shape.includes('storage')){
          matched = storageList.find((item) => String(item.id).trim() === String(nodeId).trim())
        }else {
          matched = machineList.find((item) => String(item.id).trim() === String(nodeId).trim())
        }
        const ident = matched?.ident ?? ''
        const ip = matched?.host_ip ?? ''   

        return {
          ...node,
          attrs: {
            label: {
              text: node.attrs?.label?.text || node.type || '',
              nodeId: nodeId,
              ident:ident,
              ip:ip,
              fill: 'rgb(49,59,73)',
              fontSize: 12,
              refY: '120%',
            },
          },
        }
      })
      if (graph.current) {
        graph.current.clearCells()
        
        const { width, height } = getContainerSize()
        graph.current.resize(width, height)
        
        setTimeout(() => {
          graph.current.fromJSON({ ...topologyData, nodes: updatedNodes})
        }, 0)
      }


    } catch (error) {
      console.error('拓扑图加载失败：', error)
    }

    // getTopologyData(id).then((standardData) => {
    //   if (!standardData) return message.warning('未获取到拓扑数据')
      
    //   const topologyData = convertStandardToTopologyData(standardData)
      
    //   if (graph.current) {
    //     graph.current.clearCells()
        
    //     const { width, height } = getContainerSize()
    //     graph.current.resize(width, height)
        
    //     setTimeout(() => {
    //       graph.current.fromJSON(topologyData)
    //     }, 0)
    //   }
    // })
    
    
  }
    
  

  return (
    <div className="antv-x6">
      <div className="toolbar">
        {isReady && (
          <ToolBar
            onAppChange={handleAppChange}
          />
        )}
      </div>
      {isRightDrawer && (
        <RightDrawer
          selectCell={selectCell}
          close={closeRightDrawer}
          appName={appName}
          appID={appID}
          switchID={switchID}
          loadbalanceID={loadbalanceID}
          gatewayID={gatewayID}
          routerID={routerID}
          storageID={storageID}
        />
      )}
      <div className="other">
        <div id="stencil" className="shapes"></div>
        <div id="container"></div>
        {/* <div id="minimap" className="minimap"></div> */}
      </div>
    </div>
  )
}

export default Index
