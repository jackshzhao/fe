import React, { useContext, useState } from 'react';
import { Drawer, Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Tooltip, Space } from 'antd';
import { DownOutlined, RightOutlined, CopyOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { copyToClipBoard } from '@/utils';
import { CommonStateContext } from '@/App';
import { getTargetInformationByIdent } from '../services';
import './style.less';

interface IProps {
  ident: string;
}

const transMetaData = new Map([
  ['platform', '平台信息'],
  ['cpu', 'CPU信息'],
  ['memory', '内存信息'],
  ['network','网卡信息'],
  ['filesystem', '文件系统'],
  ['GOARCH', '平台类型'],
  ['GOOS', '系统类型'],
  ['family', '处理器系列'],
  ['goV', 'go版本'],
  ['hostname', '主机名'],
  ['kernel_name', '系统内核'],
  ['kernel_release', '内核发布版本'],
  ['machine', '处理器架构'],
  ['os', '操作系统'],
  ['pythonV', 'python版本'],
  ['hardware_platform', '硬件平台'],
  ['kernel_version', '内核版本'],
  ['processor', '处理器'],

  ['cache_size', '缓存大小'],
  ['cpu_cores', 'cpu核心数'],
  ['cpu_logical_processors', 'cpu逻辑核心数'],
  ['family', 'cpu系列'],
  ['mhz', '时钟频率'],
  ['model_name', '型号名称'],
  ['stepping', 'cpu修订版本'],
  ['vendor_id', '供应商'],

  ['swap_total', '交换空间大小'],
  ['total', '内存大小'],

  ['interfaces', '接口'],
  ['ipaddress', 'ipv4'],
  ['ipaddressv6', 'ipv6'],
  ['macaddress', 'mac'],

  ['cache_size', '缓存大小'],
  ['cpu_cores', 'cpu核心数'],
  ['cpu_logical_processors', 'cpu逻辑核心数'],
  ['family', 'cpu系列'],
  ['mhz', '时钟频率'],
  ['model', 'cpu型号'],
  ['model_name', '型号名称'],
  ['stepping', 'cpu修订版本'],
  ['vendor_id', '供应商'],
]);

function bytesToSize(bytes, precision) {
  bytes = parseInt(bytes);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let posttxt = 0;
  if (bytes == 0) return '0.00';
  while (bytes >= 1000) {
    posttxt++;
    bytes = bytes / 1000;
  }
  return bytes.toFixed(precision) + ' ' + sizes[posttxt];
}

function RenderInterfaces({ value }) {
  const { t } = useTranslation('targets');
  const [expand, setExpand] = useState(false);

  return (
    <div>
      <div
        style={{
          cursor: 'pointer',
          color: 'rgba(28, 43, 52, .68)',
        }}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        {expand ? (
          <span>
            {t('meta_collapse')} <DownOutlined />
          </span>
        ) : (
          <span>
            {t('meta_expand')} <RightOutlined />
          </span>
        )}
      </div>
      {expand &&
        _.map(value, (item, index) => {
          return (
            <div key={index} className='target-information-interface'>
              {_.map(item, (v, k) => {
                return (
                  <div key={k} className='target-information-interface-item'>
                    <div className='target-information-interface-item-key'>{k}</div>
                    <div className='target-information-interface-item-value'>
                      <Tooltip title={t('meta_value_click_to_copy')} placement='right'>
                        <Tag
                          color='#f4f4f5'
                          onClick={() => {
                            copyToClipBoard(v);
                          }}
                        >
                          {v}
                        </Tag>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

function RenderFilesystem({ value }) {
  const { darkMode } = useContext(CommonStateContext);
  return (
    <>
      {_.map(value, (item, index) => {
        return (
          <div key={index} className='target-information-filesystem'>
            <div key={index} className='target-information-filesystem-name'>
              {item.name}
            </div>
            <div className='target-information-filesystem-mounted_on'>mounted on</div>
            <div className='target-information-filesystem-mounted_on-value'>
              <Tag color={darkMode ? 'rgb(50 53 69)' : '#f4f4f5'}>{item.mounted_on}</Tag>
            </div>
            <div className='target-information-filesystem-kb_size'>{bytesToSize(item.kb_size * 1000, 2)}</div>
          </div>
        );
      })}
    </>
  );
}

function Group({ name, data }) {
  const { t } = useTranslation('targets');
  const [expand, setExpand] = useState(true);
  const { darkMode } = useContext(CommonStateContext);

  const formatMate = (name) => {
    const res = transMetaData.get(name);
    if(res== undefined) {
      return name
    }
    return res; // 默认格式
  };

  return (
    <div key={name} className='target-information-group'>
      <div className='target-information-group-header'>
        <Space>
          <Space
            onClick={() => {
              setExpand(!expand);
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            {expand ? <DownOutlined /> : <RightOutlined />}
            {/* <span className='target-information-group-header-title'>{_.toUpper(name)}</span> */}
            <span className='target-information-group-header-title'>{formatMate(name)}</span>
            
          </Space>
          {data && (
            <CopyOutlined
              onClick={() => {
                copyToClipBoard(JSON.stringify(data));
              }}
            />
          )}
        </Space>
      </div>
      {!data && <div className='target-information-group-content'>{t('meta_no_data')}</div>}
      {expand && (
        <div className='target-information-group-content'>
          {name === 'filesystem' ? (
            <RenderFilesystem value={data} />
          ) : (
            _.map(data, (value, key) => {
              let val = value;
              if (name === 'memory' && _.includes(['total', 'swap_total'], key)) {
                val = bytesToSize(value, 2);
              }
              return (
                <div key={key} className='target-information-group-content-item'>
                  <div className='target-information-group-content-item-key'>{formatMate(key)}</div>
                  {_.isString(value) && (
                    <div className='target-information-group-content-item-value'>
                      <Tooltip title={t('meta_value_click_to_copy')} placement='right'>
                        <Tag
                          color={darkMode ? 'rgb(50 53 69)' : '#f4f4f5'}
                          onClick={() => {
                            copyToClipBoard(value);
                          }}
                        >
                          {val}
                        </Tag>
                      </Tooltip>
                    </div>
                  )}
                  {_.isArray(value) && key === 'interfaces' && <RenderInterfaces value={value} />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function TargetMetaDrawer(props: IProps) {
  const { t } = useTranslation('applications');
  let { ident } = props;
  const [visible, setVisible] = useState(false);
  const groupsName = ['platform', 'cpu', 'memory', 'network', 'filesystem'];
  const [information, setInformation] = useState({});

  return (
    <>
      <Tooltip title={t('meta_tip')}>
        <Button type="primary" size='small'
          onClick={() => {
            setVisible(true);
            getTargetInformationByIdent(ident).then((res) => {
              setInformation(res);
            });
          }}
        >
          查看
        </Button>
      </Tooltip>
      <Drawer
        destroyOnClose
        title={t('meta_title')}
        width={800}
        placement='right'
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
      >
        {_.map(groupsName, (groupName) => {
          return <Group key={groupName} name={groupName} data={information[groupName]} />;
        })}
      </Drawer>
    </>
  );
}
