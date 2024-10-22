import express, {Router, Request, Response} from "express"
import { PromptController } from "../controllers/prompt-controller";

const router = express.Router();
const promptController = new PromptController();

router.post("/generation", (req: Request, res: Response) => promptController.handle(req, res));

export default router;