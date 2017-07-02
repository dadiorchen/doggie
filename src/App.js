// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import {Line,Bar} from 'react-chartjs';
import {type FundData,FundModel} from './doggie_model/src/FundModel.js';



class App extends React.Component {
	//property --------------------------------------
	props: {
	};
	state: {
		chartData : any,
		chartData2 : any,
		allYearEarning : any,
		halfYearEarningAverage : any,
		halfYearEarningRate : any,
		fundNumber : any,
		period : any,
	};
	fund : any;
	period : any;
	funds = {
		'096001' : "大成标普500（096001）",
		'519300' : "大成沪深300（519300）",
		'050025' : '博时标普500ETF联接(050025)',
		'159934' : '易方达黄金ETF(159934)',
		'050002' : '博时沪深300指数A(050002)',
		'161017' : '富国中证500指数增强(LOF)(161017)',
		'162216' : '泰达宏利500指数分级(162216)',
	};
	periods = {
		'183' : '半年',
		'365' : '一年',
		'730' : '两年',
		'1095' : '三年',
	};
	
	//method ----------------------------------------
	constructor(props :any){
		super(props);
		const chartData2 = {
			labels:[],
			datasets: [{
				label: 'the half year earning 1',
				data : [],
				borderWidth: 1,
			}]
		};
		this.state = { 
			chartData:{},
			chartData2,
			allYearEarning : null,
			halfYearEarningAverage : null,
			halfYearEarningRate : null,
			fundNumber : '096001',
			period : 365,
		};
	}
	
	componentDidMount(){
		this.loadData();
	}

	loadData = () => {

		fetch(`http://localhost:9898/fundData/${this.state.fundNumber}`)
			.then(res => res.json())
			.then(data => {
				let model = new FundModel(); 
				console.debug('data:',data);
				if(data && data.length > 0){
					data = data.reverse().map(d => (
								{
									date :+(d.fbrq.replace(/-/g,'').replace(' 00:00:00','')),
									jjjz :+d.jjjz,
								} : FundData));
					let labelsAll = data.map(d => d.date);
					let labels = labelsAll;
					const chartData = {
						labels, //[data[data.length-1].fbrq,data[0].fbrq],
						datasets: [{
							label: 'the fund 1',
							data : data.map(d => d.jjjz),
							borderWidth: 1,
							fill : false,
						}]
					};
					console.debug('the chart data:',chartData);
					let allYearEarning = model.calculatePeriodEarning(data,data[0].date,8*this.state.period) * 100 + '%' ;
					console.debug(`all year earning:${allYearEarning},begin:${data[0].date}`);
					this.setState({allYearEarning});
					//half year earning calculate
					let earningList = [];//{date:xxxx,earning:0.01}
					{
						data.forEach(dayObj => {
							let earning = model.calculatePeriodEarning(data,dayObj.date,this.state.period);
							earningList.push({date:dayObj.date,earning});
						});
					}
					console.debug('the earning list:',earningList);
					const chartData2 = {
						labels:earningList.map(d => d.date), //[data[data.length-1].fbrq,data[0].fbrq],
						datasets: [{
							label: 'the half year earning 1',
							backgroundColor: '#ff6384',
							borderColor: '#ff6384',
							data : earningList.map(d => d.earning * 100),
							borderWidth: 1,
							fill : false,
						}]
					};
					{
						let total = 0;
						let counter = 0;
						let positiveCounter = 0;
						earningList.forEach(e => {
							total += e.earning ; 
							counter++;
							if(e.earning >= 0){
								positiveCounter++;
							}
						});
						let halfYearEarningAverage = total / counter * 100 + '%';
						let halfYearEarningRate = positiveCounter / counter *  100 + '%';
						console.debug(`total:${total},counter:${counter},average:${halfYearEarningAverage},positive counter:${positiveCounter},rate:${halfYearEarningRate}`);
						this.setState({halfYearEarningAverage,halfYearEarningRate});
					}
					this.setState({chartData,chartData2});
					this.forceUpdate();
					
				}
			});
	}

	changeFund = () => {
		console.info('the fund selected : ',this.fund.value);
		this.setState({fundNumber : this.fund.value},()=>{
			this.loadData();
		});
	}
	changePeriod = () => {
		console.info('the period selected : ',this.period.value);
		this.setState({period : this.period.value},()=>{
			this.loadData();
		});
	}

    render() {
		const options = {
			title : {
				display : true,
				text : 'Fund Line',
			},
		}
		const os = [];
		for(let k in this.funds){
			os.push({value:k,name:this.funds[k]});
		}
		const osPeriod = [];
		for(let k in this.periods ) {
			osPeriod.push({value:k,name : this.periods[k]});
		}
		return (
			<div>
				<select ref={r => this.fund = r} onChange={this.changeFund} value={this.state.fundNumber}  >
					{os.map( o => <option value={o.value}  >{o.name}</option>)}
				</select>
				<select ref={r => this.period = r} onChange={this.changePeriod} value={this.state.period}  >
					{osPeriod.map( o => <option value={o.value}  >{o.name}</option>)}
				</select>
				<p>{this.funds[this.state.fundNumber]}净值趋势</p>
				<Line data={this.state.chartData} options={options} redraw width='2048' height='500' />
				<p>总收益率:{this.state.allYearEarning}</p>
				<p>{this.funds[this.state.fundNumber]}净值半年投资收益</p>
				<Bar data={this.state.chartData2} options={options} redraw width='8000' height='500' />
				<p>平均收益率:{this.state.halfYearEarningAverage}</p>
				<p>盈利概率：{this.state.halfYearEarningRate}</p>
			</div>
			   )    }
}

export default App;
