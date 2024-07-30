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

