import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { ConfigProviderProps } from 'antd/es/config-provider';
import useAntdMediaQuery from './use-media-antd-query';
import { Button, Input, Form, Row, Col, Select, ConfigProvider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useDeepCompareEffect from '@/components/dantd/hooks/use-deep-compare-effect';
import { intlZhMap } from '@/components/dantd/components/utils';

declare const ItemSizes: ['large', 'default', 'small', string];
export declare type ItemSize = typeof ItemSizes[number];

declare const ColumnTypes: ['select', 'input', 'custom', string];
export declare type ColumnType = typeof ColumnTypes[number];

declare const ModeTypes: ['full', 'align', string];
export declare type ModeType = typeof ModeTypes[number];

declare const ColTypes: ['grid', 'style', string];
export declare type ColType = typeof ColTypes[number];

const FormItem = Form.Item;
const { Option } = Select;

export interface IColumnsType {
  type: ColumnType;
  dataIndex?: string | Array<string>;
  title: string | React.ReactNode;
  placeholder?: string;
  valuePropName?: string;
  required?: boolean;
  colStyle?: React.CSSProperties;
  initialValue?: any;
  isInputPressEnterCallSearch?: boolean;
  size?: ItemSize;
  rules?: any[]; // 校验规则
  component?: React.ReactNode;
  componentProps?: any; // 需要传给组件的其他属性
  selectMode?: string; // 单选或者多选
  options?: {
    title: string;
    value: string | number;
  }[];
  formItemLayout?: any;
}

export interface IQueryFormProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  mode?: ModeType;
  colMode?: ColType;
  defaultColStyle?: React.CSSProperties;
  columnStyleHideNumber?: number;
  columns: IColumnsType[];
  searchText?: string | React.ReactNode;
  resetText?: string | React.ReactNode;
  showOptionBtns?: boolean;
  showCollapseButton?: boolean;
  onChange?: (data: any, form: any) => any;
  onSearch?: (data: any, form: any) => any;
  onReset?: (data: any, form: any) => any;
  getFormInstance?: (form: any) => any;
  isResetClearAll: boolean;
  antConfig?: {} & ConfigProviderProps;
  defaultCollapse?: boolean;
  colConfig?:
    | {
        lg: number;
        md: number;
        xxl: number;
        xl: number;
        sm: number;
        xs: number;
      }
    | undefined;
}

