import { inject, injectable, tagged } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { ICryptoService, IFindSymbolResult } from "./service.interface";
import { EstimateFieldsDto, EstimateOutputDto } from "./dto/estimate.dto";
import axios from "axios";
import { RatesFieldsDto, RatesOutputDto } from "./dto/rates.dto";
import { TYPES } from "../types";
import { IExchangerService } from "./exchangers/exchanger.interface";

@injectable()
export class CryptoService implements ICryptoService {
	constructor(
		@inject(TYPES.BinanceService)
		@tagged("exchanger", TYPES.BinanceService)
		private binanceService: IExchangerService,
		@inject(TYPES.KucoinService)
		@tagged("exchanger", TYPES.KucoinService)
		private kucoinService: IExchangerService
	) {}

	// ability to scale amount of exchangers by passing in array instances of exchangers
	private getAllExchangers(): IExchangerService[] {
		const allExchangers = [this.binanceService, this.kucoinService];
		return allExchangers;
	}

	// finding most profitable exchanger for buying provided amount of one currency using another
	async getBestEstimatedMarketValue({
		inputAmount,
		inputCurrency,
		outputCurrency,
	}: EstimateFieldsDto): Promise<any> {
		const symbolFindingResult = await this.findSymbol(
			inputCurrency,
			outputCurrency
		);
		if (typeof symbolFindingResult === "string") return symbolFindingResult;
		let result: EstimateOutputDto | undefined = undefined;
		const allExchangers = this.getAllExchangers();
		const exchangerPromises = allExchangers.map(async (exchanger) => {
			const exchangerResult =
				await exchanger.getExchangerEstimatedMarketValue(
					{
						inputAmount,
						inputCurrency: symbolFindingResult.firstCurrency,
						outputCurrency: symbolFindingResult.secondCurrency,
					},
					symbolFindingResult.reverse
				);
			if (typeof exchangerResult !== "string") {
				if (
					result === undefined ||
					result.outputAmount < exchangerResult.outputAmount
				) {
					result = exchangerResult;
				}
			}
		});

		await Promise.all(exchangerPromises);
		return result;
	}

	// listing all exchangers for trade between provided currencies
	async getAllMarketPricesForCurrency({
		baseCurrency,
		quoteCurrency,
	}: RatesFieldsDto): Promise<any> {
		const symbolFindingResult = await this.findSymbol(
			baseCurrency,
			quoteCurrency
		);
		if (typeof symbolFindingResult === "string") return symbolFindingResult;
		let result: RatesOutputDto[] = [];
		const allExchangers = this.getAllExchangers();
		const exchangerPromises = allExchangers.map(async (exchanger) => {
			const exchangerResult =
				await exchanger.getExchangerPriceForCurrency(
					{
						baseCurrency: symbolFindingResult.firstCurrency,
						quoteCurrency: symbolFindingResult.secondCurrency,
					},
					symbolFindingResult.reverse
				);
			if (typeof exchangerResult !== "string") {
				result.push(exchangerResult);
			}
		});

		await Promise.all(exchangerPromises);
		return result;
	}

	// function to finding out if needed to change places in order of currencies and further calculation process
	private async findSymbol(
		firstCurrency: string,
		secondCurrency: string
	): Promise<IFindSymbolResult | string> {
		const binanceSymbol = `${firstCurrency}${secondCurrency}`;
		try {
			await axios.get(
				`https://api.binance.com/api/v3/exchangeInfo?symbol=${binanceSymbol}`
			);
			return { reverse: false, firstCurrency, secondCurrency };
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response &&
				error.response.data.msg === "Invalid symbol."
			) {
				return {
					reverse: true,
					firstCurrency: secondCurrency,
					secondCurrency: firstCurrency,
				};
			} else {
				console.error("Unexpected error:", error);
				return "Unexpected error";
			}
		}
	}
}
