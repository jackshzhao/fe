import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Modal, Tag, Form, Input, Alert, Select, Tooltip,Table } from 'antd';
import { DatabaseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import _, { debounce } from 'lodash';
import classNames from 'classnames';
import { bindTags, unbindTags, moveTargetBusi, updateTargetNote, deleteTargets, getTargetTags } from '@/services/targets';
import PageLayout from '@/components/pageLayout';
import { getBusiGroups } from '@/services/common';
import {getMonObjectList, updateTargetWeight} from '@/services/targets'
import { CommonStateContext } from '@/App';
import { useLocation } from 'react-router-dom';


import AlertLineChart from './AlertLineChart';
import {getAppHealthTendcy,getAppResponseTimeTendcy,getAlertTable, getHttpRequestTable} from '@/services/application';
import List from './List';
import {formatTimesHour, getTimesRange} from './utils'
import BusinessGroup from './BusinessGroup';
import BusinessGroup2, { getCleanBusinessGroupIds } from '@/components/BusinessGroup';
import './locale';
import './index.less';
import { render } from 'react-dom';
import { And } from 'lezer-promql';

export { BusinessGroup }; // TODO 部分页面使用的老的业务组组件，后续逐步替换

enum OperateType {
  BindTag = 'bindTag',
  UnbindTag = 'unbindTag',
  UpdateBusi = 'updateBusi',
  UpdateWeigth = 'updateWeight',
  RemoveBusi = 'removeBusi',
  UpdateNote = 'updateNote',
  Delete = 'delete',
  None = 'none',
}

interface OperateionModalProps {
  operateType: OperateType;
  setOperateType: any;
  idents: string[];
  reloadList: () => void;
}

const GREEN_COLOR = '#3FC453';
const YELLOW_COLOR = '#FF9919';
const RED_COLOR = '#FF656B';
const LOST_COLOR_LIGHT = '#CCCCCC';
const LOST_COLOR_DARK = '#929090';


//使用 TextArea 组件来创建多行输入框，用rows来控住行数
const {TextArea} = Input;

//用于从 OperateionModalProps 类型的 props 对象中提取属性
const OperationModal: React.FC<OperateionModalProps> = ({ operateType, setOperateType, idents, reloadList }) => {
  const { t } = useTranslation('applications');
  const { busiGroups } = useContext(CommonStateContext);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [identList, setIdentList] = useState<string[]>(idents);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const detailProp = operateType === OperateType.UnbindTag ? tagsList : busiGroups;

  // 绑定标签弹窗内容
  const bindTagDetail = () => {
    // 校验单个标签格式是否正确
    function isTagValid(tag) {
      const contentRegExp = /^[a-zA-Z_][\w]*={1}[^=]+$/;

      //// 返回一个对象，包含两个属性：isCorrectFormat 和 isLengthAllowed
      return {
        isCorrectFormat: contentRegExp.test(tag.toString()), //// 检查标签是否符合指定的格式
        isLengthAllowed: tag.toString().length <= 64, //// 检查标签长度是否在允许范围内
      };
    }

    // 渲染标签
    function tagRender(content) {
      const { isCorrectFormat, isLengthAllowed } = isTagValid(content.value);
      return isCorrectFormat && isLengthAllowed ? (
        <Tag closable={content.closable} onClose={content.onClose}>
          {content.value}
        </Tag>
      ) : (
        <Tooltip title={isCorrectFormat ? t('bind_tag.render_tip1') : t('bind_tag.render_tip2')}>
          <Tag color='error' closable={content.closable} onClose={content.onClose} style={{ marginTop: '2px' }}>
            {content.value}
          </Tag>
        </Tooltip>
      );
    }

    // 校验所有标签格式
    function isValidFormat() {
      return {
        validator(_, value) {
          const isInvalid = value.some((tag) => {
            const { isCorrectFormat, isLengthAllowed } = isTagValid(tag);
            if (!isCorrectFormat || !isLengthAllowed) {
              return true;
            }
          });
          const tagkeys = value.map((tag) => {
            const tagkey = tag.split('=')[0];
            return tagkey;
          });
          const isDuplicateKey = tagkeys.some((tagkey, index) => {
            return tagkeys.indexOf(tagkey) !== index;
          });
          if (isInvalid) {
            return Promise.reject(new Error(t('bind_tag.msg2')));
          }
          if (isDuplicateKey) {
            return Promise.reject(new Error(t('bind_tag.msg3')));
          }
          return Promise.resolve();
        },
      };
    }

    return {
      operateTitle: t('bind_tag.title'),
      requestFunc: bindTags,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.tag')} name='tags' rules={[{ required: true, message: t('bind_tag.msg1') }, isValidFormat]}>
            <Select mode='tags' tokenSeparators={[' ']} open={false} placeholder={t('bind_tag.placeholder')} tagRender={tagRender} />
          </Form.Item>
        );
      },
    };
  };

  // 解绑标签弹窗内容
  const unbindTagDetail = (tagsList) => {
    return {
      operateTitle: t('unbind_tag.title'),
      requestFunc: unbindTags,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.tag')} name='tags' rules={[{ required: true, message: t('unbind_tag.msg') }]}>
            <Select mode='multiple' showArrow={true} placeholder={t('unbind_tag.placeholder')} options={tagsList.map((tag) => ({ label: tag, value: tag }))} />
          </Form.Item>
        );
      },
    };
  };

  // 移出业务组弹窗内容
  const removeBusiDetail = () => {
    return {
      operateTitle: t('remove_busi.title'),
      requestFunc: moveTargetBusi,
      isFormItem: false,
      render() {
        return <Alert message={t('remove_busi.msg')} type='error' />;
      },
    };
  };

  // 修改备注弹窗内容
  const updateNoteDetail = () => {
    return {
      operateTitle: t('update_note.title'),
      requestFunc: updateTargetNote,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.note')} name='note'>
            <Input maxLength={64} placeholder={t('update_note.placeholder')} />
          </Form.Item>
        );
      },
    };
  };

  // 批量删除弹窗内容
  const deleteDetail = () => {
    return {
      operateTitle: t('batch_delete.title'),
      requestFunc: deleteTargets,
      isFormItem: false,
      render() {
        return <Alert message={t('batch_delete.msg')} type='error' />;
      },
    };
  };

  // 修改业务组弹窗内容
  const updateBusiDetail = (busiGroups) => {
    return {
      operateTitle: t('update_busi.title'),
      requestFunc: moveTargetBusi,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('update_busi.label')} name='bgid' rules={[{ required: true }]}>
            <Select
              showSearch
              style={{ width: '100%' }}
              options={filteredBusiGroups.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              optionFilterProp='label'
              filterOption={false}
              onSearch={handleSearch}
              onFocus={() => {
                getBusiGroups('').then((res) => {
                  setFilteredBusiGroups(res.dat || []);
                });
              }}
              onClear={() => {
                getBusiGroups('').then((res) => {
                  setFilteredBusiGroups(res.dat || []);
                });
              }}
            />
          </Form.Item>
        );
      },
    };
  };

  // 修改权重弹窗内容
  const updateWeightDetail = () => {
    return {
      operateTitle: t('update_weight.title'),
      requestFunc: updateTargetWeight,
      isFormItem: true,
      render() {
        return (
          <Form.Item label={t('common:table.weight')} name='weight'>
            <Select  showArrow={true} placeholder={'请选择权重'} 
                      options={[{ label: '普通节点', value: '普通节点' },{ label: '关键节点', value: '关键节点' }]} />
          </Form.Item>
        );
      },
      
    };
  };


  const operateDetail = {
    bindTagDetail,
    unbindTagDetail,
    updateBusiDetail,
    removeBusiDetail,
    updateNoteDetail,
    deleteDetail,
    updateWeightDetail,
    noneDetail: () => ({
      operateTitle: '',
      requestFunc() {
        return Promise.resolve();
      },
      isFormItem: false,
      render() {},
    }),
  };
  //模版字符串的方式动态调用函数
  const { operateTitle, requestFunc, isFormItem, render } = operateDetail[`${operateType}Detail`](detailProp);
  const [filteredBusiGroups, setFilteredBusiGroups] = useState(busiGroups);
  function formatValue() {
    const inputValue = form.getFieldValue('idents');
    const formattedIdents = inputValue.split(/[ ,\n]+/).filter((value) => value);
    const formattedValue = formattedIdents.join('\n');
    // 自动格式化表单内容
    if (inputValue !== formattedValue) {
      form.setFieldsValue({
        idents: formattedValue,
      });
    }
    // 当对象标识变更时，更新标识数组
    if (identList.sort().join('\n') !== formattedIdents.sort().join('\n')) {
      setIdentList(formattedIdents);
    }
  }

  // 提交表单
  function submitForm() {
    form.validateFields().then((data) => {
      //console.log(`submitFormdata:${JSON.stringify(data)}`)
      setConfirmLoading(true);
      data.idents = data.idents.split('\n');
      requestFunc(data)
        .then(() => {
          setOperateType(OperateType.None);
          reloadList();
          form.resetFields();
          setConfirmLoading(false);
        })
        .catch(() => setConfirmLoading(false));
    });
  }

  // 初始化展示所有业务组
  useEffect(() => {
    if (!filteredBusiGroups.length) {
      setFilteredBusiGroups(busiGroups);
    }
  }, [busiGroups]);

  const fetchBusiGroup = (e) => {
    getBusiGroups(e).then((res) => {
      setFilteredBusiGroups(res.dat || []);
    });
  };
  const handleSearch = useCallback(debounce(fetchBusiGroup, 800), []);

  // 点击批量操作时，初始化默认监控对象列表
  useEffect(() => {
    if (operateType !== OperateType.None) {
      setIdentList(idents);
      form.setFieldsValue({
        idents: idents.join('\n'),
      });
    }
  }, [operateType, idents]);

  // 解绑标签时，根据输入框监控对象动态获取标签列表
  useEffect(() => {
    if (operateType === OperateType.UnbindTag && identList.length) {
      getTargetTags({ idents: identList.join(',') }).then(({ dat }) => {
        // 删除多余的选中标签
        const curSelectedTags = form.getFieldValue('tags') || [];
        form.setFieldsValue({
          tags: curSelectedTags.filter((tag) => dat.includes(tag)),
        });

        setTagsList(dat);
      });
    }
  }, [operateType, identList]);

  return (
    <Modal
      visible={operateType !== 'none'}
      title={operateTitle}
      confirmLoading={confirmLoading}
      okButtonProps={{
        danger: operateType === OperateType.RemoveBusi || operateType === OperateType.Delete,
      }}
      okText={operateType === OperateType.RemoveBusi ? t('remove_busi.btn') : operateType === OperateType.Delete ? t('batch_delete.btn') : t('common:btn.ok')}
      onOk={submitForm}
      onCancel={() => {
        setOperateType(OperateType.None);
        form.resetFields();
      }}
    >
      {/* 基础展示表单项 */}
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label={t('targets')} name='idents' rules={[{ required: true }]}>
          <TextArea autoSize={{ minRows: 3, maxRows: 10 }} placeholder={t('targets_placeholder')} onBlur={formatValue} />
        </Form.Item>
        {isFormItem && render()}
      </Form>
      {!isFormItem && render()}
    </Modal>
  );
};

