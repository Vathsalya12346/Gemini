package com.example.gemini.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gemini.Entity.ChatHistory;
import com.example.gemini.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    public String askGemini(@RequestBody PromptRequest promptRequest) {
        return chatService.askGeminiAndSaveResponse(promptRequest.getPrompt(), promptRequest.getUserId());
    }

    @GetMapping("/history/{userId}")
    public List<ChatHistory> getChatHistory(@PathVariable("userId") String userId) {
        return chatService.getChatHistoryByUserId(userId);
    }
    // Request body DTO
    public static class PromptRequest {
        private String prompt;
        private String userId;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}
