package com.kuznetsov.parfum;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class ParfumApplication {

    private static final Logger logger = LoggerFactory.getLogger(ParfumApplication.class);
    
    public static void main(String[] args) {
        SpringApplication.run(ParfumApplication.class, args);
    }
}
