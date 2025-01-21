import { RawStockPrice, PriceState } from '../../types';

export class StockPriceAnalyzer {
    private stockPrices: RawStockPrice[];
    private state: PriceState;

    constructor(stockPrices: RawStockPrice[]) {
        this.stockPrices = stockPrices;
        this.state = this.initializeState();
    }

    private initializeState(): PriceState {
        return {
            largestDailyLoss: {
                start: '',
                end: '',
                loss: 0,
            },
            currentLossStrike: {
                start: '',
                end: '',
                loss: 0,
                lossIndexStart: 0,
                lossIndexEnd: 0,
                lostDaysDurration: 0,
                lossValue: 0,
                startValue: 0,
                endValue: 0
            },
            biggestLostPricePeriod: {
                start: '',
                end: '',
                loss: 0,
                startValue: 0,
                endValue: 0,
                lossValue: 0,
                lossIndexStart: 0,
                lossIndexEnd: 0,
                lostDaysDurration: 0,
            },
            lostPricePeriodsCounter: 0,
            currentSamePriceStrike: {
                start: '',
                end: '',
                indexStart: 0,
                indexEnd: 0,
                durration: 0,
                price: 0,
            },
            longestSamePriceStrike: {
                start: '',
                end: '',
                indexStart: 0,
                indexEnd: 0,
                durration: 0,
                price: 0,
            }
        };
    }

    private handleSamePriceStreak(currentPrice: RawStockPrice, i: number): void {
        if (!this.state.currentSamePriceStrike.start) {
            this.state.currentSamePriceStrike.start = currentPrice[1];
            this.state.currentSamePriceStrike.indexStart = i;
            this.state.currentSamePriceStrike.price = parseFloat(currentPrice[2]);
        }
    }

    private handlePriceLoss(currentPrice: RawStockPrice, nextPrice: RawStockPrice, loss: number, i: number): void {
        // Obsługa największego dziennego spadku
        if (loss > this.state.largestDailyLoss.loss) {
            this.state.largestDailyLoss = {
                loss: Number(loss.toFixed(2)),
                start: currentPrice[1],
                end: nextPrice[1]
            };
        }

        // Obsługa okresu spadkowego
        if (!this.state.currentLossStrike.start) {
            this.state.currentLossStrike = {
                start: currentPrice[1],
                startValue: parseFloat(currentPrice[2]),
                lossIndexStart: i,
                end: '',
                loss: 0,
                lossIndexEnd: 0,
                lostDaysDurration: 0,
                lossValue: 0,
                endValue: 0
            };
        }

        // Zakończenie okresu stałej ceny
        this.finalizeSamePriceStreak(currentPrice, i);
    }

    private finalizeSamePriceStreak(currentPrice: RawStockPrice, i: number): void {
        if (this.state.currentSamePriceStrike.start) {
            this.state.currentSamePriceStrike.end = currentPrice[1];
            this.state.currentSamePriceStrike.indexEnd = i;
            this.state.currentSamePriceStrike.durration = i - this.state.currentSamePriceStrike.indexStart;

            if (this.state.currentSamePriceStrike.durration > this.state.longestSamePriceStrike.durration) {
                this.state.longestSamePriceStrike = this.state.currentSamePriceStrike;
            }

            this.state.currentSamePriceStrike = {
                start: '',
                end: '',
                indexStart: 0,
                indexEnd: 0,
                durration: 0,
                price: 0,
            };
        }
    }

    private finalizeLossStreak(currentPrice: RawStockPrice, i: number): void {
        if (this.state.currentLossStrike.start) {
            this.state.currentLossStrike.end = currentPrice[1];
            this.state.currentLossStrike.endValue = parseFloat(currentPrice[2]);
            this.state.currentLossStrike.lossIndexEnd = i;
            this.state.currentLossStrike.lostDaysDurration = i - this.state.currentLossStrike.lossIndexStart;
            this.state.currentLossStrike.lossValue = Number(
                (this.state.currentLossStrike.startValue - this.state.currentLossStrike.endValue).toFixed(2)
            );
            
            this.state.lostPricePeriodsCounter++;
            
            if(this.state.currentLossStrike.lossValue > this.state.biggestLostPricePeriod.lossValue) {
                this.state.biggestLostPricePeriod = this.state.currentLossStrike
            }

            this.state.currentLossStrike = {
                start: '',
                end: '',
                loss: 0,
                lossIndexStart: 0,
                lossIndexEnd: 0,
                lossValue: 0,
                startValue: 0,
                endValue: 0,
                lostDaysDurration: 0
            };
        }
    }

    analyze(): void {
        for (let i = 0; i < this.stockPrices.length - 1; i++) {
            const currentPrice = this.stockPrices[i];
            const nextPrice = this.stockPrices[i + 1];
            const loss = parseFloat(currentPrice[2]) - parseFloat(nextPrice[2]);

            if (loss === 0) {
                this.handleSamePriceStreak(currentPrice, i);
            }
            
            if (loss > 0) {
                this.handlePriceLoss(currentPrice, nextPrice, loss, i);
            } 
            
            if (loss < 0) {
                this.finalizeLossStreak(currentPrice, i);
                this.finalizeSamePriceStreak(currentPrice, i);
            }
        }
    }

    getResults() {
        return {
            largestDailyLoss: this.state.largestDailyLoss,
            ammountOfPriceLostPeriods: this.state.lostPricePeriodsCounter,
            biggestLossPeriod: this.state.biggestLostPricePeriod,
            longestSamePriceStrike: this.state.longestSamePriceStrike
        };
    }
}