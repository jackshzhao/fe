/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { useAntdTable, useDebounceFn } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Space, Table, Button, Input, Dropdown, Select, message, Modal, Tooltip, Menu } from 'antd';
import { SettingOutlined, DownOutlined, SearchOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';
import Markdown from '@/components/Markdown';
import PageLayout from '@/components/pageLayout';
import usePagination from '@/components/usePagination';
import RefreshIcon from '@/components/RefreshIcon';
import OrganizeColumns, { getDefaultColumnsConfigs, setDefaultColumnsConfigs, ajustColumns } from '@/components/OrganizeColumns';
import { getUnitLabel, buildUnitOptions } from '@/pages/dashboard/Components/UnitPicker/utils';
import { getMenuPerm } from '@/services/common';
import Collapse from '@/pages/monitor/object/metricViews/components/Collapse';
import { getDashboardCates } from '@/pages/dashboardBuiltin/services';
import { getMetrics, Record, Filter, getTypes, getCollectors, deleteMetrics, buildLabelFilterAndExpression } from './services';
import { defaultColumnsConfigs, LOCAL_STORAGE_KEY } from './constants';
import FormDrawer from './components/FormDrawer';
import Export from './components/Export';
import Import from './components/Import';
import Filters, { filtersToStr } from './components/Filters';
import ExplorerDrawer from './ExplorerDrawer';

export default function index() {
  const { t, i18n } = useTranslation('metricsBuiltin');
  const pagination = usePagination({ PAGESIZE_KEY: 'metricsBuiltin-pagesize' });
  const [refreshFlag, setRefreshFlag] = useState(_.uniqueId('refreshFlag_'));
  const [selectedRows, setSelectedRows] = useState<Record[]>([]);
  let defaultFilter = {} as Filter;
  try {
    defaultFilter = JSON.parse(window.localStorage.getItem('metricsBuiltin-filter') || '{}');
  } catch (e) {
    console.error(e);
  }
  const [filter, setFilter] = useState(defaultFilter as Filter);
  const [queryValue, setQueryValue] = useState(defaultFilter.query || '');
  const [typesList, setTypesList] = useState<string[]>([]);
  const [collectorsList, setCollectorsList] = useState<string[]>([]);
  const [columnsConfigs, setColumnsConfigs] = useState<{ name: string; visible: boolean }[]>(getDefaultColumnsConfigs(defaultColumnsConfigs, LOCAL_STORAGE_KEY));
  const [explorerDrawerVisible, setExplorerDrawerVisible] = useState(false);
  const [explorerDrawerData, setExplorerDrawerData] = useState<Record>();
  const [actionAuth, setActionAuth] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [typsMeta, setTypsMeta] = useState<{ name: String; icon_url: string }[]>([]);
  const filtersRef = useRef<any>(null);
  const { tableProps, run: fetchData } = useAntdTable(
    ({
      current,
      pageSize,
    }): Promise<{
      total: number;
      list: Record[];
    }> => {
      return getMetrics({ ...filter, limit: pageSize, p: current });
    },
    {
      refreshDeps: [refreshFlag, JSON.stringify(filter), i18n.language],
      defaultPageSize: pagination.pageSize,
    },
  );
  let columns: (ColumnType<Record> & { RC_TABLE_INTERNAL_COL_DEFINE?: any })[] = [
    {
      title: t('typ'),
      dataIndex: 'typ',
      RC_TABLE_INTERNAL_COL_DEFINE: {
        style: {
          minWidth: 70,
        },
      },
      render: (val) => {
        return (
          <Space>
            <img src={_.find(typsMeta, (meta) => meta.name === val)?.icon_url || '/image/default.png'} alt={val} style={{ width: 16, height: 16 }} />
            {val}
          </Space>
        );
      },
    },
    {
      title: t('collector'),
      dataIndex: 'collector',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      render: (val, record) => {
        const recordClone = _.cloneDeep(record);
        return (
          <Tooltip overlayClassName='ant-tooltip-max-width-600 ant-tooltip-with-link' title={record.note ? <Markdown content={record.note} /> : undefined}>
            <Button
              type='link'
              style={{ padding: 0 }}
              onClick={() => {
                const curFilter = filtersRef.current?.getActive();
                let label_filter = '';
                try {
                  if (curFilter && curFilter.configs) {
                    label_filter = filtersToStr(JSON.parse(curFilter.configs));
                  }
                } catch (e) {
                  console.error(e);
                }
                if (label_filter) {
                  buildLabelFilterAndExpression({
                    label_filter,
                    promql: record.expression,
                  })
                    .then((res) => {
                      recordClone.expression = res;
                      setExplorerDrawerVisible(true);
                      setExplorerDrawerData(recordClone);
                    })
                    .catch(() => {
                      message.warning(t('filter.build_labelfilter_and_expression_error'));
                      setExplorerDrawerVisible(true);
                      setExplorerDrawerData(recordClone);
                    });
                } else {
                  setExplorerDrawerVisible(true);
                  setExplorerDrawerData(recordClone);
                }
              }}
            >
              {val}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: t('unit'),
      dataIndex: 'unit',
      render: (val) => {
        return (
          <Tooltip overlayClassName='built-in-metrics-table-unit-option-desc' title={getUnitLabel(val, true, true)}>
            <span>{getUnitLabel(val, false)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: t('expression'),
      dataIndex: 'expression',
      render: (val) => {
        const splitArr = _.split(val, '\n');
        return _.map(splitArr, (item, index) => {
          return (
            <div
              key={index}
              style={{
                wordBreak: 'break-all',
              }}
            >
              {item}
              {index !== splitArr.length - 1 && <br />}
            </div>
          );
        });
      },
    },
    {
      title: t('note'),
      dataIndex: 'note',
    },
    {
      title: t('common:table.operations'),
      dataIndex: 'operator',
      render: (data, record: any) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                {actionAuth.add && (
                  <Menu.Item>
                    <FormDrawer
                      mode='clone'
                      initialValues={record}
                      title={t('clone_title')}
                      typesList={typesList}
                      collectorsList={collectorsList}
                      onOk={() => {
                        setRefreshFlag(_.uniqueId('refreshFlag_'));
                      }}
                    >
                      <a>{t('common:btn.clone')}</a>
                    </FormDrawer>
                  </Menu.Item>
                )}
                {actionAuth.edit && (
                  <Menu.Item>
                    <FormDrawer
                      mode='edit'
                      initialValues={record}
                      title={t('edit_title')}
                      typesList={typesList}
                      collectorsList={collectorsList}
                      onOk={() => {
                        setRefreshFlag(_.uniqueId('refreshFlag_'));
                      }}
                    >
                      <a>{t('common:btn.edit')}</a>
                    </FormDrawer>
                  </Menu.Item>
                )}
                {actionAuth.delete && (
                  <Menu.Item>
                    <Button
                      danger
                      type='link'
                      style={{ padding: 0 }}
                      onClick={() => {
                        Modal.confirm({
                          title: t('common:confirm.delete'),
                          onOk() {
                            deleteMetrics([record.id]).then(() => {
                              message.success(t('common:success.delete'));
                              setRefreshFlag(_.uniqueId('refreshFlag_'));
                            });
                          },
                        });
                      }}
                    >
                      {t('common:btn.delete')}
                    </Button>
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button type='link' icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (!actionAuth.add && !actionAuth.edit && !actionAuth.delete) {
    columns = _.filter(columns, (column) => column.dataIndex !== 'operator');
  }

  const { run: queryChange } = useDebounceFn(
    (query) => {
      const newFilter = { ...filter, query };
      setFilter(newFilter);
      window.localStorage.setItem('metricsBuiltin-filter', JSON.stringify(newFilter));
    },
    {
      wait: 500,
    },
  );

  useEffect(() => {
    getDashboardCates().then((res) => {
      setTypsMeta(res);
    });
    getTypes().then((res) => {
      setTypesList(res);
    });
    getCollectors().then((res) => {
      setCollectorsList(res);
    });
    getMenuPerm().then((res) => {
      const { dat } = res;
      setActionAuth({
        add: _.includes(dat, '/builtin-metrics/add'),
        edit: _.includes(dat, '/builtin-metrics/put'),
        delete: _.includes(dat, '/builtin-metrics/del'),
      });
    });
  }, []);

  return (
    <PageLayout title={t('title')} icon={<SettingOutlined />}>
      <div className='built-in-metrics-container'>
        <Collapse collapseLocalStorageKey='built-in-metrics-filters-collapse' widthLocalStorageKey='built-in-metrics-filters-width' defaultWidth={240} tooltip={t('filter.title')}>
          <div className='n9e-border-base p2 built-in-metrics-filter'>
            <Filters ref={filtersRef} />
          </div>
        </Collapse>
        <div className='n9e-border-base p2 built-in-metrics-main'>
          <div
            className='mb8'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <RefreshIcon
                onClick={() => {
                  fetchData({ current: tableProps.pagination.current, pageSize: pagination.pageSize });
                }}
              />
              <Select
                value={filter.typ}
                onChange={(val) => {
                  const newFilter = { ...filter, typ: val };
                  setFilter(newFilter);
                  window.localStorage.setItem('metricsBuiltin-filter', JSON.stringify(newFilter));
                }}
                options={_.map(typesList, (item) => {
                  return {
                    label: (
                      <Space>
                        <img src={_.find(typsMeta, (meta) => meta.name === item)?.icon_url || '/image/default.png'} alt={item} style={{ width: 16, height: 16 }} />
                        {item}
                      </Space>
                    ),
                    cleanLabel: item,
                    value: item,
                  };
                })}
                showSearch
                optionFilterProp='label'
                placeholder={t('typ')}
                style={{ width: 140 }}
                allowClear
                dropdownMatchSelectWidth={false}
                optionLabelProp='cleanLabel'
              />
              <Select
                value={filter.collector}
                onChange={(val) => {
                  const newFilter = { ...filter, collector: val };
                  setFilter(newFilter);
                  window.localStorage.setItem('metricsBuiltin-filter', JSON.stringify(newFilter));
                }}
                options={_.map(collectorsList, (item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
                showSearch
                optionFilterProp='label'
                placeholder={t('collector')}
                style={{ width: 140 }}
                allowClear
                dropdownMatchSelectWidth={false}
              />
              <Select
                value={filter.unit}
                onChange={(val) => {
                  const newFilter = { ...filter, unit: val };
                  setFilter(newFilter);
                  window.localStorage.setItem('metricsBuiltin-filter', JSON.stringify(newFilter));
                }}
                options={buildUnitOptions()}
                showSearch
                optionFilterProp='label'
                placeholder={t('unit')}
                style={{ width: 140 }}
                allowClear
                dropdownMatchSelectWidth={false}
                optionLabelProp='cleanLabel'
                mode='multiple'
                maxTagCount='responsive'
              />
              <Input
                placeholder={t('common:search_placeholder')}
                style={{ width: 200 }}
                value={queryValue}
                onChange={(e) => {
                  setQueryValue(e.target.value);
                  queryChange(e.target.value);
                }}
                prefix={<SearchOutlined />}
              />
            </Space>
            <Space>
              {actionAuth.add && (
                <FormDrawer
                  mode='add'
                  title={t('add_btn')}
                  typesList={typesList}
                  collectorsList={collectorsList}
                  onOk={() => {
                    setRefreshFlag(_.uniqueId('refreshFlag_'));
                  }}
                >
                  <Button type='primary'>{t('add_btn')}</Button>
                </FormDrawer>
              )}
              {(actionAuth.add || actionAuth.delete) && (
                <Dropdown
                  overlay={
                    <ul className='ant-dropdown-menu'>
                      {actionAuth.add && (
                        <li
                          className='ant-dropdown-menu-item'
                          onClick={() => {
                            Import({
                              onOk: () => {
                                setRefreshFlag(_.uniqueId('refreshFlag_'));
                              },
                            });
                          }}
                        >
                          <span>{t('batch.import.title')}</span>
                        </li>
                      )}
                      {actionAuth.add && (
                        <li
                          className='ant-dropdown-menu-item'
                          onClick={() => {
                            if (selectedRows.length) {
                              Export({
                                data: JSON.stringify(
                                  _.map(selectedRows, (item) => {
                                    return _.omit(item, ['id', 'created_at', 'created_by', 'updated_at', 'updated_by']);
                                  }),
                                  null,
                                  2,
                                ),
                              });
                            } else {
                              message.warning(t('batch.not_select'));
                            }
                          }}
                        >
                          <span>{t('batch.export.title')}</span>
                        </li>
                      )}
                      {actionAuth.delete && (
                        <li
                          className='ant-dropdown-menu-item'
                          onClick={() => {
                            if (selectedRows.length) {
                              Modal.confirm({
                                title: t('common:confirm.delete'),
                                onOk() {
                                  deleteMetrics(_.map(selectedRows, (item) => item.id)).then(() => {
                                    message.success(t('common:success.delete'));
                                    setRefreshFlag(_.uniqueId('refreshFlag_'));
                                  });
                                },
                              });
                            } else {
                              message.warning(t('batch.not_select'));
                            }
                          }}
                        >
                          <span>{t('common:btn.batch_delete')}</span>
                        </li>
                      )}
                    </ul>
                  }
                  trigger={['click']}
                >
                  <Button onClick={(e) => e.stopPropagation()}>
                    {t('common:btn.more')}
                    <DownOutlined
                      style={{
                        marginLeft: 2,
                      }}
                    />
                  </Button>
                </Dropdown>
              )}
              <Button
                onClick={() => {
                  OrganizeColumns({
                    i18nNs: 'metricsBuiltin',
                    value: columnsConfigs,
                    onChange: (val) => {
                      setColumnsConfigs(val);
                      setDefaultColumnsConfigs(val, LOCAL_STORAGE_KEY);
                    },
                  });
                }}
                icon={<EyeOutlined />}
              />
            </Space>
          </div>
          <Table
            className='mt8'
            size='small'
            rowKey='id'
            {...tableProps}
            columns={ajustColumns(columns, columnsConfigs)}
            pagination={{
              ...pagination,
              ...tableProps.pagination,
            }}
            rowSelection={{
              selectedRowKeys: _.map(selectedRows, (item) => item.id),
              onChange: (_selectedRowKeys: React.Key[], selectedRows: Record[]) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </div>
      </div>
      <ExplorerDrawer
        visible={explorerDrawerVisible}
        onClose={() => {
          setExplorerDrawerVisible(false);
          setExplorerDrawerData(undefined);
        }}
        data={explorerDrawerData}
      />
    </PageLayout>
  );
}
