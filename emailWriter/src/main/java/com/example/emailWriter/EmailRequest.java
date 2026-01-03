package com.example.emailWriter;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;

}
