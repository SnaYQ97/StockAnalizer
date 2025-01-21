// use StockDataReader to read data

import  StockDataReader  from './StockDataReader/StockDataReader';
import { RawStockPrice} from '../types';
import path from 'path';

const stockDataPath = path.join(__dirname, '../data/ceny_akcji.csv');

// slideing window approach
const analizeStockPrices = (stockPrices: RawStockPrice[]): any => {
    const initalResultObject = {
        start: '',
        end: '',
        loss: 0,
    }

    let largestDailyLoss= initalResultObject;

    let currentLossStrike = {
        ...initalResultObject,
       lossIndexStart: 0,
       lossIndexEnd: 0,
       lostDaysDurration: 0,
       lossValue: 0,
       startValue: 0,
       endValue: 0
   }

    const lostPricePerionds: {
        start: string;
        end: string;
        loss: number;
        startValue: number;
        endValue: number;
        lossValue: number;
        lossIndexStart: number;
        lossIndexEnd: number;
        lostDaysDurration: number;
    }[] = [];

    let currentSamePriceStrike = {
        start: '',
        end: '',
        indexStart: 0,
        indexEnd: 0,
        durration: 0,
        price: 0,
    }

    let longestSamePriceStrike = {
        start: '',
        end: '',
        indexStart: 0,
        indexEnd: 0,
        durration: 0,
        price: 0,
    }
    
    for (let i = 0; i < stockPrices.length - 1; i++) {
        const currentPrice = stockPrices[i];
        const nextPrice = stockPrices[i + 1];
        let loss = parseFloat(currentPrice[2]) - parseFloat(nextPrice[2]);

        if (loss === 0) {
            if (!currentSamePriceStrike.start) {
                currentSamePriceStrike.start = currentPrice[1];
                currentSamePriceStrike.indexStart = i;
                currentSamePriceStrike.price = parseFloat(currentPrice[2]);
            }
            
        }
        if (loss > 0) {
            if (!currentLossStrike.start) {
                currentLossStrike.start = currentPrice[1];
                currentLossStrike.startValue = parseFloat(currentPrice[2]);
                currentLossStrike.lossIndexStart = i;
            }

            if (loss > largestDailyLoss.loss) {                                
                largestDailyLoss.loss = loss;
                largestDailyLoss.start = currentPrice[1];
                largestDailyLoss.end = nextPrice[1];
            }

             // end of the same price strike
             if (currentSamePriceStrike.start) {
                currentSamePriceStrike.end = currentPrice[1];
                currentSamePriceStrike.indexEnd = i;
                currentSamePriceStrike.durration = i - currentSamePriceStrike.indexStart;

                if (currentSamePriceStrike.durration > longestSamePriceStrike.durration) {
                    longestSamePriceStrike = currentSamePriceStrike;
                }
    
                currentSamePriceStrike = {
                    start: '',
                    end: '',
                    indexStart: 0,
                    indexEnd: 0,
                    durration: 0,
                    price: 0,
                }
            }

        } if ( loss < 0) {
            if (currentLossStrike.start) {
                currentLossStrike.end = currentPrice[1];
                currentLossStrike.endValue = parseFloat(currentPrice[2]);
                currentLossStrike.lossIndexEnd = i;
                currentLossStrike.lostDaysDurration = i - currentLossStrike.lossIndexStart;
                currentLossStrike.lossValue = Number((currentLossStrike.startValue - currentLossStrike.endValue).toFixed(2));
                lostPricePerionds.push(currentLossStrike);

                currentLossStrike = {
                    start: '',
                    end: '',
                    loss: 0,
                    lossIndexStart: 0,
                    lossIndexEnd: 0,
                    lossValue: 0,
                    startValue: 0,
                    endValue: 0,
                    lostDaysDurration: 0
                }
            }

            // end of the same price strike
            if (currentSamePriceStrike.start) {
                currentSamePriceStrike.end = currentPrice[1];
                currentSamePriceStrike.indexEnd = i;
                currentSamePriceStrike.durration = i - currentSamePriceStrike.indexStart;

                if (currentSamePriceStrike.durration > longestSamePriceStrike.durration) {
                    longestSamePriceStrike = currentSamePriceStrike;
                }
    
                currentSamePriceStrike = {
                    start: '',
                    end: '',
                    indexStart: 0,
                    indexEnd: 0,
                    durration: 0,
                    price: 0,
                }
            }
        }
        
        loss = 0;
    }

    console.log('Biggest daily lost: ', largestDailyLoss);
    console.log('Lost price periods: ', lostPricePerionds?.length ?? null, lostPricePerionds)
    console.log('Biggest lost price period: ', lostPricePerionds.sort((a, b) => b.lossValue - a.lossValue)[0])
    console.log('Longest same price strike: ', longestSamePriceStrike)
}

async function analyzeStockData() {
    console.time('Całkowity czas: ');
    const rawStockPrices = await StockDataReader.readStockData(stockDataPath);

    analizeStockPrices(rawStockPrices);
    console.timeEnd('Całkowity czas: ');
}

analyzeStockData();