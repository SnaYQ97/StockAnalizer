export type RawStockPrice = string[];

// Is used to pass date range of data to be analyzed and reded form file
export type DateRange = {
    startDate: string;
    endDate: string;
}


export interface PriceState {
    largestDailyLoss: {
        start: string;
        end: string;
        loss: number;
    };
    currentLossStrike: {
        start: string;
        end: string;
        loss: number;
        lossIndexStart: number;
        lossIndexEnd: number;
        lostDaysDurration: number;
        lossValue: number;
        startValue: number;
        endValue: number;
    };
    biggestLostPricePeriod: {
        start: string;
        end: string;
        loss: number;
        startValue: number;
        endValue: number;
        lossValue: number;
        lossIndexStart: number;
        lossIndexEnd: number;
        lostDaysDurration: number;
    };
    lostPricePeriodsCounter: number;
    currentSamePriceStrike: {
        start: string;
        end: string;
        indexStart: number;
        indexEnd: number;
        durration: number;
        price: number;
    };
    longestSamePriceStrike: {
        start: string;
        end: string;
        indexStart: number;
        indexEnd: number;
        durration: number;
        price: number;
    };
}