export interface RatesFieldsDto {
	baseCurrency: string;
	quoteCurrency: string;
}

export interface RatesOutputDto {
	exchangerName: string;
	rate: number;
}
