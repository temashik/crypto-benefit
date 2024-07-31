import { injectable } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { IExchangerService } from "./exchanger.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "../dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "../dto/rates.dto";

@injectable()
export class KucoinService implements IExchangerService {
	constructor() {}

	async getExchangerEstimatedMarketValue(
		{ inputAmount, inputCurrency, outputCurrency }: EstimateFieldsDto,
		reverse: boolean
	): Promise<EstimateOutputDto | string> {
		const kucoinLastTradePrice = await this.getCourse(
			inputCurrency,
			outputCurrency
		);
		if (typeof kucoinLastTradePrice === "string")
			return kucoinLastTradePrice;
		if (reverse) {
			const kucoinOutputAmount = inputAmount / kucoinLastTradePrice;
			console.log({
				exchangerName: "kucoin",
				outputAmount: kucoinOutputAmount,
			});
			return {
				exchangerName: "kucoin",
				outputAmount: kucoinOutputAmount,
			};
		} else {
			const kucoinOutputAmount = inputAmount * kucoinLastTradePrice;
			console.log({
				exchangerName: "kucoin",
				outputAmount: kucoinOutputAmount,
			});
			return {
				exchangerName: "kucoin",
				outputAmount: kucoinOutputAmount,
			};
		}
	}

	async getExchangerPriceForCurrency(
		{ baseCurrency, quoteCurrency }: RatesFieldsDto,
		reverse: boolean
	): Promise<RatesOutputDto | string> {
		const kucoinLastTradePrice = await this.getCourse(
			baseCurrency,
			quoteCurrency
		);
		if (typeof kucoinLastTradePrice === "string")
			return kucoinLastTradePrice;

		if (reverse) {
			const kucoinOutputAmount = 1 / kucoinLastTradePrice;
			return {
				exchangerName: "binance",
				rate: kucoinOutputAmount,
			};
		} else {
			const kucoinOutputAmount = kucoinLastTradePrice;
			return {
				exchangerName: "binance",
				rate: kucoinOutputAmount,
			};
		}
	}

	private async getCourse(
		inputCurrency: string,
		outputCurrency: string
	): Promise<number | string> {
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
			return parseFloat(kucoinTradesData.data[0].price);
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
