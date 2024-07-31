import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { CryptoController } from "./crypto/controller";
import { ICryptoController } from "./crypto/controller.interface";
import { BinanceService } from "./crypto/exchanges/binance";
import { IExchangeService } from "./crypto/exchanges/exchange.interface";
import { KucoinService } from "./crypto/exchanges/kucoin";
import { CryptoService } from "./crypto/service";
import { ICryptoService } from "./crypto/service.interface";
import { TYPES } from "./types";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ICryptoController>(TYPES.CryptoController)
		.to(CryptoController)
		.inSingletonScope();
	bind<ICryptoService>(TYPES.CryptoService)
		.to(CryptoService)
		.inSingletonScope();
	bind<IExchangeService>(TYPES.BinanceService)
		.to(BinanceService)
		.whenTargetTagged("exchange", TYPES.BinanceService);
	bind<IExchangeService>(TYPES.KucoinService)
		.to(KucoinService)
		.whenTargetTagged("exchange", TYPES.KucoinService);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
