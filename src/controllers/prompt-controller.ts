import { Request, Response } from "express";
import { PromptService } from "../services/prompt-service";

export interface IDataProps {
  message: string;
}

class PromptController {
  async handle(req: Request, res: Response): Promise<void> {
    const {message} = req.body as IDataProps;
    
    if(!message){
      res.status(400).send({error: "Faltando parametro message com sua mensagem"});
      return;
    }
    
    const promptCreate = new PromptService(); // chama o servico que vai criar o prompt
    const response = await promptCreate.execute({ message });
    
    res.send(response);
  }
}

export { PromptController };