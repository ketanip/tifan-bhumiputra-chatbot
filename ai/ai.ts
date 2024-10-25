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
        You are a bot. You are supposed to generate response for given chat. Use the given chats and context. Only return message content as response.
        Provide your response in valid markdown. When responding with a numerical data try to use tables to efficiently display data.
        ----
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