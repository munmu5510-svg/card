
import { GoogleGenAI } from "@google/genai";
import type { ImageBlob } from '../utils/imageUtils';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateIdCard(
  photoBlob: ImageBlob,
  firstName: string,
  lastName: string,
  nationality: string
): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  const prompt = `Générez une carte d'identité nationale réaliste mais entièrement fictive pour le pays : ${nationality}. La carte doit comporter la photographie de la personne fournie. Le nom sur la carte doit être "${firstName} ${lastName}". Le design de la carte d'identité doit être visuellement cohérent avec les éléments de design, les symboles et la langue typiques d'une carte d'identité nationale de ${nationality}. N'incluez aucun vrai numéro d'identification ou donnée personnelle autre que le nom fourni. La sortie doit être uniquement l'image de la carte d'identité.`;

  const imagePart = {
    inlineData: {
      data: photoBlob.data,
      mimeType: photoBlob.mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });

    if (
      response.candidates &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error("Aucune image n'a été trouvée dans la réponse de l'API.");

  } catch (error) {
    console.error("Erreur de l'API Gemini:", error);
    throw new Error("Échec de la communication avec le service d'IA. Veuillez réessayer.");
  }
}
