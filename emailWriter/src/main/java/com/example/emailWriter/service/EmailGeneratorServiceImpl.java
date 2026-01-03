package com.example.emailWriter.service;

import com.example.emailWriter.EmailRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorServiceImpl implements EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;


    public EmailGeneratorServiceImpl(
            WebClient.Builder webClientBuilder,
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey) {

        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
    }


    @Override
    public String generateEmailReply(EmailRequest emailRequest) {

        //Build prompt
        String prompt = buildPromt(emailRequest);
        //Prepare raw Json Body
        String requestBody = String.format(
                """
                        {
                            "contents": [
                              {
                                "parts": [
                                  {
                                    "text": "%s"
                                  }
                                ]
                              }
                            ]
                        }
                        """, prompt
        );
        // send request
        String response = webClient.post().uri(uriBuilder -> uriBuilder.
                path("/v1beta/models/gemini-2.5-flash:generateContent").build()).
                header("x-goog-api-key", apiKey).
                header("content-type", "application/json").
                bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        // extract response
       return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            /**
             * This is the way we can do the json navigation.
             * Like we get the response and we want to take the specific data from the return
             * then we have to perform the json navigation
             */
            JsonNode root  = objectMapper.readTree(response);
           return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text").asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    public  String buildPromt(EmailRequest emailRequest) {
        StringBuilder promt = new StringBuilder();
        promt.append("Generate a professional email reply for the following email");

        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()) {
            promt.append("Use a ").append(emailRequest.getTone()).append(" tone");
        }
        promt.append("Original Email : \n").append(emailRequest.getEmailContent());
        return promt.toString();
    }
}
