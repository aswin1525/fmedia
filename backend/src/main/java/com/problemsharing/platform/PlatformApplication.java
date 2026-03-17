package com.problemsharing.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.problemsharing.platform.dto.AuthRequest;
import com.problemsharing.platform.service.AuthService;
import com.problemsharing.platform.repository.UserRepository;

@SpringBootApplication
public class PlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlatformApplication.class, args);
	}

	@Bean
	public CommandLineRunner dummyData(AuthService authService, UserRepository userRepository) {
		return args -> {
			if (userRepository.findByAlias("UserA").isEmpty()) {
				System.out.println("Creating dummy credentials: UserA / password");
				AuthRequest req = new AuthRequest();
				req.setAlias("UserA");
				req.setPassword("password");
				authService.signup(req);
			}
		};
	}
}
