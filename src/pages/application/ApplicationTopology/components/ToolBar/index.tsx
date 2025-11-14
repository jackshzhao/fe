import React, { useEffect, useState } from 'react'
import { Select, Modal,message } from 'antd';
import { useHistory } from 'react-router-dom';
import { Toolbar } from '@antv/x6-react-components'
import FlowGraph from '../../Graph'
import { getAppHealth,setTopologyData } from '@/services/application'
import {converttopologyDatatoStandard} from '../../util'
import {
  ClearOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import '@antv/x6-react-components/es/toolbar/style/index.css'

const Item = Toolbar.Item
const Group = Toolbar.Group
const { Option } = Select

type AppInfo = {
  id: string
  name: string
}

type Props = {
  onAppChange?: (name: string, id: string) => void
  appDataFromBack?:AppInfo[]
}

const ToolBar: React.FC<Props> = ({ onAppChange, appDataFromBack }) => {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [topologyName, setTopologyName] = useState<string | undefined>()
  const [topologyId, setTopologyId] = useState<string | undefined>()
  const [appDatasFromBack, setAppDatasFromBack] = useState<AppInfo[]>([])

  const history = useHistory()

  useEffect(() => {
    const { graph } = FlowGraph
    const { history } = graph

    setCanUndo(history.canUndo())
    setCanRedo(history.canRedo())

    history.on('change', () => {
      setCanUndo(history.canUndo())
      setCanRedo(history.canRedo())
    })

    setZoom(graph.zoom())
    graph.on('scale', () => {
      setZoom(graph.zoom())
    })
    console.log("appdata:",appDataFromBack);

    setAppDatasFromBack(appDataFromBack ?? [])
  }, [])

  const handleTopologyChange = (value: string | undefined) => {
    setTopologyName(value)
    const selected = appDatasFromBack.find((item) => item.name === value)
    setTopologyId(selected?.id)

    if (value && selected?.id && onAppChange) {
      onAppChange(value, selected.id)
    }
  }

  const handleClick = (name: string) => {
    const { graph } = FlowGraph

    switch (name) {
      case 'undo':
        graph.history.undo()
        break
      case 'redo':
        graph.history.redo()
        break
      case 'delete':
        graph.clearCells()
        break
      case 'save':
        if (!topologyName || topologyId === undefined) {
          Modal.warning({ content: '请先选择应用名称后再保存' })
          break
        }

        const nodes = graph.getNodes().map((node) => {
          // 清空 fo html 内容（如果是 html 节点）
          const attrs = node.getAttrs()
          if (attrs.fo) {
            attrs.fo.html = ''
            node.setAttrs(attrs)
          }
          return node.toJSON()
        })

        const edges = graph.getEdges().map((edge) => edge.toJSON())

        const flowchartData = {
          appName: topologyName,
          group_id: topologyId,
          nodes,
          edges,
        }

        //const serializedData = JSON.stringify(flowchartData)
        const standardData = converttopologyDatatoStandard(flowchartData)
        setTopologyData(JSON.stringify(standardData))
          .then((res) => {
            if (res.err === '') {
              message.success('拓扑图保存成功');
            } else {
              message.error(`拓扑图保存失败：${res.err}`);
            }
          })
      
        localStorage.setItem('flowchartData', JSON.stringify(standardData))
        break
      case 'zoomIn':
        graph.zoom(0.1)
        break
      case 'zoomOut':
        graph.zoom(-0.1)
        break
      default:
        break
    }
  }

  return (
    <Toolbar hoverEffect={true} onClick={handleClick}>
      <Group>
        <Item name="delete" icon={<ClearOutlined />} tooltip="清除" />
      </Group>
      <Group>
        <Item
          name="zoomIn"
          tooltip="放大"
          icon={<ZoomInOutlined />}
          disabled={zoom > 1.5}
        />
        <Item
          name="zoomOut"
          tooltip="缩小"
          icon={<ZoomOutOutlined />}
          disabled={zoom < 0.5}
        />
        <span style={{ lineHeight: '28px', fontSize: 12, marginRight: 4 }}>
          {`${(zoom * 100).toFixed(0)}%`}
        </span>
      </Group>
      <Group>
        <Item
          name="undo"
          tooltip="撤销"
          icon={<UndoOutlined />}
          disabled={!canUndo}
        />
        <Item
          name="redo"
          tooltip="重做"
          icon={<RedoOutlined />}
          disabled={!canRedo}
        />
      </Group>
      <Group>
        <Item name="save" icon={<SaveOutlined />} tooltip="保存" />
      </Group>
      <Group>
        <Item
          name="view"
          icon={<EyeOutlined />}
          tooltip="查看"
          onClick={() => history.push(`/application-details?ids=${topologyId}&isLeaf=true&names=${topologyName}&activeTabKey=topology`)}
        />
        <Select
          showSearch
          allowClear
          placeholder="请选择应用名称"
          style={{ width: 200 }}
          value={topologyName}
          onChange={handleTopologyChange}
          filterOption={(input, option) =>
            (option?.children?.toString() || '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {appDatasFromBack.map((a) => (
            <Option key={a.name} value={a.name}>
              {a.name}
            </Option>
          ))}
        </Select>
      </Group>
    </Toolbar>
  )
}

export default ToolBar
