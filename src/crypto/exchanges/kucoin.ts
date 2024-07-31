import { injectable } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { IExchangeService } from "./exchange.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

@injectable()
export class KucoinService implements IExchangeService {
	constructor() {}

	async getExchangeEstimatedMarketValue(
		{ inputAmount, inputCurrency, outputCurrency }: EstimateFieldsDto,
		reverse: boolean
	): Promise<EstimateOutputDto | string> {
		try {
			const kucoinSymbol = `${inputCurrency}-${outputCurrency}`;
			const kucoinResponse = await axios.get(
				process.env.KUCOIN_BASE_URL + "/api/v1/market/histories",
				{
					params: { symbol: kucoinSymbol },
				}
			);

			const kucoinTradesData = kucoinResponse.data;

			if (kucoinTradesData.length === 0) {
				return "No price data found for the given currency pair";
			}
			const kucoinLastTradePrice = parseFloat(
				kucoinTradesData.data[0].price
			);
			if (reverse) {
				const kucoinOutputAmount = inputAmount / kucoinLastTradePrice;
				console.log({
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				});
				return {
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				};
			} else {
				const kucoinOutputAmount = inputAmount * kucoinLastTradePrice;
				console.log({
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				});
				return {
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				};
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Axios error:", error.message);
				return error.message;
			} else {
				console.error("Unexpected error:", error);
				return "Unexpected error";
			}
		}
	}

	async getExchangePriceForCurrency({
		baseCurrency,
		quoteCurrency,
	}: RatesFieldsDto): Promise<RatesOutputDto[] | string> {
		return "123";
	}
}
