import React from 'react';
import _ from 'lodash';
import { IPanel } from '../../../types';
import getCalculatedValuesBySeries from '../../utils/getCalculatedValuesBySeries';
import './style.less';
import G2PieChart from '@/components/G2PieChart';

interface IProps {
  values: IPanel;
  series: any[];
}

export default function Pie(props: IProps) {
  const { values, series } = props;
  const { custom, options } = values;
  const { calc, legengPosition, max } = custom;
  const calculatedValues = getCalculatedValuesBySeries(
    series,
    calc,
    {
      util: options?.standardOptions?.util,
      decimals: options?.standardOptions?.decimals,
    },
    options?.valueMappings,
  );

  const sortedValues = calculatedValues.sort((a, b) => b.value - a.value);
  const data =
    max && sortedValues.length > max
      ? sortedValues
          .slice(0, max)
          .map((i) => ({ name: i.name, value: i.stat }))
          .concat({ name: '其他', value: sortedValues.slice(max).reduce((previousValue, currentValue) => currentValue.stat + previousValue, 0) })
      : sortedValues.map((i) => ({ name: i.name, value: i.stat }));
  return (
    <div className='renderer-pie-container'>
      <G2PieChart data={data} positon={legengPosition !== 'hidden' ? legengPosition : undefined} hidden={legengPosition === 'hidden'} />
    </div>
  );
}
