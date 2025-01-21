import { RawStockPrice } from '../types';

export class StockAnalyzer {
    private stockPrices: RawStockPrice[];

    constructor(stockPrices: RawStockPrice[]) {
        this.stockPrices = stockPrices;
    }

    findLargestDailyLoss(): {
        start: string;
        end: string;
        loss: number;
    } {
        let largestLoss = {
            start: '',
            end: '',
            loss: 0
        };

        for (let i = 0; i < this.stockPrices.length - 1; i++) {
            const currentPrice = parseFloat(this.stockPrices[i][2]);
            const nextPrice = parseFloat(this.stockPrices[i + 1][2]);
            const loss = this.validatePrices(currentPrice, nextPrice);

            if (loss > largestLoss.loss) {
                largestLoss = {
                    start: this.stockPrices[i][1],
                    end: this.stockPrices[i + 1][1],
                    loss: Number(loss.toFixed(2))
                };
            }
        }

        return largestLoss;
    }

    findLongestStaticPricePeriod(): {
        start: string;
        end: string;
        duration: number;
        price: number;
    } {
        let currentPeriod = {
            start: '',
            end: '',
            duration: 1,
            price: 0
        };

        let longestPeriod = {
            start: this.stockPrices[0][1],
            end: this.stockPrices[0][1],
            duration: 1,
            price: parseFloat(this.stockPrices[0][2])
        };

        for (let i = 1; i < this.stockPrices.length; i++) {
            const currentPrice = parseFloat(this.stockPrices[i][2]);
            const prevPrice = parseFloat(this.stockPrices[i - 1][2]);

            if (currentPrice === prevPrice) {
                if (!currentPeriod.start) {
                    currentPeriod.start = this.stockPrices[i - 1][1];
                    currentPeriod.price = currentPrice;
                }
                currentPeriod.end = this.stockPrices[i][1];
                currentPeriod.duration++;

                if (currentPeriod.duration > longestPeriod.duration) {
                    longestPeriod = { ...currentPeriod };
                }
            } else {
                currentPeriod = {
                    start: '',
                    end: '',
                    duration: 1,
                    price: 0
                };
            }
        }

        return longestPeriod;
    }

    findLossPeriods(): {
        start: string;
        end: string;
        lossValue: number;
        startValue: number;
        endValue: number;
        duration: number;
    }[] {
        const lossPeriods = [];
        let currentPeriod: any = null;

        for (let i = 0; i < this.stockPrices.length - 1; i++) {
            const currentPrice = parseFloat(this.stockPrices[i][2]);
            const nextPrice = parseFloat(this.stockPrices[i + 1][2]);
            const priceDiff = this.validatePrices(currentPrice, nextPrice);

            if (priceDiff > 0) {
                if (!currentPeriod) {
                    currentPeriod = {
                        start: this.stockPrices[i][1],
                        startValue: currentPrice,
                        lossValue: 0,
                        duration: 0
                    };
                }
                currentPeriod.end = this.stockPrices[i + 1][1];
                currentPeriod.endValue = nextPrice;
                currentPeriod.lossValue = Number((currentPeriod.startValue - nextPrice).toFixed(2));
                currentPeriod.duration++;
            } else if (currentPeriod) {
                lossPeriods.push({ ...currentPeriod });
                currentPeriod = null;
            }
        }

        if (currentPeriod) {
            lossPeriods.push(currentPeriod);
        }

        return lossPeriods;
    }

    private validatePrices(current: string | number, next: string | number): number {
        return Number((parseFloat(current.toString()) - parseFloat(next.toString())).toFixed(2));
    }
} 