import { readFile } from 'node:fs';
import { RawStockPrice, DateRange } from '../../types';
import { parse } from 'csv-parse';

class StockDataReader {
    // Use async to make read file and not block the main thread
    static async readStockData(filePath: string): Promise<RawStockPrice[]> {
        return new Promise((resolve, reject) => {
            readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
                if (err) {
                    console.error('Błąd odczytu pliku:', err);
                    reject(err);
                    return;
                }

                parse(data, {
                    columns: false,
                    skip_empty_lines: true,
                }, (err: Error | undefined, records: RawStockPrice[]) => {
                    if (err) {
                        console.error('Błąd parsowania CSV:', err);
                        reject(err);
                        return;
                    }
                    resolve(records);
                }); 
            });
        });
    }

    static async readStockDataInRange(filePath: string, dateRange: DateRange): Promise<RawStockPrice[]> {
        return new Promise((resolve, reject) => {
            const { startDate, endDate } = dateRange;
            const startDateTime = new Date(startDate);
            const endDateTime = new Date(endDate);

            readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
                if (err) {
                    console.error('Błąd odczytu pliku:', err);
                    reject(err);
                    return;
                }

                parse(data, {
                    columns: false,
                    skip_empty_lines: true,
                    on_record: (record: RawStockPrice): RawStockPrice | null => {
                        const recordDate = new Date(record[1]);
                        if (recordDate >= startDateTime && recordDate <= endDateTime) {
                            return record;
                        }
                        return null;
                    }
                }, (err: Error | undefined, records: RawStockPrice[]) => {
                    if (err) {
                        console.error('Błąd parsowania CSV:', err);
                        reject(err);
                        return;
                    }
                    resolve(records);
                }); 
            });
        });
    }
}

export default StockDataReader;