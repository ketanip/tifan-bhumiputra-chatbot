"use server";

// Types
import { ChatItem } from "@/common/types";

// All data.
import { data } from "./data";

// Google AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const dataString = JSON.stringify(data);

export const getChatResponse = async (chats: ChatItem[], message: string) => {

    try {

        const chatsContent = chats.map(chat => `${chat.source}: ${chat.message}`).join("\n");
const prompt = `
You are Bhumi Bot, designed to generate responses based on the provided chat context. Respond only with message content in valid Markdown format, ensuring proper formatting. Use tables to present numerical data efficiently. Politely decline to answer any irrelevant questions.        ----
Context: ${dataString}
----

----
Chats:
${chatsContent}
user: ${message}
bot:
----`;

        const resp = await model.generateContent(prompt);
        return resp.response.text();

    } catch (error: unknown) {
        console.log(error);
        return `There was an error please try again.`
    }

}