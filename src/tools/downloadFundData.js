/*
 * donwload fund data from sina , and the the formated data to files
 * file format:
 * 	2017-07-01 0.122 0.2233
 * file name format: fund096001.txt
 * */
'use strict';
import {FundModel} from './model/FundModel.js'



//begin load data

let fundModel = new FundModel();
fundModel.fetchFundData('096001',10)
	.then(
		//loaded data , print it 
		
	);
