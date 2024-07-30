import _ from 'lodash';
import semver from 'semver';
import request from '@/utils/request';
import { RequestMethod } from '@/store/common';
import { N9E_PATHNAME } from '@/utils/constant';
export const getAppHealth = function(){
    return request('/api/n9e/busi-groups?all=true&limit=5000', {
        method: RequestMethod.Get,
      }).then((res) => {
        return res.dat;
       
      });
}

export const getAlertTendcy = function (id?: string) {
    return request(`/api/n9e/proxy/1/api/v1/query_range?query=application_health_${id}&start=1722268800&end=1722355199&step=360`, {
      method: RequestMethod.Get,
      params: {
        id,
      },
    }).then((res) => {
      return res.data.result[0].values;
    });
};

export const getAppHealthList = function () {
    return request(`/api/n9e/proxy/1/api/v1/query_range?query=application_health_count&start=1719741979&end=1722333979&step=10800`, {
      method: RequestMethod.Get,
      
    }).then((res) => {
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

  