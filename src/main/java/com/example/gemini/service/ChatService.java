package com.example.gemini.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.gemini.Entity.ChatHistory;
import com.example.gemini.Repository.ChatHistoryRepository;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class ChatService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final Client googleGenAiClient;

    // Default model variant
    private static final String DEFAULT_MODEL = "gemini-2.0-flash";

    public ChatService(ChatHistoryRepository chatHistoryRepository) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.googleGenAiClient = new Client();  // Reads GOOGLE_API_KEY from env variables
    }

    /**
     * Call Gemini with a prompt using the default model and save the response.
     */
    public String askGeminiAndSaveResponse(String prompt, String userId) {
        return askGeminiAndSaveResponse(prompt, userId, DEFAULT_MODEL);
    }

    /**
     * Call Gemini with a prompt and model variant, save the response.
     * 
     * @param prompt user input text
     * @param modelVariant Gemini model variant name (e.g. "gemini-2.5-pro-preview-05-06")
     * @return response text from Gemini
     */
    public String askGeminiAndSaveResponse(String prompt, String userId, String modelVariant) {
        GenerateContentResponse response = googleGenAiClient.models.generateContent(
            modelVariant,
            prompt,
            null
        );

        String answer = response.text();

        // Check if response is null or blank and set default message
        if (answer == null || answer.isBlank()) {
            answer = "Sorry, no response from Gemini.";
        }

        // Save prompt and response to DB
        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUserMessage(prompt); // or set the actual user message
        chatHistory.setPrompt(prompt);
        chatHistory.setBotResponse(answer);
        chatHistory.setUserId(userId);
        chatHistory.setTimestamp(java.time.LocalDateTime.now());
        chatHistoryRepository.save(chatHistory);

        return answer;
    }
    public List<ChatHistory> getChatHistoryByUserId(String userId) {
        return chatHistoryRepository.findByUserId(userId);
    }

}
