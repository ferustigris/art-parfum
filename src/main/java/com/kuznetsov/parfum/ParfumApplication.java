package com.kuznetsov.parfum;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

@SpringBootApplication
public class ParfumApplication  extends SpringBootServletInitializer {

    private static final Logger logger = LoggerFactory.getLogger(ParfumApplication.class);
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ParfumApplication.class);
    }
    public static void main(String[] args) {
        logger.debug("Started!");
        SpringApplication.run(ParfumApplication.class, args);
    }

}
