package com.example.emailWriter.service;

import com.example.emailWriter.EmailRequest;

public interface EmailGeneratorService {
     String generateEmailReply(EmailRequest emailRequest);
}
