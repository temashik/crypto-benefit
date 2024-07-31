export interface EstimateFieldsDto {
	inputAmount: number;
	inputCurrency: string;
	outputCurrency: string;
}

export interface EstimateOutputDto {
	exchangeName: string;
	outputAmount: number;
}
