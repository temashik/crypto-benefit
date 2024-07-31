import { inject, injectable, tagged } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { ICryptoService } from "./service.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "./dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "./dto/rates.dto";
import { TYPES } from "../types";
import { IExchangeService } from "./exchanges/exchange.interface";

@injectable()
export class CryptoService implements ICryptoService {
	constructor(
		@inject(TYPES.BinanceService)
		@tagged("exchange", TYPES.BinanceService)
		private binanceService: IExchangeService,
		@inject(TYPES.KucoinService)
		@tagged("exchange", TYPES.KucoinService)
		private kucoinService: IExchangeService
	) {}

	private getAllExchanges(): IExchangeService[] {
		const allExchanges = [this.binanceService, this.kucoinService];
		return allExchanges;
	}

	async getBestEstimatedMarketValue(dto: EstimateFieldsDto): Promise<any> {
		const binanceSymbol = `${dto.inputCurrency}${dto.outputCurrency}`;
		try {
			await axios.get(
				`https://api.binance.com/api/v3/exchangeInfo?symbol=${binanceSymbol}`
			);
			let result: EstimateOutputDto | undefined = undefined;
			const allExchanges = this.getAllExchanges();
			const exchangePromises = allExchanges.map(async (exchange) => {
				const exchangeResult =
					await exchange.getExchangeEstimatedMarketValue(dto, false);
				if (typeof exchangeResult !== "string") {
					if (
						result === undefined ||
						result.outputAmount < exchangeResult.outputAmount
					) {
						result = exchangeResult;
					}
				}
			});

			await Promise.all(exchangePromises);
			return result;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// console.error("Axios error:", error.message);
				if (
					error.response &&
					error.response.data.msg === "Invalid symbol."
				) {
					let result: EstimateOutputDto | undefined = undefined;
					const allExchanges = this.getAllExchanges();
					const exchangePromises = allExchanges.map(
						async (exchange) => {
							const exchangeResult =
								await exchange.getExchangeEstimatedMarketValue(
									{
										inputAmount: dto.inputAmount,
										inputCurrency: dto.outputCurrency,
										outputCurrency: dto.inputCurrency,
									},
									true
								);
							if (typeof exchangeResult !== "string") {
								if (
									result === undefined ||
									result.outputAmount <
										exchangeResult.outputAmount
								) {
									result = exchangeResult;
								}
							}
						}
					);

					await Promise.all(exchangePromises);
					return result;
				}
			} else {
				console.error("Unexpected error:", error);
				return "Unexpected error";
			}
		}
	}

	async getAllSymbols({
		inputAmount,
		inputCurrency,
		outputCurrency,
	}: EstimateFieldsDto) {
		const binanceSymbol = `${inputCurrency}${outputCurrency}`;
		const binanceResponse = await axios.get(
			"https://api.binance.com/api/v3/exchangeInfo",
			{
				params: { symbol: binanceSymbol },
			}
		);
		console.log(binanceResponse);
	}

	async getAllMarketPricesForCurrency({
		baseCurrency,
		quoteCurrency,
	}: RatesFieldsDto): Promise<RatesOutputDto[] | string> {
		return "123";
	}
}
