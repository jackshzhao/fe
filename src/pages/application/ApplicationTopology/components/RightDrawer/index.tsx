import React, { useEffect, useState } from 'react'
import { Form, Input, Button,Select } from 'antd'
import {getMonObjectList} from '@/services/targets'

type Props = {
  selectCell: any
  close: () => void
  appName: string
  appID?: string
}

type NodeIdentInfo = {
  ident: string
  host_ip: string
  id: string
}

const { Option } = Select


const RightDrawer: React.FC<Props> = ({ selectCell, close, appName, appID }) => {
  const [identDatasFromBack, setIdentDatasFromBack] = useState<NodeIdentInfo[]>([])
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
  
  useEffect(() => {
    if (appName && appID !== undefined) {
      console.log('App:', appName, 'ID:', appID)
      //获取机器列表
      getMonObjectList({gids:appID}).then((res) => {
        console.log(`----MonObjectres:${res.dat.list}`)
        setIdentDatasFromBack(res.dat.list)
      });
    
    }
  }, [appName, appID])

  const handleIdentChange = (value: string | undefined) => {
    //setNodeIdent(value)
    const selected = identDatasFromBack.find((item) => item.ident === value)
    const ip = selected?.host_ip || ''
    const target_id = selected?.id || ''
    //setNodeHostIp(ip)
    form.setFieldsValue({ nodeIp: ip, nodeId: target_id })  // 更新 Form 内的 IP 值
  }

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
              {identDatasFromBack.map((i) => (
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
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default RightDrawer
