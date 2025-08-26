import React, { useEffect, useState, useRef } from 'react'
import type { Node } from '@antv/x6'
import {message} from 'antd'
import './index.less'
import ToolBar from './components/ToolBar'
import RightDrawer from './components/RightDrawer'
import FlowGraph from './Graph'
import { iconMap } from './Graph/topologyIcons'
import { getTopologyData } from '@/services/application'
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

const Index = () => {
  const [isReady, setIsReady] = useState(false)
  const [isRightDrawer, setIsRightDrawer] = useState(false)
  const [selectCell, setSelectCell] = useState({})
  const [appName, setAppName] = useState<string>('')
  const [appID, setAppID] = useState<string>()
  const graph = useRef<any>(null) // 如果你希望全局访问 graph，可这样保存

  useEffect(() => {
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
      const monData = await getMonObjectList({ gids: topologyData.group_id })
      const list: NodeIdentInfo[] = monData.dat.list || []
      const updatedNodes = topologyData.nodes.map((node: any) => {
        const nodeId = node.attrs?.label?.nodeId
        const matched = list.find(item => String(item.id).trim() === String(nodeId).trim())
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
