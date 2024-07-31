import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

export interface IExchangeService {
	getExchangeEstimatedMarketValue: (
		dto: EstimateFieldsDto,
		reverse: boolean
	) => Promise<EstimateOutputDto | string>;
	getExchangePriceForCurrency: (
		dto: RatesFieldsDto
	) => Promise<RatesOutputDto[] | string>;
}
