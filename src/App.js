import React, { Component } from 'react';
import logo from './logo.svg';
import {Line} from 'react-chartjs';



class App extends React.Component {
    render() {
		const chartData = {
			labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				borderWidth: 1
			}]
		};
		return <Line data={chartData} width='600' height='280' />
    }
}

export default App;
