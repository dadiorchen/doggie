/*
 * test fund model
 */
import {FundModel} from './FundModel.js'

let DEBUG = true;
console.debug = (...args) => {
	if(DEBUG){
		console.log(...args);
	}
}

describe('fund model test',() => {

	it('test: fetch data',() => {
		let model = new FundModel();
		let fundNumber = '096001';
		//DEBUG = false;
		return model.fetchFundData(fundNumber).then((data) => {
			let {totalNum,dataList} = data;
			console.log(`the result of data:totalNum:${totalNum},dataList:${dataList.length}`);
			expect(+totalNum).toBeGreaterThan(0);
			expect(dataList && +dataList.length).toBeGreaterThan(0);
		});
	});


	it('test: format data , and save data to file',() => {
		
	});
});
