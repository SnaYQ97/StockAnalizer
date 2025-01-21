// use StockDataReader to read data

import StockDataReader from './StockDataReader/StockDataReader';
import { StockPriceAnalyzer } from './StockDataAnalizer/StockDataReader';
import { DateRange } from '../types';
import path from 'path';

const stockDataPath = path.join(__dirname, '../data/ceny_akcji.csv');

const searchingRange: DateRange = {
    startDate: '2024-01-01',
    endDate: '2024-02-20'
}

async function analyzeStockData() {
    console.time('Optimized solution: ')

    const rawStockPricesFromRange = await StockDataReader.readStockDataInRange(stockDataPath, searchingRange);

    const analyzer = new StockPriceAnalyzer(rawStockPricesFromRange);
    analyzer.analyze();
    const results = analyzer.getResults();
    
    console.log('Biggest daily lost: ', results.largestDailyLoss);
    console.log('Lost price periods: ', results.ammountOfPriceLostPeriods);
    console.log('Biggest lost price period: ', results.biggestLossPeriod);
    console.log('Longest same price strike: ', results.longestSamePriceStrike);
    console.timeEnd('Optimized solution: ')
}

analyzeStockData();