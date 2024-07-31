import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BaseContorller } from "../common/base.controller";
import { TYPES } from "../types";
import "dotenv/config";
import { ICryptoController } from "./controller.interface";
import { EstimateFieldsDto } from "./dto/estimate.dto";
import { RatesFieldsDto } from "./dto/rates.dto";
import axios from "axios";
import { ICryptoService } from "./service.interface";

@injectable()
export class CryptoController
	extends BaseContorller
	implements ICryptoController
{
	constructor(
		@inject(TYPES.CryptoService) private cryptoService: ICryptoService
	) {
		super();
		this.bindRoutes([
			{ path: "/estimate", method: "post", func: this.estimate },
			{ path: "/getRates", method: "post", func: this.getRates },
		]);
	}

	async estimate(
		req: Request<{}, {}, EstimateFieldsDto>,
		res: Response
	): Promise<void> {
		const result = await this.cryptoService.getBestEstimatedMarketValue(
			req.body
		);
		res.json(result);
	}

	async getRates(
		req: Request<{}, {}, RatesFieldsDto>,
		res: Response
	): Promise<void> {
		// const result = await this.ideaService.storeIdeas(req.body);
	}
}
