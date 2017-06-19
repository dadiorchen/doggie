import React, { Component } from 'react';
import logo from './logo.svg';
import {Line,Bar} from 'react-chartjs';
import {FundModel} from './doggie_model/src/FundModel.js';



class App extends React.Component {
	constructor(props){
		super(props);
		const chartData2 = {
			labels:[],
			datasets: [{
				label: 'the half year earning 1',
				data : [],
				borderWidth: 1,
			}]
		};
		this.state = { chartData:{},chartData2};
	}
	
	componentDidMount(){
		fetch('http://localhost:9898/fundData')
			.then(res => res.json())
			.then(data => {
				let model = new FundModel(); 
				console.debug('data:',data);
				if(data && data.length > 0){
					data = data.reverse().map(d => (
								{
									date :+(d.fbrq.replace(/-/g,'').replace(' 00:00:00','')),
									jjjz :+d.jjjz,
								}));
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
					let allYearEarning = model.calculatePeriodEarning(data,data[0].date,8*365) * 100 + '%' ;
					console.debug(`all year earning:${allYearEarning},begin:${data[0].date}`);
					this.setState({allYearEarning});
					//half year earning calculate
					let earningList = [];//{date:xxxx,earning:0.01}
					{
						data.forEach(dayObj => {
							let earning = model.calculatePeriodEarning(data,dayObj.date,182);
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


    render() {
		const options = {
			title : {
				display : true,
				text : 'Fund Line',
			},
		}
		return (
			<div>
				<p>大成500基金净值趋势</p>
				<Line data={this.state.chartData} options={options} redraw width='2048' height='500' />
				<p>总收益率:{this.state.allYearEarning}</p>
				<p>大成500基金净值半年投资收益</p>
				<Bar data={this.state.chartData2} options={options} redraw width='8000' height='500' />
				<p>平均收益率:{this.state.halfYearEarningAverage}</p>
				<p>盈利概率：{this.state.halfYearEarningRate}</p>
			</div>
			   )    }
}

export default App;