const Application: React.FC = (props) => {
  const {t} = useTranslation("applications");
  const { businessGroup } = useContext(CommonStateContext);
  //const [gids, setGids] = useState<string | undefined>(businessGroup.ids);
  const [operateType, setOperateType] = useState<OperateType>(OperateType.None);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [selectedIdents, setSelectedIdents] = useState<string[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(_.uniqueId('refreshFlag_')); //利用 _.uniqueId('refreshFlag_') 方法生成了一个初始的唯一 ID
  const [showLineChart, setShowLineChart] = useState(false);
  const [alertLineData,setalertLineData] = useState([]);
  const [appTimeData,setAppTimeData] = useState([]);
  const [alertTableData,setalertTableData] = useState([]);
  const [httpRequestTableData,sethttpRequestTableData] = useState([]);
  //const [appTitle,setAppTitle] = useState('');
  
   
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ids = queryParams.get('ids');
  const gids:string = ids || '0';
  const names = queryParams.get('names') || '';
  const appTitle:string = names || ' '
    
  
  const [timesrange_7d, setTimerange_7d] = useState<{ start: number, end: number }>({ start: 0, end: 0 });

  useEffect(() => {
    
    setShowLineChart(true)
    
    //获取7天的时间范围
    const { start, end } = getTimesRange(7,0,0);
    //获取24小时的时间范围
    const { start:startOneDay, end:endOneDay } = getTimesRange(1,0,0);
    //console.log(`start1${start}, end1${end} `)
    
    getAppHealthTendcy(gids,start,end,2520).then((res) => {
      for(var i = 0; i < res.length; i++){
        res[i][0] = formatTimesHour(res[i][0])
      }
      //console.log("res1:",res)
      setalertLineData(res);
    });

    getAppResponseTimeTendcy(names,startOneDay,endOneDay,360).then((res) => {
      for(var i = 0; i < res.length; i++){
        res[i][0] = formatTimesHour(res[i][0])
        res[i][1] = (res[i][1] * 1000).toFixed(2)
      }
      setAppTimeData(res);
    });

    getAlertTable(gids).then((res) => {
      if(res === null){
        return
      }
      for(var i = 0; i < res.length; i++){
        res[i].first_trigger_time = formatTimesHour(res[i].first_trigger_time)
        res[i].trigger_time = formatTimesHour(res[i].trigger_time)
        if(res[i].severity === 1){
          res[i].severity = '紧急告警'
        }
        if(res[i].severity === 2){
          res[i].severity = '重要告警'
        }
        if(res[i].severity === 3){
          res[i].severity = '普通告警'
        }
      }      
      //console.log("res2:",res)
      setalertTableData(res);
    });

    getHttpRequestTable(appTitle).then((res) => {
      if(res === null){
        return
      }
      for(var i =0; i < res.length; i++){
        if(res[i].result_code === 0){
          res[i].result_code = "正常"
        }else{
          res[i].result_code = "异常"
        }

        res[i].response_time = res[i].response_time.toFixed(2)
      }
      sethttpRequestTableData(res);
    });

    //获取机器列表
    // getMonObjectList({gids:gids}).then((res) => {
    //   setAppTitle(res.dat.list[0].group_obj.name)
    // });
    // if(localStorage.getItem(gids)){
    //   localStorage.removeItem('gids')
    //   localStorage.removeItem('appTitle') 
    //   localStorage.removeItem('showHeader') 
    // }
    
        
  }, [gids]);

  const appHttpRequestColumns = [
    {
      title: '接口地址',
      dataIndex: 'target',
      key: 'target',
      width: '25%',
    },
    {
      title: '连通性',
      dataIndex: 'result_code',
      key: 'result_code',
      width: '25%',
      render(text,record){
        let backgroundColor;
        if (text === "正常"){
          backgroundColor = GREEN_COLOR;
        }
        if(text === "异常"){
          backgroundColor = RED_COLOR;
        }
        return(
          <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {text}
            </div>
        );
      },
    },{
      title: 'http请求返回码',
      dataIndex: 'response_code',
      key: 'response_code',
      width: '25%',
      render(text,record){
        let backgroundColor = RED_COLOR;
        if (text === 200){
          backgroundColor = GREEN_COLOR;
        }
        return(
          <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {text}
            </div>
        );
      },
    },
    {
      title: '延迟(毫秒)',
      dataIndex: 'response_time',
      key: 'response_time',
      width: '25%',
      render(text,record){
        let backgroundColor = RED_COLOR;
        if(text < 500){
          backgroundColor = GREEN_COLOR;
        }
        if(text < 2000){
          backgroundColor = YELLOW_COLOR;
        }
      
        return(
          <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {text}
            </div>
        )
      }
    },
  ];

  const alertColumns = [
    {
      title: '机器',
      dataIndex: 'target_ident',
      key: 'target_ident',
    },
    {
      title: '告警名称',
      dataIndex: 'rule_name',
      key: 'rule_name',
    },{
      title: '告警级别',
      dataIndex: 'severity',
      key: 'severity',
    },
    {
      title: '首次触发时间',
      dataIndex: 'first_trigger_time',
      key: 'first_trigger_time',
    },
    {
      title: '触发时间',
      dataIndex: 'trigger_time',
      key: 'trigger_time',
    },
  ];
  return (
    <PageLayout showBack backPath='/applications' title={appTitle}>
      <div className='object-manage-page-content'>
      {/* <BusinessGroup2
          showSelected={gids !== '0' && gids !== undefined}
          renderHeadExtra={() => {
            return (
              <div>
                
                <div
                  className={classNames({
                    'n9e-biz-group-item': true,
                    active: gids === '0',
                  })}
                  onClick={() => {
                    setGids('0');
                    setShowLineChart(false);
                  }}
                >
                  {t('ungrouped_targets')}
                </div>
                <div
                  className={classNames({
                    'n9e-biz-group-item': true,
                    active: gids === undefined,
                  })}
                  onClick={() => {
                    setGids(undefined);
                    setShowLineChart(false);
                  }}
                >
                  {t('all_targets')}
                </div>
              </div>
            );
          }}
          onSelect={(key) => {
            const ids = getCleanBusinessGroupIds(key);
            setGids(ids);
            setShowLineChart(true);
          }}
        /> */}
        <div
          className='table-area n9e-border-base'
          style={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <List
            gids={gids}
            appTitle={appTitle}
            selectedIdents={selectedIdents}
            setSelectedIdents={setSelectedIdents}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            refreshFlag={refreshFlag}
            setRefreshFlag={setRefreshFlag}
            setOperateType={setOperateType}
          />

          {/* 访问延迟 */}
          <div style={{width:'100%',display:'flex'}}>
            <div style={{width:'50%'}}>
              {showLineChart && <h3 style={{textAlign: 'center', marginBottom: '1px'}}>应用健康趋势</h3>}
              {showLineChart && <div style={{height:'280px'}}>
                <AlertLineChart data={alertLineData} ymax={100} ystep={20} Tname={'应用健康度'}/>
              </div>}
            </div>
            <div style={{width:'50%'}}>
              {showLineChart && <h3 style={{textAlign: 'center', marginBottom: '1px'}}>应用请求延迟(ms)</h3>}
              {showLineChart && <div style={{height:'280px'}}>
                <AlertLineChart data={appTimeData} ymax={500} ystep={50} Tname={'应用请求延迟'}/>
              </div>}
            </div>
          </div>

          {/* Http请求信息 */}
          {/* {showLineChart && <h3 style={{textAlign: 'center'}}>应用请求信息</h3>} */}
          {showLineChart &&  
            <Table
                  rowKey={httpRequestTableData=>httpRequestTableData['id']}
                  dataSource={httpRequestTableData}
                  columns={appHttpRequestColumns}
                  pagination={false} // Disable pagination for simplicity
            />
          }
          <br />
          {/* 告警信息 */}
          {showLineChart && <h3 style={{textAlign: 'center'}}>告警信息</h3>}
          {showLineChart &&  
            <Table
                  rowKey={alertTableData=>alertTableData['id']}
                  dataSource={alertTableData}
                  columns={alertColumns}
                  pagination={false} // Disable pagination for simplicity
            />}
        </div>
      </div>
      <OperationModal
        operateType={operateType}
        setOperateType={setOperateType}
        idents={selectedIdents}
        reloadList={() => {
          setRefreshFlag(_.uniqueId('refreshFlag_'));
        }}
      />
    </PageLayout>
  );
  
}

export default Application


