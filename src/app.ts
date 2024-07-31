import express, { Express, json } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import "dotenv/config";
import { TYPES } from "./types";
import { CryptoController } from "./crypto/controller";

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number;

	constructor(
		@inject(TYPES.CryptoController)
		private cryptoController: CryptoController
	) {
		this.app = express();
		this.port = +process.env.PORT!;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use("/", this.cryptoController.router);
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		console.log("Running on port ", this.port);
		this.server = this.app.listen(this.port);
	}
}
