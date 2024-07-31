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
				"https://api.kucoin.com/api/v1/market/orderbook/level1",
				{
					params: { symbol: kucoinSymbol },
				}
			);

			const kucoinPriceData = kucoinResponse.data;

			if (!kucoinPriceData.data || !kucoinPriceData.data.price) {
				return "No price data found for the given currency pair";
			}

			const kucoinPrice = parseFloat(kucoinPriceData.data.price);
			if (reverse) {
				const kucoinOutputAmount = inputAmount / kucoinPrice;
				console.log({
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				});
				return {
					exchangeName: "kucoin",
					outputAmount: kucoinOutputAmount,
				};
			} else {
				const kucoinOutputAmount = inputAmount * kucoinPrice;
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
