package com.kuznetsov.parfum;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ParfumApplication {
    int i;

    private static final Logger logger = LoggerFactory.getLogger(ParfumApplication.class);

    public static void main(String[] args) {
        logger.debug("Started!");
        SpringApplication.run(ParfumApplication.class, args);

    }


}
