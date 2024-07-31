import { Request, Response } from "express";

export interface ICryptoController {
	estimate: (req: Request, res: Response) => Promise<void>;
	getRates: (req: Request, res: Response) => Promise<void>;
}
