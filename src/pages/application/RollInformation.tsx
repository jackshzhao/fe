import React, { Component, createRef,useRef,useState } from 'react';
import { getEvents } from '@/services/application'; 
import {formatYearTimesHour,} from './utils';
import './RollInformation.less'

interface RollState {
  list: { target_ident: string , rule_name: string,trigger_time:string,id: string}[];
  count: number;
}

class Roll extends Component<{}, RollState> {
  private rollRef: React.RefObject<HTMLDivElement>;
  private timer: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      list: [],
      count: 0,
    };
    this.rollRef = createRef();
  }

  

  //页面挂载时开启定时器
  componentDidMount() {
    this.fetchData(); // 在组件挂载时获取数据
    this.begin();
  }

  componentWillUnmount() {
    this.stop();
  }

  fetchData = async () => {
    try {
      const data = await getEvents(); // 调用封装好的 getevent 函数获取数据
      for(var i = 0; i < data.length; i++){
        data[i].trigger_time = formatYearTimesHour(data[i].trigger_time)
      }
      this.setState({ list: data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //定时器
  begin = () => {
    this.timer = setInterval(() => {
      this.Roll();
    }, 50);
  };

  //关闭定时器
  stop = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  //每次向上偏移0.5px,使用state记录偏移次数
  Roll = () => {
    this.setState(
      (prevState) => ({ count: prevState.count + 1 }),
      () => {
        if (this.rollRef.current) {
          this.rollRef.current.style.top = -0.5 * this.state.count + 'px';
          // 当偏移量达到10px时，将数组中第一个数据剪切到数组的最后，再减去一行高度对应的偏移次数
          if (-0.5 * this.state.count <= -10) {
            let arr = [...this.state.list];
            arr.push(arr[0]);
            arr.splice(0, 1);
            this.setState({
              list: arr,
              count: this.state.count - 40,
            });
            this.rollRef.current.style.top = -0.5 * this.state.count + 'px';
          }
        }
      }
    );
  };

  render() {
    return (
      <div className="box" onMouseEnter={this.stop} onMouseLeave={this.begin}>        
        <div className="content" ref={this.rollRef} style={{ position: 'relative' }}>
          {this.state.list.map((item, index) => (
            <a href={`/alert-cur-events/${item.id}`}>
                <div key={index} className="row">
                    <div style={{flex: '1',textAlign:'center',marginLeft:'5px',wordBreak:'break-all',borderRight: '1px solid rgb(235,235,235)'}}>{item.target_ident}</div>
                    <div style={{flex:'2',textAlign:'center',wordBreak:'break-all',borderRight: '1px solid rgb(235,235,235)'}}>{item.rule_name}</div> 
                    {/* <div style={{flex:'1',textAlign:'center',}}>{item.trigger_time}</div>      */}
                </div>
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default Roll;
