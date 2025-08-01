import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'
import { iconMap } from './Graph/topologyIcons'
import { getPortGroups } from './Graph/shape'
import { tippyMap } from './viewTippy'
import tippy, { Instance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import _ from 'lodash'
import { getMonObjectList } from '@/services/targets'
import { getTopologyData } from '@/services/application' // 替换为你的接口方法
import { convertStandardToTopologyData } from './util'

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

interface IProps {
  appId: string 
}

const TopologyViewer: React.FC<IProps> = ({ appId }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const tippyInstancesRef = useRef<Instance[]>([])
  const isFirstLoadRef = useRef(true)

  useEffect(() => {
    const initGraph = async () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      const graph = new Graph({
        container: containerRef.current,
        width,
        height,
        grid: false,
        background: { color: 'transparent' },
        interacting: false,
      })
      graphRef.current = graph

      try {
        const standardData = await getTopologyData(appId)
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
          const health = matched?.health_level ?? 0
          const cpu_util = matched?.cpu_util ?? 0
          const mem_util = matched?.mem_util ?? 0
          const alert_num = matched?.alert_num
          const state = matched?.target_up === 0 ? '离线' : '在线'
          const arch = matched?.arch
          const color = health >= 90 ? 'rgb(49,59,73)' : 'red'

          return {
            ...node,
            data: {
              ...node.data,
              shapeName: node.shape,
              ident,
              ip: node.attrs?.label?.ip || '无IP',
              health,
              type: node.type,
              cpu_util,
              mem_util,
              alert_num,
              state,
              arch,
            },
            shape: 'html',
            html: iconMap[node.shape || ''](color, 30),
            attrs: {
              label: {
                text: node.attrs?.label?.text || node.type || '',
                fill: color,
                fontSize: 12,
                refY: '120%',
              },
            },
          }
        })


        graph.fromJSON({ ...topologyData, nodes: updatedNodes})

        // 缩放居中
        if (isFirstLoadRef.current) {
          graph.zoomToFit({ padding: 20, maxScale: 1, minScale: 0.2 })
          graph.centerContent()
          isFirstLoadRef.current = false
        }

        // 清除旧 tooltip
        tippyInstancesRef.current.forEach(ins => ins.destroy())
        tippyInstancesRef.current = []

        updatedNodes.forEach((node: any) => {
          const cell = graph.getCellById(node.id)
          const view = cell && graph.findViewByCell(cell)
          if (!view) return

          const { shapeName, ident, ip, type, health, cpu_util, mem_util, alert_num, state, arch } = cell.getData()
          const tip = tippy(view.container, {
            content: tippyMap[shapeName](type, ident, ip, state, cpu_util, mem_util, alert_num, health, arch),
            allowHTML: true,
            theme: 'light-border',
            placement: 'top',
            appendTo: document.body,
            animation: 'none',
            duration: [0, 0],
            interactive: false,
          })
          tippyInstancesRef.current.push(tip)
        })

      } catch (error) {
        console.error('拓扑图加载失败：', error)
      }
    }

    initGraph()

    return () => {
      if (graphRef.current) {
        graphRef.current.dispose()
        graphRef.current = null
      }
      tippyInstancesRef.current.forEach(ins => ins.destroy())
    }
  }, [appId])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', border: '1px solid #ddd' }}
    />
  )
}

export default TopologyViewer
