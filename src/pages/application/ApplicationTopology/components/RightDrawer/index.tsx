import React, { useEffect, useState } from 'react'
import { Form, Input, Button,Select } from 'antd'
import {getMonObjectList} from '@/services/targets'

type Props = {
  selectCell: any
  close: () => void
  appName: string
  appID?: string
  switchID?:string
  loadbalanceID?:string
  gatewayID?:string
  routerID?:string
  storageID?:string
}

type NodeIdentInfo = {
  ident: string
  host_ip: string
  id: string
}

const { Option } = Select


const RightDrawer: React.FC<Props> = ({ selectCell, close, appName, appID, switchID, loadbalanceID, gatewayID, routerID, storageID }) => {
  const [identDatasFromBack, setIdentDatasFromBack] = useState<NodeIdentInfo[]>([])
  const [switchDataFromBack, setSwitchDataFromBack] = useState<NodeIdentInfo[]>([]);
  const [loadbalanceDataFromBack, setloadbalanceDataFromBack] = useState<NodeIdentInfo[]>([]);
  const [gatewayDataFromBack, setGatewayDataFromBack] = useState<NodeIdentInfo[]>([]);
  const [routerDataFromBack, setRouterDataFromBack] = useState<NodeIdentInfo[]>([]);
  const [storageDataFromBack, setStorageDataFromBack] = useState<NodeIdentInfo[]>([]);
  //const [nodeIdent, setNodeIdent] = useState<string>()  
  //const [nodeHostIp, setNodeHostIp] = useState<string>()  
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    const { nodeName,nodeIdent,nodeIp,nodeId} = values
    selectCell.attr('label/text', nodeName) //更新节点数据
    selectCell.attr('label/ident', nodeIdent) //更新节点数据
    selectCell.attr('label/ip', nodeIp) //更新节点数据
    selectCell.attr('label/nodeId', nodeId)
  }
  const nodeName = selectCell.store.data.attrs.label.text
  const nodeIp = selectCell.store.data.attrs.label.ip
  const nodeIdent = selectCell.store.data.attrs.label.ident
  const nodeId = selectCell.store.data.attrs.label.nodeId
  const nodeType = selectCell.shape //节点类型
  
  useEffect(() => {
    if (appName && appID !== undefined) {
      console.log('App:', appName, 'ID:', appID, 'NodeType:', nodeType)
      //获取机器列表
      getMonObjectList({gids:appID}).then((res) => {
        setIdentDatasFromBack(res.dat.list)
      });
      //获取交换机列表
      getMonObjectList({gids:switchID}).then((res) => {
        setSwitchDataFromBack(res.dat.list)
      });
      //获取负载均衡
      getMonObjectList({gids:loadbalanceID}).then((res) => {
        setloadbalanceDataFromBack(res.dat.list)
      });
      //获取网关
      getMonObjectList({gids:gatewayID}).then((res) => {
        setGatewayDataFromBack(res.dat.list)
      });
      //获取路由
      getMonObjectList({gids:routerID}).then((res) => {
        setRouterDataFromBack(res.dat.list)
      });
      //获取存储
      getMonObjectList({gids:storageID}).then((res) => {
        setStorageDataFromBack(res.dat.list)
      });
    
    }
  }, [appName, appID, selectCell])

  const handleIdentChange = (value: string | undefined) => {
    // 根据当前类型找到对应的数据源
    let sourceList: NodeIdentInfo[] = []
    if (nodeType.includes('switch')) {
      sourceList = switchDataFromBack
    } else if (nodeType.includes('loadbalance')) {
      sourceList = loadbalanceDataFromBack
    } else if (nodeType.includes('gateway')) {
      sourceList = gatewayDataFromBack
    } else if (nodeType.includes('router')) {
      sourceList = routerDataFromBack
    } else if (nodeType.includes('storage')) {
      sourceList = storageDataFromBack
    } else {
      sourceList = identDatasFromBack
    }
    //setNodeIdent(value)
    const selected = sourceList.find((item) => item.ident === value)
    const ip = selected?.host_ip || ''
    const target_id = selected?.id || ''
    form.setFieldsValue({ nodeIp: ip, nodeId: target_id })  // 更新 Form 内的 IP 值
  }

  // 动态选择数据源
  const getOptions = () => {
    if (nodeType.includes('switch')) return switchDataFromBack
    if (nodeType.includes('loadbalance')) return loadbalanceDataFromBack
    if (nodeType.includes('gateway')) return gatewayDataFromBack
    if (nodeType.includes('router')) return routerDataFromBack
    if (nodeType.includes('storage')) return storageDataFromBack
    return identDatasFromBack
  }

  const options = getOptions()

  return (
    <div className="right-drawer">
      <div className="tt">
        <span>节点设置</span>
      </div>
      <div className="wrap">
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ nodeName,nodeIdent,nodeIp,nodeId}}
          onFinish={onFinish}
        >
        
          <Form.Item
            name="nodeName"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="节点名称" />
          </Form.Item>
          <Form.Item
            name="nodeIdent"
            label="节点标识"
          >
            <Select
              showSearch
              allowClear
              placeholder="请选择节点标识"
              style={{ width: 200 }}
              
              onChange={handleIdentChange}
              getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              filterOption={(input, option) =>
                (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {options.map((i) => (
                <Option key={i.ident} value={i.ident}>
                  {i.ident}
                </Option>
              ))}
            </Select>

          </Form.Item>
          <Form.Item
            name="nodeIp"
            label="节点IP"
          >
            <Input placeholder="请输入节点IP"  disabled />
          </Form.Item>
          <Form.Item
            name="nodeId"
          >
            <Input type="hidden" />
          </Form.Item>
      
          <Form.Item style={{ marginTop: '40px', textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default RightDrawer
