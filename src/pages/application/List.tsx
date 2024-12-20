import React, { useState, useRef, useEffect, useContext } from 'react';
import { Table, Tag, Tooltip, Space, Input, Dropdown, Menu, Button, Modal, message, Select, Popconfirm } from 'antd';
import {Link} from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined, DownOutlined, ReloadOutlined, CopyOutlined, ApartmentOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import { BusiGroupItem } from '@/store/commonInterface';
import { getMonObjectList } from '@/services/targets';
import { timeFormatter } from '@/pages/dashboard/Renderer/utils/valueFormatter';
import { CommonStateContext } from '@/App';
import clipboard from './clipboard';
import OrganizeColumns from './OrganizeColumns';
import { getDefaultColumnsConfigs, setDefaultColumnsConfigs } from './utils';
import TargetMetaDrawer from './TargetMetaDrawer';
import categrafInstallationDrawer from './components/categrafInstallationDrawer';
import Explorer from './components/Explorer';

// @ts-ignore
import CollectsDrawer from 'plus:/pages/collects/CollectsDrawer';
// @ts-ignore
import UpgradeAgent from 'plus:/parcels/Targets/UpgradeAgent';
// @ts-ignore
import VersionSelect from 'plus:/parcels/Targets/VersionSelect';
// @ts-ignore
import { extraColumns } from 'plus:/parcels/Targets';
import { text } from 'd3';

export const pageSizeOptions = ['10', '20', '50', '100'];

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

interface ITargetProps {
  id: number;
  cluster: string;
  group_id: number;
  group_obj: object | null;
  ident: string;
  note: string;
  tags: string[];
  update_at: number;
}

interface IProps {
  gids?: string;
  appTitle?: string;
  
  selectedIdents: string[];
  setSelectedIdents: (selectedIdents: string[]) => void;
  selectedRowKeys: any[];
  setSelectedRowKeys: (selectedRowKeys: any[]) => void;
  refreshFlag: string;
  setRefreshFlag: (refreshFlag: string) => void;
  setOperateType: (operateType: OperateType) => void;
  //etOperateType: any;
}

const GREEN_COLOR = '#3FC453';
const YELLOW_COLOR = '#FF9919';
const RED_COLOR = '#FF656B';
const LOST_COLOR_LIGHT = '#CCCCCC';
const LOST_COLOR_DARK = '#929090';
const downtimeOptions = [1, 2, 3, 5, 10, 30];
const Unknown = () => {
  const { t } = useTranslation('applications');
  return <Tooltip title={t('unknown_tip')}>unknown</Tooltip>;
};

