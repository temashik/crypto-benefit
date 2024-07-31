import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

export interface IExchangerService {
	getExchangerEstimatedMarketValue: (
		dto: EstimateFieldsDto,
		reverse: boolean
	) => Promise<EstimateOutputDto | string>;
	getExchangerPriceForCurrency: (
		dto: RatesFieldsDto,
		reverse: boolean
	) => Promise<RatesOutputDto | string>;
}
