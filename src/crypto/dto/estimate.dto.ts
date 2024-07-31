export interface EstimateFieldsDto {
	inputAmount: number;
	inputCurrency: string;
	outputCurrency: string;
}

export interface EstimateOutputDto {
	exchangerName: string;
	outputAmount: number;
}
