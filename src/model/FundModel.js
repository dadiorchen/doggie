/*
 * the fund model : deal with the fund data, fetch data from sina, generate the data for render a chart
 */
import fetch from 'isomorphic-fetch';


export class FundModel {
	constructor(){
	}

	/*
	 * to fetch data from website , and return a promise
	 */
	fetchFundData(fundNumber,limit = 10){
		if(!fundNumber) throw new Error('need fundNumber:',fundNumber);
		console.debug('fetch fund:',fundNumber);
		return this.getTotalNum(fundNumber).then(totalNum => {
			if(totalNum > limit){
				console.debug(`totalNum too big ${totalNum}, limit to ${limit}`);
				totalNum = limit;
			}
			console.debug(`ready to fetch , totalNum:${totalNum},limit:${limit});
			let pages = [...Array(totalNum).keys()].map(v => v+1);
			console.debug('to load pages:',pages);
			let result = {
				totalNum:0,
				dataList:[]
			};
			return pages.reduce(
				(finishedRequests,pageNum) => finishedRequests
						.then(r => {
							//console.debug('the result:',r);
							return this.fetchOnePageFundData(fundNumber,pageNum)
								.then(r1 => 
										({
											totalNum:r1.totalNum,
											dataList:r.dataList.concat(r1.dataList),
										}));
						})
				,Promise.resolve(result));
		});
	}


	getTotalNum(fundNumber){
		return new Promise((resolve,reject) => {
			let url = `http://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=${fundNumber}&datefrom=&dateto=&page=1`;
			console.debug('to fetch url:',url);
			fetch(
				url,
				{
					method : 'GET',
				}
			).then(function(res){
				console.debug('http response ok:',res.ok); 
				return res.json();
			}).then(json => {
				//deal the result
				let totalNum = json.result.data.total_num;
				console.debug(`fetched data, totalNum:${totalNum}`),
				resolve(totalNum);
			}).catch(function(res){
				console.warn('fetch fund data error',res);
			});
		});
	}

	fetchOnePageFundData(fundNumber,pageNum){
		return new Promise((resolve,reject) => {
			let url = `http://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?symbol=${fundNumber}&datefrom=&dateto=&page=${pageNum}`;
			console.debug('to fetch url:',url);
			fetch(
				url,
				{
					method : 'GET',
				}
			).then(function(res){
				console.debug('http response ok:',res.ok); 
				return res.json();
			}).then(json => {
				//deal the result
				let totalNum = json.result.data.total_num;
				let dataList = json.result.data.data;
				console.debug(`fetched data, totalNum:${totalNum},datalist:${dataList && dataList.length}`);
				resolve({
					totalNum,
					dataList});
			}).catch(function(res){
				console.warn('fetch fund data error',res);
			});
		});
	}
}
