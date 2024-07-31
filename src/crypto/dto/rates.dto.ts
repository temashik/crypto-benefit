export interface RatesFieldsDto {
	baseCurrency: string;
	quoteCurrency: string;
}

export interface RatesOutputDto {
	exchangeName: string;
	rate: number;
}
