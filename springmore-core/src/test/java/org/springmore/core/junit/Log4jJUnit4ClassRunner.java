package org.springmore.core.junit;

import java.io.FileNotFoundException;

import org.junit.runners.model.InitializationError;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Log4jConfigurer;

public class Log4jJUnit4ClassRunner extends SpringJUnit4ClassRunner{
	
	static {  
        try {  
            Log4jConfigurer.initLogging("classpath:log4j.properties");  
        } catch (FileNotFoundException ex) {  
            System.err.println("Cannot Initialize log4j");  
        }  
    }  

	public Log4jJUnit4ClassRunner(Class<?> clazz) throws InitializationError {
		super(clazz);
	}

}
