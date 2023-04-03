package com.kyobo.koreait.config;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class MvcConfig implements WebMvcConfigurer {
    String sysPath = "C:\\Users\\SangYoung\\Downloads\\WEB19 KSY\\";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**").addResourceLocations("classpath/resource/");
        registry.addResourceHandler("/spring file/**").addResourceLocations(sysPath);
    }
}
