
console.log('init...');


var pages = [...Array(10).keys()].map(v => v+1);
pages.push('finish');

console.log('pages:',pages);

var executeTimes = 0;

var result = pages.reduce( (finishedRequests, pageNum ) => {
	return finishedRequests
		.then((times) => {
			console.log('request pageNum:',pageNum);
			console.log('request url:',`xxxx?page=${pageNum}`);
			times++;
			return Promise.resolve(times);
		});
},Promise.resolve(executeTimes));

result.then((times) => console.log('executeTimes:',times));
console.log('finished!',result);
