import { injectable } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { IExchangerService } from "./exchanger.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

@injectable()
export class BinanceService implements IExchangerService {
	constructor() {}

	async getExchangerEstimatedMarketValue(
		{ inputAmount, inputCurrency, outputCurrency }: EstimateFieldsDto,
		reverse: boolean
	): Promise<EstimateOutputDto | string> {
		const binanceLastTradePrice = await this.getCourse(
			inputCurrency,
			outputCurrency
		);
		if (typeof binanceLastTradePrice === "string")
			return binanceLastTradePrice;
		if (reverse) {
			const binanceOutputAmount = inputAmount / binanceLastTradePrice;
			console.log({
				exchangerName: "binance",
				outputAmount: binanceOutputAmount,
			});
			return {
				exchangerName: "binance",
				outputAmount: binanceOutputAmount,
			};
		} else {
			const binanceOutputAmount = inputAmount * binanceLastTradePrice;
			console.log({
				exchangerName: "binance",
				outputAmount: binanceOutputAmount,
			});
			return {
				exchangerName: "binance",
				outputAmount: binanceOutputAmount,
			};
		}
	}

	async getExchangerPriceForCurrency(
		{ baseCurrency, quoteCurrency }: RatesFieldsDto,
		reverse: boolean
	): Promise<RatesOutputDto | string> {
		const binanceLastTradePrice = await this.getCourse(
			baseCurrency,
			quoteCurrency
		);
		if (typeof binanceLastTradePrice === "string")
			return binanceLastTradePrice;

		if (reverse) {
			const binanceOutputAmount = 1 / binanceLastTradePrice;
			return {
				exchangerName: "binance",
				rate: binanceOutputAmount,
			};
		} else {
			const binanceOutputAmount = binanceLastTradePrice;
			return {
				exchangerName: "binance",
				rate: binanceOutputAmount,
			};
		}
	}

	private async getCourse(
		inputCurrency: string,
		outputCurrency: string
	): Promise<number | string> {
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
			return parseFloat(binanceTradesData[0].price);
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
}
