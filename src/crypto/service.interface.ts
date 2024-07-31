import { EstimateFieldsDto, EstimateOutputDto } from "./dto/estimate.dto";
import { RatesFieldsDto, RatesOutputDto } from "./dto/rates.dto";

export interface ICryptoService {
	getBestEstimatedMarketValue: (
		dto: EstimateFieldsDto
	) => Promise<EstimateOutputDto | string>;
	getAllMarketPricesForCurrency: (
		dto: RatesFieldsDto
	) => Promise<RatesOutputDto[] | string>;
}

export interface IFindSymbolResult {
	reverse: boolean;
	firstCurrency: string;
	secondCurrency: string;
}
