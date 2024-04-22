const zh_CN = {
  title: '指标管理',
  name: '指标名称',
  collector: '采集器',
  typ: '类型',
  unit: '单位',
  unit_tip: '绘图时，根据指标单位自动格式化值',
  note: '描述',
  note_preview: '描述预览',
  expression: '表达式',
  add_btn: '新增指标',
  clone_title: '克隆指标',
  edit_title: '编辑指标',
  batch: {
    not_select: '请先选择指标',
    export: {
      title: '导出指标',
    },
    import: {
      title: '导入指标',
      name: '指标名称',
      result: '导入结果',
      errmsg: '错误信息',
    },
  },
  unitDesc: {
    none: '原始值, 不做单位转换',
    bitsSI: '原始数据单位是 bit, 使用 SI 标准换算, 比如 1K=1000',
    bytesSI: '原始数据单位是 byte, 使用 SI 标准换算, 比如 1K=1000',
    bitsIEC: '原始数据单位是 bit, 使用 IEC 标准换算, 比如 1K=1024',
    bytesIEC: '原始数据单位是 byte, 使用 IEC 标准换算, 比如 1K=1024',
    packetsSec: '每秒的数据包数量',
    bitsSecSI: '每秒的 bit 数量, 使用 SI 标准换算, 比如 1K=1000',
    bytesSecSI: '每秒的 byte 数量, 使用 SI 标准换算, 比如 1K=1000',
    bitsSecIEC: '每秒的 bit 数量, 使用 IEC 标准换算, 比如 1K=1024',
    bytesSecIEC: '每秒的 byte 数量, 使用 IEC 标准换算, 比如 1K=1024',
    dBm: '分贝-毫瓦',
    percent: '百分比(值范围0-100) 比如 34.5 渲染为 34.5%',
    percentUnit: '百分比(值范围0.0-1.0) 比如 0.235 渲染为 23.5%',
    seconds: '时间单位: 秒',
    milliseconds: '时间单位: 毫秒',
  },
};
export default zh_CN;
