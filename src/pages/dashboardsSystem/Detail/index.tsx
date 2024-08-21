import React from 'react';
import _ from 'lodash';
import { useParams, useLocation } from 'react-router-dom';
import Detail from './Detail';

interface URLParam {
  id: string;
}

export default function index() {
  const { id} = useParams<URLParam>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const gids:string = queryParams.get('gids') || '0';
  const showHeader = queryParams.get('showHeader')
  const appTitle:string = queryParams.get('title') || ' '
  const isTarget = queryParams.get('isTarget') || 'false'
  let gobackPath = '/dashboards';
  if(showHeader === 'false'){
    if(isTarget == 'true'){
      gobackPath = '/targets'
    }else{
      gobackPath = `/application-details?ids=${gids}&isLeaf=true&names=${appTitle}`
    }
    
  }
  //console.log(`gobackPath=${gobackPath}`)
  // 切换仪表盘是，Detail 组件需要重新加载，不然会出现数据错乱的情况
  return <Detail key={id} gobackPath={gobackPath}/>;
}
