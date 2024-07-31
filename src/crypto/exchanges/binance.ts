import { injectable } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { IExchangeService } from "./exchange.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

@injectable()
export class BinanceService implements IExchangeService {
	constructor() {}

	async getExchangeEstimatedMarketValue(
		{ inputAmount, inputCurrency, outputCurrency }: EstimateFieldsDto,
		reverse: boolean
	): Promise<EstimateOutputDto | string> {
		try {
			const binanceSymbol = `${inputCurrency}${outputCurrency}`;
			const binanceResponse = await axios.get(
				"https://api.binance.com/api/v3/ticker/price",
				{
					params: { symbol: binanceSymbol },
				}
			);

			const binancePriceData = binanceResponse.data;

			if (!binancePriceData.price) {
				return "No price data found for the given currency pair";
			}
			const binancePrice = parseFloat(binancePriceData.price);

			if (reverse) {
				const binanceOutputAmount = inputAmount / binancePrice;
				console.log({
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
				});
				return {
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
				};
			} else {
				const binanceOutputAmount = inputAmount * binancePrice;
				console.log({
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
				});
				return {
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
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
