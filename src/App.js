import React, { Component } from 'react';
import logo from './logo.svg';
import {Line} from 'react-chartjs';



class App extends React.Component {
	constructor(props){
		super(props);
		const chartData = {
		};
		this.state = { chartData};
	}
	
	componentDidMount(){
		fetch('http://localhost:9898/fundData')
			.then(res => res.json())
			.then(data => {
				console.debug('data:',data);
				if(data && data.length > 0){
					data = data.reverse().map(d => (
								{
									fbrq :+(d.fbrq.replace(/-/g,'').replace(' 00:00:00','')),
									jjjz :+d.jjjz,
								}));
					let labelsAll = data.map(d => d.fbrq);
					let labels = labelsAll;
					//let labels = [labelsAll[0]];
					//for(let i = 1 ; i < 10;i++  ){
					//	let l = Math.round((i/10) * labelsAll.length);
					//	labels.push(labelsAll[l]);
					//	console.debug('labels:',labels);
					//}
					//labels.push(labelsAll[labelsAll.length -1]);

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
					this.setState({chartData});
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
		return <Line data={this.state.chartData} options={options} redraw width='600' height='280' />
    }
}

export default App;
