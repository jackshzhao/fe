import _ from 'lodash';
import { IS_PLUS } from '@/utils/constant';

export const getDefaultColumnsConfigs = () => {
  const columns = _.concat(
    ['host_ip', 'tags', 'group_obj', 'update_at', 'mem_util', 'cpu_util', 'offset','weight','alert_num','health_level', 'cpu_num', 'os', 'arch', 'remote_addr','actions'],
    IS_PLUS ? ['agent_version'] : [],
    ['note'],
  );
  let defaultColumnsConfigs = _.map(columns, (item) => {
    return {
      name: item,
      visible: true,
    };
  });
  const localColumnsConfigs = localStorage.getItem('targets_columns_configs');
  if (localColumnsConfigs) {
    try {
      defaultColumnsConfigs = _.map(defaultColumnsConfigs, (item) => {
        const localItem = _.find(JSON.parse(localColumnsConfigs), (i) => i.name === item.name);
        if (localItem) {
          item.visible = localItem.visible;
        }
        return item;
      });
    } catch (e) {
      console.error(e);
    }
  }
  return defaultColumnsConfigs;
};

export const setDefaultColumnsConfigs = (columnsConfigs) => {
  localStorage.setItem('targets_columns_configs', JSON.stringify(columnsConfigs));
};



//时间转换
export const formatTimesHour = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // 将 Unix 时间戳（秒）转换为 JavaScript 时间戳（毫秒）
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimeDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // 将 Unix 时间戳（秒）转换为 JavaScript 时间戳（毫秒）
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return `${month}-${day}`;
};

// 计算时间戳，传参数为天数
export const getTimesRange = (days: number,hours: number,minutes: number): { start: number, end: number } => {
  // 获取当前时间的时间戳（单位：毫秒）
  const now = new Date();
  const start = now.getTime();

  // 计算 `days` 天前的时间戳
  const end = new Date(start - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000).getTime();
  //console.log(`start:${start}   end:${end}`)
  return { start, end };
};


