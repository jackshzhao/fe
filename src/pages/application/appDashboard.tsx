import React ,{useState, useEffect}from 'react'
import { Card, Row, Col, Statistic, Button,Progress, Space, Tooltip } from 'antd';
import { Layout,Table } from 'antd';
import {Link} from 'react-router-dom';
import BarChart from './BarChart';
import RoseChart from './RoseChart';
import PageLayout from '@/components/pageLayout';
import SortAppBarChart from './SortAppBarChart';
import DashboardChart from './DashboardChart'
import AlertLineChart from './AlertLineChart'
import RollInformation from './RollInformation'
import Grid from './Grid';
import 'antd/dist/antd.css'; 
import './appDashboard.less'
import { transform } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {getAppHealth,getAppHealthList} from '@/services/application'
import {formatTimesHour,formatTimeDay,getTimesRange, getTopUsability} from './utils'
import { InfoCircleOutlined } from '@ant-design/icons';
import { text } from 'd3';

const { Sider, Content, Footer } = Layout;
const appDashboard: React.FC = () => {

  const [currentPage, setCurrentPage] = useState(0);
  const chartsPerPage = 9;
  const [appList, setAppList] = useState<any[]>([]);
  const [appListTotal, setAppListTotal] = useState(0);
  const [appHealthData,setappHealthData] = useState([]);
  const [importantApp, setImportantApp] = useState([])
  const [topUsabilityApp, setTopUsabilityApp] = useState([])
  const [timesrange_30d, setTimerange_30d] = useState<{ start: number, end: number }>({ start: 0, end: 0 });
  const [linkId,setLinkId] = useState(1);
  const [appStatisticData,setappStatisticData]=useState<[string, number][]>([
    ['健康', 0],
    ['亚健康', 0],
    ['异常', 0],
  ]);
  //院级核心应用数据
  const importantAppTest = [{name:'1',health_level:70},{name:'2',health_level:80},{name:'3',health_level:90},
    {name:'4',health_level:90},{name:'5',health_level:90},{name:'6',health_level:90},
    {name:'4',health_level:90},{name:'5',health_level:90},{name:'6',health_level:90},
  ]

  //院级应用健康列表数据
  useEffect(() => {
    //获取24小时的时间范围
    const { start, end } = getTimesRange(30,0,0);
    setTimerange_30d({ start, end });
    let healthCount = 0;
    let subHealthCount = 0;
    let abnormalCount = 0;
    //所有应用、核心应用、可用性、应用告警统计
    getAppHealth().then((res) => {
      let IApp = [] as any
      //console.log("setAppList:",res)
      setAppList(res);
      setAppListTotal(res.length)
      //setLinkId(res.id) 
      for(var i = 0; i < res.length; i++){
        if(res[i].health_level >= 90){
          healthCount++;
        }else if(res[i].health_level >= 70 ){
          subHealthCount++;
        }else{
          abnormalCount++;
        }
        if(res[i].grade == 2){
          IApp.push(res[i])
        }
      }
      setappStatisticData([
        ['健康', healthCount],
        ['亚健康', subHealthCount],
        ['异常', abnormalCount],
      ]); 
      setImportantApp(IApp)
      
      //排序并返回前十
      setTopUsabilityApp(getTopUsability(res))
    });

    //应用健康度统计
    getAppHealthList(start,end,10800).then((res) => {
      for(var i = 0; i < res.length; i++){
        res[i][0] = formatTimeDay(res[i][0])
      }
      //console.log("setappHealthData:",res)
      setappHealthData(res); 
    });
        
  }, []);

  
 

const columnList = [
  {
      title: '系统名称',
      dataIndex: 'name',
      width: '30%',
      key: 'name',
      // render: (text: string, record: application) => <Link to={`/system/${record.name}`}>{text}</Link>,
      render: (text, record) => {        
        return(          
          <Link to={`/application-details?ids=${record.id}&isLeaf=true&names=${record.name}`} >{text}</Link>
         
        )
      }
      
  },
  {
      title:  <div style={{ textAlign: 'right' }}>健康值</div>,
      dataIndex: 'health_level',
      key: 'health_level',
      render: (health_level: number,record) => (
        <Link to={`/application-details?ids=${record.id}&isLeaf=true&names=${record.name}`} >
          <Progress 
            percent={health_level} 
            status={getStatusColor(health_level)} 
            format={(percent) => `${health_level}`} // 自定义显示内容为健康值
          />
        </Link>
      ),
  },
];

// 根据健康值进度条返回对应的状态颜色
const getStatusColor = (health: number): 'success' | 'normal' | 'exception' => {
  if (health >= 90) {
      return 'success'; // 绿色
  } else if (health >= 70) {
      return 'normal'; // 黄色
  } else {
      return 'exception'; // 红色
  }
};


  
  
  //下一页
  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };
  //上一页
  const handleClickPrev = () => {
    setCurrentPage(currentPage - 1);
  };


  return (
  <PageLayout  title={"应用大屏"}>
    <div className="flex-col-container">
      <div className="flex-col-item" >
        <div style={{position: 'relative',  height: '50%',border: '1px solid #ccc',margin: '0px 10px 10px 0px',overflow:'auto',boxSizing:'border-box' }}>
          <h3 style={{textAlign: 'center'}}>院级常用应用</h3>
          <div style={{height:'100%',width:'100%',position: 'absolute',top: '5%', left: '5%'}}>
            <Grid charts={importantApp} /> 
          </div>            
          
        </div>
        <div style={{ height: '50%', border: '1px solid #ccc' ,margin: '0px 10px 0px 0px',}}>
          <h3 style={{textAlign: 'center'}}>应用告警信息</h3>
          <div style={{display:'flex',backgroundColor:'rgb(250,250,250)'}}>
            <div style={{flex: '1',textAlign:'left'}}>应用名称</div>
            <div style={{flex:'2',textAlign:'center'}}>告警信息</div>
            <div style={{flex:'1',textAlign:'right'}}>告警时间</div>
        </div>
            {/* <AlertLineChart data={appHealthData} ystep={5} ymax={50} Tname={'健康应用'}/> */}
            <RollInformation />
        </div>
      </div>
      <div className="flex-col-item">
      
      <div style={{ height: '101%', border: '1px solid #ccc',margin: '0px 10px 10px 0px' ,overflow: 'auto'}}>
        <h3 style={{textAlign: 'center'}}>院级应用列表</h3>    
          
          <Table
            rowKey={appList=>appList.id}
            dataSource={appList}
            columns={columnList}
            pagination={{total:appListTotal,
              defaultPageSize:15,
              showQuickJumper:true,
              pageSizeOptions:["15","100","1000","2000"], //制定每页显示条数的选项
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
        
          <h3 style={{textAlign: 'center'}}>应用可用性
            <Tooltip title={'服务等级协议(SLA)应用可用性 = 1 - (应用异常时间*0.6)/1月1日至今时间'}>
              <InfoCircleOutlined />
            </Tooltip>
          </h3>
          
                   
          <BarChart data={topUsabilityApp}/>  
        </div>
        <div style={{ position: 'relative', height: '50%', border: '1px solid #ccc',margin: '0px 10px 0px 0px'}}>
          
          <h3 style={{textAlign: 'center'}}>应用统计</h3>
          <RoseChart data={appStatisticData}/>
        </div>
      </div>
    </div>
    </PageLayout>
  )
}

export default appDashboard