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
    return request(`/api/n9e/proxy/1/api/v1/query_range?query=application_health_${id}&start=1722225132&end=1722311532&step=360`, {
      method: RequestMethod.Get,
      params: {
        id,
      },
    }).then((res) => {
        console.log("res:",res.data.result[0].values)
      return res.data.result[0].values;
    });
  };
  