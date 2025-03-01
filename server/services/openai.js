import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIQuestions = async (jobRole, category, count = 5) => {
  try {
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
    ]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional interview coach specializing in creating realistic interview questions and answers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Ensure we have an array of questions
    return Array.isArray(parsedContent.questions) 
      ? parsedContent.questions 
      : parsedContent;
  } catch (error) {
    console.error('Error generating AI questions:', error);
    throw new Error('Failed to generate AI questions');
  }
};