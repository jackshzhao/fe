import React, { useState, useRef, useContext } from 'react';
import _ from 'lodash';
import { Table, Space, Button, Input, Select, Dropdown, Menu, Modal } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDebounceEffect } from 'ahooks';
import usePagination from '@/components/usePagination';
import Export from '@/pages/dashboard/List/Export';
import { CommonStateContext } from '@/App';
import { RuleType } from './types';
import Import from './Import';
import { getPayloads, deletePayloads } from '../services';
import { pathname } from '../constants';
import { TypeEnum } from '../types';
import { formatBeautifyJson, formatBeautifyJsons } from '../utils';
import PayloadFormModal from '../components/PayloadFormModal';

interface Props {
  component: string;
}

export default function index(props: Props) {
  const { component } = props;
  const { t } = useTranslation();
  const { busiGroups, groupedDatasourceList, darkMode } = useContext(CommonStateContext);
  const [filter, setFilter] = useState<{
    cate?: string;
    name?: string;
  }>({ cate: undefined, name: undefined });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ [index: string]: RuleType[] }>();
  const [cateList, setCateList] = useState<string[]>([]);
  const pagination = usePagination({ PAGESIZE_KEY: 'dashboard-builtin-pagesize' });
  const selectedRows = useRef<RuleType[]>([]);
  const fetchData = () => {
    setLoading(true);
    getPayloads<RuleType[]>({ component, type: TypeEnum.alert, name: filter.name })
      .then((res) => {
        setData(res);
        // 初始化 cateList 和 filter
        if (_.isEmpty(cateList)) {
          setCateList(_.keys(res));
          setFilter({
            ...filter,
            cate: _.head(_.keys(res)),
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useDebounceEffect(
    () => {
      fetchData();
    },
    [component, filter.name],
    {
      wait: 500,
    },
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Select
            style={{ width: 200 }}
            value={filter.cate}
            loading={loading}
            placeholder={t('builtInComponents:cate')}
            onChange={(val) => {
              setFilter({ ...filter, cate: val });
            }}
          >
            {_.map(cateList, (item) => {
              return (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
          <Input
            prefix={<SearchOutlined />}
            value={filter.name}
            onChange={(e) => {
              setFilter({ ...filter, name: e.target.value });
            }}
            placeholder={t('common:search_placeholder')}
            style={{ width: 300 }}
            allowClear
          />
        </Space>
        <Space>
          <Button
            type='primary'
            onClick={() => {
              PayloadFormModal({
                darkMode,
                action: 'create',
                cateList,
                contentMode: 'json',
                initialValues: {
                  type: TypeEnum.alert,
                  component,
                },
                onOk: () => {
                  fetchData();
                },
              });
            }}
          >
            {t('common:btn.add')}
          </Button>
          <Button
            onClick={() => {
              Import({
                data: formatBeautifyJsons(_.map(selectedRows.current, 'content')),
                busiGroups,
                groupedDatasourceList,
              });
            }}
          >
            {t('common:btn.batch_clone')}
          </Button>
          <Button
            onClick={() => {
              Export({
                data: formatBeautifyJsons(_.map(selectedRows.current, 'content')),
              });
            }}
          >
            {t('common:btn.batch_export')}
          </Button>
        </Space>
      </div>
      <Table
        className='mt8'
        size='small'
        rowKey='id'
        loading={loading}
        dataSource={filter.cate ? _.get(data, filter.cate, []) : []}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: string[], rows: RuleType[]) => {
            setSelectedRowKeys(selectedRowKeys);
            selectedRows.current = rows;
          },
        }}
        columns={[
          {
            title: t('common:table.name'),
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
              return (
                <Link
                  to={{
                    pathname: `${pathname}/alert/detail`,
                    search: `?id=${record.id}`,
                  }}
                  target='_blank'
                >
                  {value}
                </Link>
              );
            },
          },
          {
            title: t('common:table.operations'),
            width: 100,
            render: (record) => {
              return (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a
                          onClick={() => {
                            Import({
                              data: formatBeautifyJson(record.content),
                              busiGroups,
                              groupedDatasourceList,
                            });
                          }}
                        >
                          {t('common:btn.clone')}
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          onClick={() => {
                            Export({
                              data: formatBeautifyJson(record.content, 'array'),
                            });
                          }}
                        >
                          {t('common:btn.export')}
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          onClick={() => {
                            PayloadFormModal({
                              darkMode,
                              action: 'edit',
                              cateList,
                              contentMode: 'json',
                              initialValues: record,
                              onOk: () => {
                                fetchData();
                              },
                            });
                          }}
                        >
                          {t('common:btn.edit')}
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <Button
                          type='link'
                          danger
                          className='p0 height-auto'
                          onClick={() => {
                            Modal.confirm({
                              title: t('common:confirm.delete'),
                              onOk() {
                                deletePayloads([record.id]).then(() => {
                                  fetchData();
                                });
                              },
                            });
                          }}
                        >
                          {t('common:btn.delete')}
                        </Button>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type='link' icon={<MoreOutlined />} />
                </Dropdown>
              );
            },
          },
        ]}
        pagination={pagination}
      />
    </>
  );
}