export default function List(props: IProps) {
  const { t } = useTranslation('applications');
  const { gids, appTitle,selectedIdents, setSelectedIdents, selectedRowKeys, setSelectedRowKeys, refreshFlag, setRefreshFlag, setOperateType } = props;
  const isAddTagToQueryInput = useRef(false);
  const [searchVal, setSearchVal] = useState('');
  const [tableQueryContent, setTableQueryContent] = useState<string>('');
  const [columnsConfigs, setColumnsConfigs] = useState<{ name: string; visible: boolean }[]>(getDefaultColumnsConfigs());
  const [collectsDrawerVisible, setCollectsDrawerVisible] = useState(false);
  const [collectsDrawerIdent, setCollectsDrawerIdent] = useState('');
  const [downtime, setDowntime] = useState();
  const [agentVersions, setAgentVersions] = useState<string>();
  const { darkMode } = useContext(CommonStateContext);
  const LOST_COLOR = darkMode ? LOST_COLOR_DARK : LOST_COLOR_LIGHT;
  const columns: ColumnsType<any> = [
    {
      title: (
        <Space>
          {t('common:table.ident')}
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu
                onClick={async ({ key }) => {
                  let tobeCopy = _.map(tableProps.dataSource, (item) => item.ident);
                  if (key === 'all') {
                    try {
                      const result = await featchData({ current: 1, pageSize: tableProps.pagination.total });
                      tobeCopy = _.map(result.list, (item) => item.ident);
                    } catch (error) {
                      console.error(error);
                    }
                  } else if (key === 'selected') {
                    tobeCopy = selectedIdents;
                  }

                  if (_.isEmpty(tobeCopy)) {
                    message.warn(t('copy.no_data'));
                    return;
                  }

                  const tobeCopyStr = _.join(tobeCopy, '\n');
                  const copySucceeded = clipboard(tobeCopyStr);

                  if (copySucceeded) {
                    message.success(t('ident_copy_success', { num: tobeCopy.length }));
                  } else {
                    Modal.warning({
                      title: t('host.copy.error'),
                      content: <Input.TextArea defaultValue={tobeCopyStr} />,
                    });
                  }
                }}
              >
                <Menu.Item key='current_page'>{t('copy.current_page')}</Menu.Item>
                <Menu.Item key='all'>{t('copy.all')}</Menu.Item>
                <Menu.Item key='selected'>{t('copy.selected')}</Menu.Item>
              </Menu>
            }
          >
            <CopyOutlined
              style={{
                cursor: 'pointer',
              }}
            />
          </Dropdown>
        </Space>
      ),
      dataIndex: 'ident',
      className: 'n9e-hosts-table-column-ident',
      render: (text, record) => { 
        let dashboardID = 6;  
        if(record.os === 'windows'){
          dashboardID = 7;
        }
        let  dashboardID2
        let sign
        if (!record.tags || record.tags.length === 0) {
          return (
            <Link to={`/dashboard/${dashboardID}?ident=${text}&prom=1&gids=${gids}&title=${appTitle}&showHeader=false`}>
              {text}
            </Link>
          );
        } else {
          // 遍历 tags，判断并根据包含的值显示不同的组件
          for (let item of record.tags) {
          
            // 设置不同中间件的 dashboardID2
            if (item.includes("Nginx") || item.includes("nginx")) {
              dashboardID2 = 19;
              sign = "中间件"
            } else if (item.includes("Tomcat") || item.includes("tomcat")) {
              dashboardID2 = 15;
              sign = "中间件"
            }else if (item.includes("tongweb") || item.includes("Tongweb")) {
              dashboardID2 = 29;
              sign = "中间件"
            } else if (item.includes("Oracle") || item.includes("oracle")) {
              dashboardID2 = 16;
              sign = "数据库"
            } else if (item.includes("MySQL") || item.includes("mysql") || item.includes("MySql")) {
              dashboardID2 = 21;
              sign = "数据库"
            }else if (item.includes("神通数据库")) {
              dashboardID2 = 30;
              sign = "数据库"
            }
      
            // 如果 tags 包含 "type"，返回 <Popconfirm>
            if (item.includes("type")) {
              return (
                <span style={{ cursor: 'pointer', color: 'rgb(24, 144, 255)' }}>
                  <Popconfirm
                    title="查看仪表盘"
                    onConfirm={() => { history.push(`/dashboard/${dashboardID}?ident=${text}&prom=1&gids=${gids}&title=${appTitle}&showHeader=false`); }}
                    onCancel={() => { history.push(`/dashboard/${dashboardID2}?ident=${text}&prom=1&gids=${gids}&title=${appTitle}&showHeader=false`); }}
                    okText="主机"
                    cancelText = {sign}
                    icon={null}
                  >
                    {text}
                  </Popconfirm>
                </span>
              );
            }
          }
      
          // 如果没有包含 "type"，返回 <Link>
          return (
            <Link to={`/dashboard/${dashboardID}?ident=${text}&prom=1&gids=${gids}&title=${appTitle}&showHeader=false`}>
              {text}
            </Link>
          );
        }
             
      }
    },
  ];

  const history = useHistory();

  _.forEach(columnsConfigs, (item) => {
    if (!item.visible) return;
    if(item.name === 'actions'){
      columns.push({
        title: t('actions'),
        key: 'actions',
        render: (text, record) => {
          
          return(
            <Space>
              <TargetMetaDrawer ident={record.ident} />
              {import.meta.env['VITE_IS_PRO'] && (
              <Tooltip title='查看关联采集配置'>
                <ApartmentOutlined
                  onClick={() => {
                    setCollectsDrawerVisible(true);
                    setCollectsDrawerIdent(text);
                  }}
                />
              </Tooltip>
            )}
            </Space>
          )
          
        }
      });
    }
   
    if (item.name === 'host_ip') {
      columns.push({
        title: t('host_ip'),
        dataIndex: 'host_ip',
        className: 'n9e-hosts-table-column-ip',
      });
    }
    if (item.name === 'tags') {
      columns.push({
        title: t('tags'),
        dataIndex: 'tags',
        className: 'n9e-hosts-table-column-tags',
        ellipsis: {
          showTitle: false,
        },
        render(tagArr) {
          const content =
            tagArr &&
            tagArr.map((item) => {
              // 如果 tag 包含 'type='，则移除 'type='，只显示 '=' 后面的部分
              const displayTag = item.includes('type=') ? item.split('type=')[1] : item;
    
              return (
                <Tag
                  color='purple'
                  key={item}
                  onClick={(e) => {
                    if (!tableQueryContent.includes(item)) {
                      isAddTagToQueryInput.current = true;
                      const val = tableQueryContent ? `${tableQueryContent.trim()} ${item}` : item;
                      setTableQueryContent(val);
                      setSearchVal(val);
                    }
                  }}
                >
                  {displayTag}
                </Tag>
              );
            });
          return (
            tagArr && (
              <Tooltip title={content} placement='topLeft' getPopupContainer={() => document.body} overlayClassName='mon-manage-table-tooltip'>
                {content}
              </Tooltip>
            )
          );
        },
      });
    }
    if (item.name === 'group_obj') {
      columns.push({
        title: t('group_obj'),
        dataIndex: 'group_obj',
        className: 'n9e-hosts-table-column-groups',
        render(groupObj: BusiGroupItem | null) {
          return groupObj ? groupObj.name : t('not_grouped');
        },
      });
    }
    if (item.name === 'mem_util') {
      columns.push({
        title: t('mem_util'),
        width: 100,
        dataIndex: 'mem_util',
        sorter: (a, b) => a.mem_util - b.mem_util,
        render(text, reocrd) {
          if (reocrd.cpu_num === -1) return <Unknown />;
          let backgroundColor = GREEN_COLOR;
          if (text > 70) {
            backgroundColor = YELLOW_COLOR;
          }
          if (text > 85) {
            backgroundColor = RED_COLOR;
          }
          if (reocrd.target_up === 0) {
            backgroundColor = LOST_COLOR;
          }

          return (
            <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {_.floor(text, 1)}%
            </div>
          );
        },
      });
    }
    if (item.name === 'cpu_util') {
      columns.push({
        title: t('cpu_util'),
        width: 100,
        dataIndex: 'cpu_util',
        sorter: (a, b) => a.cpu_util - b.cpu_util,
        render(text, reocrd) {
          if (reocrd.cpu_num === -1) return <Unknown />;
          let backgroundColor = GREEN_COLOR;
          if (text > 70) {
            backgroundColor = YELLOW_COLOR;
          }
          if (text > 85) {
            backgroundColor = RED_COLOR;
          }
          if (reocrd.target_up === 0) {
            backgroundColor = LOST_COLOR;
          }
          return (
            <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {_.floor(text, 1)}%
            </div>
          );
        },
      });
    }
    if (item.name === 'cpu_num') {
      columns.push({
        title: t('cpu_num'),
        width: 100,
        dataIndex: 'cpu_num',
        sorter: (a, b) => a.cpu_num - b.cpu_num,
        render: (val, reocrd) => {
          if (reocrd.cpu_num === -1) return <Unknown />;
          return val;
        },
      });
    }
    if (item.name === 'offset') {
      columns.push({
        title: (
          <Space>
            {t('offset')}
            <Tooltip title={t('offset_tip')}>
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        ),
        width: 100,
        dataIndex: 'offset',
        sorter: (a, b) => a.offset - b.offset,
        render(text, reocrd) {
          if (reocrd.cpu_num === -1) return <Unknown />;
          let backgroundColor = RED_COLOR;
          if (Math.abs(text) < 2000) {
            backgroundColor = YELLOW_COLOR;
          }
          if (Math.abs(text) < 1000) {
            backgroundColor = GREEN_COLOR;
          }
          if (reocrd.target_up === 0) {
            backgroundColor = LOST_COLOR;
          }
          return (
            <div
              className='table-td-fullBG'
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              {timeFormatter(text, 'milliseconds', 2)?.text}
            </div>
          );
        },
      });
    }
    //节点健康度
    if (item.name === 'health_level') {
      columns.push({
        title: (t('health_level')),
        width: 100,
        dataIndex: 'health_level',
        sorter: (a, b) => a.offset - b.offset,
        render(text, reocrd) {
          let backgroundColor = RED_COLOR;
          if (Math.abs(text) >60 ) {
            backgroundColor = YELLOW_COLOR;
          }
          if (Math.abs(text) >90) {
            backgroundColor = GREEN_COLOR;
          }
          
          return (
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
      });
    }
    //告警数
    if (item.name === 'alert_num') {
      columns.push({
        title: (t('alert_num')),
        width: 100,
        dataIndex: 'alert_num',
        sorter: (a, b) => a.offset - b.offset,
        render(text, reocrd) {
          let backgroundColor = GREEN_COLOR;
          if (Math.abs(text) >0 ) {
            backgroundColor = YELLOW_COLOR;
          }
          return (
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
      });
    }
    //权重    
    if (item.name === 'weight') {
      columns.push({
        title: t('weight'),
        dataIndex: 'weight',
        className: 'n9e-hosts-table-column-ip',
        render(text, reocrd) {
          
          if (Math.abs(text) ===1 ) {
            text = '关键节点';
          }
          if (Math.abs(text) === 0) {
            text = '普通节点';
          }
          
          return (
            <div
              className='n9e-hosts-table-column-ip'
            >
              {text}
            </div>
          );
        },
      });
    }
    if (item.name === 'os') {
      columns.push({
        title: t('os'),
        width: 100,
        dataIndex: 'os',
        render: (val, reocrd) => {
          if (reocrd.cpu_num === -1) return <Unknown />;
          return val;
        },
      });
    }
    if (item.name === 'arch') {
      columns.push({
        title: t('arch'),
        width: 100,
        dataIndex: 'arch',
        render: (val, reocrd) => {
          if (reocrd.cpu_num === -1) return <Unknown />;
          return val;
        },
      });
    }
    if (item.name === 'update_at') {
      columns.push({
        title: (
          <Space>
            {t('update_at')}
            <Tooltip title={t('update_at_tip')}>
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        ),
        width: 100,
        dataIndex: 'update_at',
        render: (val, reocrd) => {
          // let result = moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
          let result = '在线'
          let backgroundColor = GREEN_COLOR;
          if (reocrd.target_up === 0) {
            backgroundColor = RED_COLOR;
            result = '离线'
          }
          //  else if (reocrd.target_up === 1) {
          //   backgroundColor = YELLOW_COLOR;
          // }
          console.log("reocrd.target_up =========", reocrd.target_up)
          return (
            <div
              className='table-td-fullBG'
              style={{
                backgroundColor,
              }}
            >
              {result}
            </div>
          );
        },
      });
    }
    if (item.name === 'remote_addr') {
      columns.push({
        title: (
          <Space>
            {t('remote_addr')}
            <Tooltip title={t('remote_addr_tip')}>
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        ),
        width: 100,
        dataIndex: 'remote_addr',
        render: (val, reocrd) => {
          if (reocrd.cpu_num === -1) return <Unknown />;
          return val;
        },
      });
    }
    extraColumns(item.name, columns);
    if (item.name === 'note') {
      columns.push({
        title: t('common:table.note'),
        dataIndex: 'note',
        ellipsis: {
          showTitle: false,
        },
        render(note) {
          return (
            <Tooltip title={note} placement='topLeft' getPopupContainer={() => document.body}>
              {note}
            </Tooltip>
          );
        },
      });
    }
  });

  const featchData = ({ current, pageSize }: { current: number; pageSize: number }): Promise<any> => {
    const query = {
      query: tableQueryContent,
      gids: gids,
      limit: pageSize,
      p: current,
      downtime,
      agent_versions: _.isEmpty(agentVersions) ? undefined : JSON.stringify(agentVersions),
    };
    return getMonObjectList(query).then((res) => {
      return {
        total: res.dat.total,
        list: res.dat.list,
      };
    });
  };

  const showTotal = (total: number) => {
    return t('common:table.total', { total });
  };

  

  const { tableProps, run } = useAntdTable(featchData, {
    manual: true,
    defaultPageSize: localStorage.getItem('targetsListPageSize') ? _.toNumber(localStorage.getItem('targetsListPageSize')) : 30,
  });

  useEffect(() => {
    run({
      current: 1,
      pageSize: tableProps.pagination.pageSize,
    });
  }, [tableQueryContent, gids, downtime, agentVersions]);

  useEffect(() => {
    run({
      current: tableProps.pagination.current,
      pageSize: tableProps.pagination.pageSize,
    });
  }, [refreshFlag]);

  return (
    <div>
      <div className='table-operate-box'>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setRefreshFlag(_.uniqueId('refreshFlag_'));
            }}
          />
          <Input
            className='search-input'
            prefix={<SearchOutlined />}
            placeholder={t('search_placeholder')}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onPressEnter={() => {
              setTableQueryContent(searchVal);
            }}
            onBlur={() => {
              setTableQueryContent(searchVal);
            }}
          />
          <Select
            allowClear
            placeholder={t('filterDowntime')}
            style={{ width: 120 }}
            options={_.map(downtimeOptions, (item) => {
              return {
                label: t('filterDowntimeMin', { count: item }),
                value: item * 60,
              };
            })}
            value={downtime}
            onChange={(val) => {
              setDowntime(val);
            }}
          />
          <VersionSelect
            value={agentVersions}
            onChange={(val) => {
              setAgentVersions(val);
            }}
          />
        </Space>
        <Space>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu
                onClick={({ key }) => {
                  if (key) {
                    setOperateType(key as OperateType);
                  }
                }}
              >
                <Menu.Item key={OperateType.BindTag}>{t('bind_tag.title')}</Menu.Item>
                <Menu.Item key={OperateType.UnbindTag}>{t('unbind_tag.title')}</Menu.Item>
                <Menu.Item key={OperateType.UpdateBusi}>{t('update_busi.title')}</Menu.Item>
                <Menu.Item key={OperateType.RemoveBusi}>{t('remove_busi.title')}</Menu.Item>
                <Menu.Item key={OperateType.UpdateWeigth}>{t('update_weight.title')}</Menu.Item>
                <Menu.Item key={OperateType.UpdateNote}>{t('update_note.title')}</Menu.Item>
                <Menu.Item key={OperateType.Delete}>{t('batch_delete.title')}</Menu.Item>
                <UpgradeAgent
                  selectedIdents={selectedIdents}
                  onOk={() => {
                    setRefreshFlag(_.uniqueId('refreshFlag_'));
                  }}
                />
              </Menu>
            }
          >
            <Button>
              {t('common:btn.batch_operations')} <DownOutlined />
            </Button>
          </Dropdown>
          <Space>
            <Explorer selectedIdents={selectedIdents} />
            <Button
              onClick={() => {
                OrganizeColumns({
                  value: columnsConfigs,
                  onChange: (val) => {
                    setColumnsConfigs(val);
                    setDefaultColumnsConfigs(val);
                  },
                });
              }}
              icon={<EyeOutlined />}
            />
          </Space>
        </Space>
      </div>
      <Table
        className='mt8'
        rowKey='id'
        columns={columns}
        size='small'
        {...tableProps}
        showSorterTooltip={false}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRowKeys,
          onChange(selectedRowKeys, selectedRows: ITargetProps[]) {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedIdents(selectedRows ? selectedRows.map(({ ident }) => ident) : []);
          },
        }}
        pagination={{
          ...tableProps.pagination,
          showTotal: showTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: pageSizeOptions,
          onChange(page, pageSize) {
            localStorage.setItem('targetsListPageSize', _.toString(pageSize));
          },
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText:
            gids === undefined ? (
              <Trans
                ns='targets'
                i18nKey='all_no_data'
                components={{
                  a: (
                    <a
                      onClick={() => {
                        categrafInstallationDrawer({ darkMode });
                      }}
                    />
                  ),
                }}
              />
            ) : undefined,
        }}
      />
      <CollectsDrawer visible={collectsDrawerVisible} setVisible={setCollectsDrawerVisible} ident={collectsDrawerIdent} />
    </div>
  );
}
