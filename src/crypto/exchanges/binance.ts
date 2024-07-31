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
				process.env.BINANCE_BASE_URL + "/api/v3/trades",
				{
					params: { symbol: binanceSymbol, limit: 1 },
				}
			);

			const binanceTradesData = binanceResponse.data;

			if (binanceTradesData === 0) {
				return "No price data found for the given currency pair";
			}
			const binanceLastTradePrice = parseFloat(
				binanceTradesData[0].price
			);

			if (reverse) {
				const binanceOutputAmount = inputAmount / binanceLastTradePrice;
				console.log({
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
				});
				return {
					exchangeName: "binance",
					outputAmount: binanceOutputAmount,
				};
			} else {
				const binanceOutputAmount = inputAmount * binanceLastTradePrice;
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
