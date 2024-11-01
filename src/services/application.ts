import _ from 'lodash';
import semver from 'semver';
import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { N9E_PATHNAME } from '@/utils/constant';
import { start } from 'repl';
import { number } from 'echarts';
export const getAppHealth = function(){
    return request('/api/n9e/busi-groups?all=true&limit=5000', {
        method: RequestMethod.Get,
      }).then((res) => {
        return res.dat;
       
      });
}

export const getAppHealthTendcy = function (id?: string, start?:number,end?:number,step?:number) {
    return request(`/api/n9e/proxy/1/api/v1/query_range?query=application_health_${id}&start=${start}&end=${end}&step=${step}`, {
      method: RequestMethod.Get,
      
    }).then((res) => {
      //console.log("res.data.result:",res.data.result)
      if(res.data.result.length === 0){
        return [];
      }
      return res.data.result[0].values;
    });
};

export const getAlertCountMetric = function (start?:number,end?:number,step?:number) {
    return request(`/api/n9e/proxy/1/api/v1/query_range?query=system_cur_alert_total&start=${start}&end=${end}&step=${step}`, {
      method: RequestMethod.Get,
      
    }).then((res) => {
      if(res.data.result.length === 0){
        return [];
      }
      return res.data.result[0].values;
    });
};

export const getAppResponseTimeTendcy = function (names?:string,start?:number,end?:number,step?:number) {
  return request(`/api/n9e/proxy/1/api/v1/query_range?query=http_response_response_time{product="${names}"}&start=${start}&end=${end}&step=${step}`, {
    method: RequestMethod.Get,
    
  }).then((res) => {
    if(res.data.result.length === 0){
      return [];
    }
    return res.data.result[0].values;
  });
};

export const getAlertTable = function (id?: string) {
    return request(`/api/n9e/group/alert-cur-events/list?group_id=${id}`, {
      method: RequestMethod.Get,
      params: {
        id,
      },
    }).then((res) => {
      return res.dat.list;
    });
};

export const getHttpRequestTable = function (name?: string) {
  return request(`api/n9e/query-app-http?app_name=${name}`, {
    method: RequestMethod.Get,
    params: {
      name,
    },
  }).then((res) => {
    console.log(`=========res:${res.dat}`)
    return res.dat;
  });
};

export const getEvents = function() {
  return request('api/n9e/alert-cur-events/list', {
    method: RequestMethod.Get,
  }).then((res) => {
    //console.log(`enentData:${res.dat.list}`)
    return res.dat.list;
  });
}


// export const getQueryRange = function (
//     datasourceValue: number,
//     params: {
//       metric: string;
//       match: string;
//       range: IRawTimeRange;
//       step?: number;
//       calcFunc: string;
//       comparison: string[];
//       aggrFunc: string;
//       aggrGroups: string[];
//     },
//   ) {
//     const { metric, match, range, step, calcFunc, comparison, aggrFunc, aggrGroups } = params;
//     let { start, end } = timeRangeUnix(range);
//     let _step = step;
//     if (!step) _step = Math.max(Math.floor((end - start) / 240), 1);
//     const exprs = getExprs({
//       metric,
//       match,
//       calcFunc,
//       comparison,
//       aggrFunc,
//       aggrGroups,
//     });
//     const requests = _.map(exprs, (expr) => {
//       return request(`/api/${N9E_PATHNAME}/proxy/${datasourceValue}/api/v1/query_range`, {
//         method: RequestMethod.Get,
//         params: {
//           start: start - (start % _step!),
//           end: end - (end % _step!),
//           step: _step,
//           query: expr,
//         },
//       });
//     });
//     return Promise.all(requests).then((res: any) => {
//       const series: any[] = [];
//       _.forEach(['current', ...comparison], (item, idx) => {
//         const dat = res[idx]?.data ? res[idx]?.data : res[idx]; // 处理环比的情况返回结构不一致
//         const data = dat.result || [];
//         _.forEach(data, (subItem) => {
//           series.push({
//             metric: subItem.metric,
//             color: subItem.color,
//             offset: item,
//             name: `${getSerieName(subItem.metric)}${item !== 'current' ? ` offset ${item}` : ''}`,
//             id: _.uniqueId('series_'),
//             data: completeBreakpoints(_step, subItem.values),
//           });
//         });
//       });
//       return series;
//     });
//   };

  