const defaultColConfig = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 5 },
    md: { span: 7 },
    lg: { span: 7 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 19 },
    sm: { span: 19 },
    md: { span: 17 },
    lg: { span: 17 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

/**
 * 合并用户和默认的配置
 * @param span
 * @param size
 */
const getSpanConfig = (
  span: number | typeof defaultColConfig,
  size: keyof typeof defaultColConfig,
): number => {
  if (typeof span === 'number') {
    return span;
  }
  const config = {
    ...defaultColConfig,
    ...span,
  };
  return config[size];
};

/**
 * 获取最后一行的 offset，保证在最后一列
 * @param length
 * @param span
 */
const getOffset = (length: number, span: number = 8) => {
  const cols = 24 / span;
  return (cols - 1 - (length % cols)) * span;
};

const getCollapseHideNum = (size: number) => {
  const maps = {
    6: 3,
    8: 2,
    12: 1,
    24: 1,
  };

  return maps[size] || 1;
};

const QueryForm = (props: IQueryFormProps) => {
  const prefixCls = `${props.prefixCls || 'dantd'}-query-form`;
  const t = intlZhMap;
  // const renderTimes = useRef(0);
  const {
    className,
    style,
    colConfig,
    searchText,
    resetText,
    showOptionBtns = true,
    showCollapseButton = true,
    defaultCollapse = false,
    isResetClearAll = false,
    onChange,
    onSearch,
    onReset,
    getFormInstance,
    columns = [] as IColumnsType[],
    mode = 'full',
    colMode = 'grid',
    columnStyleHideNumber = 1,
    defaultColStyle = {
      width: '300px',
    },
    // valueType = 'object',
  } = props;

  const wrapperClassName = classNames(prefixCls, className);
  const formItemCls = classNames({
    [`${prefixCls}-formitem`]: true,
    [`${prefixCls}-formitem-full`]: mode === 'full',
  });
  const windowSize = useAntdMediaQuery();
  const itemColConfig = colConfig || defaultColConfig;
  const [colSize, setColSize] = useState(
    getSpanConfig(itemColConfig || 8, windowSize),
  );
  const [form] = Form.useForm();
  const { validateFields, getFieldsValue, resetFields, setFieldsValue } = form;
  const [collapsed, setCollapse] = useState(defaultCollapse);
  const fieldsValue = getFieldsValue();

  useEffect(() => {
    setColSize(getSpanConfig(itemColConfig || 8, windowSize));
  }, [windowSize]);

  useEffect(() => {
    if (getFormInstance) {
      getFormInstance(form);
    }
  }, []);

  useDeepCompareEffect(() => {
    if (onChange && Object.keys(fieldsValue).length > 0) {
      onChange(fieldsValue, form);
    }
  }, [fieldsValue]);

  const collapseHideNum = getCollapseHideNum(
    getSpanConfig(itemColConfig || 8, windowSize),
  );

  const handleSearch = () => {
    validateFields().then((res) => {
      if (onSearch) {
        onSearch(res, form);
      }
    });
  };

  const handleReset = () => {
    if (isResetClearAll) {
      const resetFieldsObj = columns.reduce((acc, cur: IColumnsType) => {
        return cur.dataIndex
          ? {
              ...acc,
              [Array.isArray(cur.dataIndex)
                ? cur.dataIndex.join('.')
                : cur.dataIndex]: undefined,
            }
          : { ...acc };
      }, {});
      setFieldsValue(resetFieldsObj);
    } else {
      resetFields();
    }

    setTimeout(() => {
      if (onReset) {
        onReset(getFieldsValue(), form);
      }
    });
  };

  const handlePressEnter = () => {
    handleSearch();
  };

  const renderInputItem = (colItem) => {
    const {
      initialValue,
      dataIndex,
      title,
      required,
      componentProps = {},
      placeholder,
      isInputPressEnterCallSearch,
      formItemLayout,
      rules,
      size = 'default',
    } = colItem;

    const itemPlaceholder = placeholder
      ? placeholder
      : t('form.placeholder.prefix');

    let itemRules: any[] = [];
    if (required) {
      itemRules = [
        {
          required: true,
          message: itemPlaceholder,
        },
      ];
    }

    const itemFormItemLayout =
      formItemLayout || mode === 'align' ? defaultFormItemLayout : {};

    return (
      <FormItem
        name={dataIndex}
        label={title}
        className={formItemCls}
        {...itemFormItemLayout}
        initialValue={initialValue}
        rules={rules || itemRules}
      >
        <Input
          data-testid='field-input'
          size={size}
          maxLength={255}
          placeholder={itemPlaceholder}
          onPressEnter={
            isInputPressEnterCallSearch ? handlePressEnter : () => {}
          }
          {...componentProps}
        />
      </FormItem>
    );
  };

  const renderSelectItem = (colItem) => {
    const {
      initialValue,
      dataIndex,
      title,
      required,
      placeholder,
      selectMode = 'single',
      rules,
      formItemLayout,
      options = [],
      componentProps = {},
      size = 'default',
    } = colItem;
    const itemPlaceholder = placeholder ? (
      placeholder
    ) : (
      <>
        {t('form.selectplaceholder.prefix')}
        &nbsp;
        {title}
      </>
    );

    let itemRules: any[] = [];
    if (required) {
      itemRules = [
        {
          required: true,
          message: itemPlaceholder,
        },
      ];
    }

    const itemFormItemLayout =
      formItemLayout || mode === 'align' ? defaultFormItemLayout : {};

    return (
      <FormItem
        name={dataIndex}
        label={title}
        className={formItemCls}
        {...itemFormItemLayout}
        initialValue={initialValue}
        rules={rules || itemRules}
      >
        <Select
          data-testid='select'
          mode={selectMode}
          size={size}
          allowClear
          placeholder={itemPlaceholder}
          showSearch={true}
          optionFilterProp='children'
          style={{ width: '100%' }}
          {...componentProps}
        >
          {options.map((option) => {
            return (
              <Option
                key={`query-form-select-option-${option.value}`}
                data-testid='select-option'
                value={option.value}
              >
                {option.title}
              </Option>
            );
          })}
        </Select>
      </FormItem>
    );
  };

  const renderCustomItem = (colItem) => {
    const {
      initialValue,
      formItemLayout,
      dataIndex,
      title,
      required,
      placeholder,
      rules,
      valuePropName = 'value',
      component,
    } = colItem;

    const itemPlaceholder = placeholder ? (
      placeholder
    ) : (
      <>
        {t('form.placeholder.prefix')}
        &nbsp;
        {title}
      </>
    );

    let itemRules: any[] = [];
    if (required) {
      itemRules = [
        {
          required: true,
          message: itemPlaceholder,
        },
      ];
    }

    const itemFormItemLayout =
      formItemLayout || mode === 'align' ? defaultFormItemLayout : {};

    return (
      <FormItem
        name={dataIndex}
        label={title}
        className={formItemCls}
        {...itemFormItemLayout}
        initialValue={initialValue}
        rules={rules || itemRules}
        valuePropName={valuePropName}
      >
        {component}
      </FormItem>
    );
  };

  const renderOptionBtns = () => {
    const offsetVal = collapsed
      ? columns.length <= collapseHideNum
        ? getOffset(columns.length, colSize)
        : getOffset(collapseHideNum, colSize)
      : getOffset(columns.length, colSize);
    let optionStyle = {};
    if (colMode === 'style') {
      optionStyle = {
        position: 'absolute',
        width: 280,
        bottom: 0,
        right: 0,
        marginLeft: 0,
      };
    }
    return (
      <Col
        {...itemColConfig}
        offset={offsetVal}
        key='option'
        className={`${prefixCls}-option`}
        style={{
          ...optionStyle,
        }}
      >
        <Form.Item>
          <span>
            <Button onClick={handleReset}>
              {resetText || t('queryform.reset')}
            </Button>
            <Button
              onClick={handleSearch}
              style={{ marginLeft: 10 }}
              type='primary'
              htmlType='submit'
            >
              {searchText || t('queryform.search')}
            </Button>
            {showCollapseButton && (
              <a
                style={{
                  marginLeft: 10,
                  display: 'inline-block',
                }}
                onClick={() => {
                  setCollapse(!collapsed);
                }}
              >
                {collapsed ? t('queryform.expand') : t('queryform.collapsed')}
                {/* <Icon
                  type='down'
                  style={{
                    marginLeft: '0.5em',
                    transition: '0.3s all',
                    transform: `rotate(${collapsed ? 0 : 0.5}turn)`
                  }}
                /> */}
                <DownOutlined />
              </a>
            )}
          </span>
        </Form.Item>
      </Col>
    );
  };

  return (
    <ConfigProvider {...props.antConfig}>
      <div className={wrapperClassName} style={style}>
        <Form form={form} layout='inline'>
          <Row gutter={[12, 12]}>
            {columns.map((colItem, colIndex) => {
              let itemHide = collapsed && collapseHideNum <= colIndex;
              let colItemStyle = {};
              if (colMode === 'style') {
                colItemStyle = colItem.colStyle || defaultColStyle;
                if (collapsed && colIndex >= columnStyleHideNumber) {
                  itemHide = true;
                }
              }
              colItemStyle = {
                ...colItemStyle,
                display: itemHide ? 'none' : 'block',
              };
              return (
                <Col
                  style={colItemStyle}
                  key={`query-form-col-${colItem.dataIndex}-${colIndex}`}
                  {...itemColConfig}
                >
                  {colItem.type === 'input' && renderInputItem(colItem)}
                  {colItem.type === 'select' && renderSelectItem(colItem)}
                  {colItem.type === 'custom' && renderCustomItem(colItem)}
                </Col>
              );
            })}
            {showOptionBtns && renderOptionBtns()}
          </Row>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default QueryForm;
