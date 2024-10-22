import { IDataProps } from '../controllers/prompt-controller';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SingleRequestOptions } from '@google/generative-ai'
require('dotenv').config();

class PromptService{
  async execute({ message }: IDataProps){

    try {
      
      // const result = await model.generateContent(message);
      // console.log(JSON.stringify(result, null, 2));
      
      // if(result.response && result.response.candidates){
      //   const jsonText = result.response.candidates[0]?.content?.parts[0]?.text as string;

      //   return {data: jsonText};
      // }
      
      const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
      }

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ]

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY!);
      const model = genAI.getGenerativeModel({model: process.env.GEMINI_AI_MODEL_NAME!, safetySettings, generationConfig});

      // --------- AQUI ENTREGA A MENSAGE PARA O MODELO GERAR A RESPOSTA ---------
      const result = await model.generateContentStream([message]);
      console.log(JSON.stringify(result, null, 2));

      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        text += chunkText;
      }

      if (text) {
        // retorno da resposta
        return { data: text };
      }

      throw new Error('Nenhuma resposta gerada.');

    } catch (error: any) {
      console.error("Ops Deu Erro: ", error)
      throw new Error(`Ops Deu Erro: ${error}`);
    }
  } 
}

export { PromptService };