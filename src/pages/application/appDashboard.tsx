import React ,{useState, useEffect}from 'react'
import { Card, Row, Col, Statistic, Button,Progress } from 'antd';
import { Layout,Table } from 'antd';
import {Link} from 'react-router-dom';
import BarChart from './BarChart';
import RoseChart from './RoseChart';
import PageLayout from '@/components/pageLayout';
import SortAppBarChart from './SortAppBarChart';
import DashboardChart from './DashboardChart'
import AlertLineChart from './AlertLineChart'
import Grid from './Grid';
import 'antd/dist/antd.css'; 
import './appDashboard.less'
import { transform } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {fetchData} from './utils'
import {getAppHealth} from '@/services/application'

const { Sider, Content, Footer } = Layout;
const appDashboard: React.FC = () => {

  // interface application {
  //   key: string;
  //   name: string;
  //   health: number; // 健康值，范围为0到100
  // }

  interface application1 {
 
    name: string;
    health: number; // 健康值，范围为0到100
  }

  const [appList, setAppList] = useState<any[]>([]);
  const [appListTotal, setAppListTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //院级核心应用数据

  //院级应用健康列表数据
  useEffect(() => {
    getAppHealth().then((res) => {
      //console.log("res1:",res)
      setAppList(res);
      setAppListTotal(res.length)
      //console.log("data:",appList)
    });
        
  }, []);

  
 

const columnList = [
  {
      title: '系统名称',
      dataIndex: 'name',
      width: '30%',
      key: 'name',
      // render: (text: string, record: application) => <Link to={`/system/${record.name}`}>{text}</Link>,
      render: (text: string) => <Link to={`/application-details?ids=3&isLeaf=true`}>{text}</Link>
  },
  {
      title: '健康值',
      dataIndex: 'health_level',
      key: 'health_level',
      render: (health_level: number) => (
          <Progress 
            percent={health_level} 
            status={getStatusColor(health_level)} 
            format={(percent) => `${health_level}`} // 自定义显示内容为健康值
          />
      ),
  },
];

// 根据健康值进度条返回对应的状态颜色
const getStatusColor = (health: number): 'success' | 'warning' | 'exception' => {
  if (health >= 90) {
      return 'success'; // 绿色
  } else if (health >= 70) {
      return 'warning'; // 黄色
  } else {
      return 'exception'; // 红色
  }
};
//应用统计数据
const appStatisticData = {
  labels: ['健康', '亚健康', '异常' ],
  values: [820, 932, 901],//对应数量
};

//监控告警趋势数据
const tendencyData = {
  labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00','13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00','22:00','23:00'], //时间
  values: [820, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 904, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901, 932, 901],//对应告警数量
};  
  //应用可用性数据
  const appapplicationchartData = {
    labels: ['OA系统', 'ITIL系统', '软件工厂', '合同系统', '会议系统'],//应用系统名称
    values: [820, 932, 901, 934, 1290], //对应健康值
  };

  

  const [currentPage, setCurrentPage] = useState(0);
  const chartsPerPage = 9;

  //院级核心应用数据
  const charts : application1[] = [
    { name: '系统A', health: 80 },
    { name: '系统B', health: 58 },
    { name: '系统C', health: 90 },
    { name: '系统D', health: 92 },
    { name: '系统E', health: 86 },
    { name: '系统F', health: 75 },
    { name: '系统G', health: 88 },
    { name: '系统H', health: 89 },
    { name: '系统I', health: 79 },
    { name: '系统J', health: 90 },
    { name: '系统K', health: 90 },
    { name: '系统H', health: 89 },
    { name: '系统I', health: 79 },
    { name: '系统J', health: 90 },
    { name: '系统K', health: 90 },

  ]
  
  //下一页
  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };
  //上一页
  const handleClickPrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const startIndex = currentPage * chartsPerPage;
  const visibleCharts = charts.slice(startIndex, startIndex + chartsPerPage);

  return (
  <PageLayout  title={"应用大屏"}>
    <div className="flex-col-container">
      <div className="flex-col-item" >
        <div style={{position: 'relative',  height: '50%',border: '1px solid #ccc',margin: '0px 10px 10px 0px' }}>
          <h4 style={{textAlign: 'center'}}>院级核心应用</h4>
          <div style={{height:'95%',width:'100%',position: 'absolute',top: '5%', left: '5%',}}>
            <Grid charts={appList} /> 
          </div>            
          {/* <Button style={{ position: 'absolute', bottom: '6px', right: '10px' }} onClick={handleClickPrev} size='small' disabled={currentPage === 0}>上一页</Button> 
          <Button style={{ position: 'absolute', bottom: '6px', right: '75px' }} onClick={handleClickNext} size='small' disabled={startIndex + chartsPerPage >= charts.length}>下一页</Button>           */}
        </div>
        <div style={{ height: '50%', border: '1px solid #ccc' ,margin: '0px 10px 0px 0px',}}>
          <h4 style={{textAlign: 'center'}}>监控告警趋势</h4>
            <AlertLineChart data={tendencyData}/>
        </div>
      </div>
      <div className="flex-col-item">
      
      <div style={{ height: '101%', border: '1px solid #ccc',margin: '0px 10px 10px 0px' ,}}>
        <h4 style={{textAlign: 'center'}}>院级应用列表</h4>    
          
          <Table
            rowKey={appList=>appList.id}
            dataSource={appList}
            columns={columnList}
            pagination={{total:appListTotal,
              defaultPageSize:10,
              showQuickJumper:true,
              pageSizeOptions:["10","100","1000","2000"], //制定每页显示条数的选项
              showSizeChanger:true,//显示改变每页显示条数的下拉菜单
              locale:{items_per_page:' /页',jump_to:'跳至',page:'页'},
              showTotal: ((appListTotal) => {
                return `共 ${appListTotal} 条`;
              }),
        }} 
        />
          
          
        </div>
      </div>
      <div className="flex-col-item" >
        <div style={{ height: '50%', border: '1px solid #ccc',margin: '0px 10px 10px 0px' }}>
          <h4 style={{textAlign: 'center'}}>应用可用性</h4>          
          <BarChart data={appapplicationchartData}/>  
        </div>
        <div style={{ position: 'relative', height: '50%', border: '1px solid #ccc',margin: '0px 10px 0px 0px'}}>
          
          <h4 style={{textAlign: 'center'}}>应用统计</h4>
          <RoseChart data={appStatisticData}/>
        </div>
      </div>
    </div>
    </PageLayout>
  )
}

export default appDashboard
