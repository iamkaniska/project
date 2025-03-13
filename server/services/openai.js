import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const api=process.env.OPENAI_API_KEY;
// Use environment variable for API key
const genAI = new GoogleGenerativeAI(api);

export const generateAIQuestions = async (jobRole, category, count = 5) => {
  console.log(`Generating ${count} ${category} questions for ${jobRole} role`);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate ${count} interview questions for a ${jobRole} position. 
    The questions should be ${category} questions.

    For each question, provide:
    1. The question text
    2. A suggested answer
    3. The difficulty level (beginner, intermediate, or advanced)

    Format the response as a JSON array of objects with the following structure:
    [
      {
        "text": "question text",
        "suggestedAnswer": "detailed answer",
        "difficulty": "difficulty level"
      }
    ]

    Return only valid JSON without code blocks or any other text.`;

    const result = await model.generateContent(prompt);
    
    // Extract the text from the response
    const responseText = result.response.text();
    console.log("Raw Response:", responseText);

    if (!responseText) {
      throw new Error("No content received from API");
    }

    // Handle potential code block formatting in the response
    let jsonString = responseText;
    // Check if the response contains code blocks
    if (responseText.includes("```")) {
      // Extract content between ```json and ``` markers
      const match = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (match && match[1]) {
        jsonString = match[1].trim();
      } else {
        // If no match found, try to clean up the string
        jsonString = responseText.replace(/```json|```/g, "").trim();
      }
    }

    // Attempt to parse the JSON
    try {
      const parsedContent = JSON.parse(jsonString);
      
      // Validate the structure of the response
      if (!Array.isArray(parsedContent)) {
        throw new Error("API did not return an array of questions");
      }
      
      return parsedContent;
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      console.error("Raw JSON string:", jsonString);
      throw new Error(`Failed to parse JSON from API response: ${jsonError.message}`);
    }
  } catch (error) {
    console.error("Error generating AI questions:", error);
    throw error; // Propagate the error to be handled by the route
  }
};