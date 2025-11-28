package com.restaurant.user_service;

import com.restaurant.user_service.entity.User;
import com.restaurant.user_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Create admin user if not exists
			if (!userRepository.existsByUsername("admin")) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setEmail("admin@restaurant.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setLatitude(40.7128);
				admin.setLongitude(-74.0060);
				admin.setRole("ROLE_ADMIN");
				userRepository.save(admin);
				System.out.println("Admin user created: username=admin, password=admin123");
			}

			// Create sample regular user if not exists
			if (!userRepository.existsByUsername("user")) {
				User user = new User();
				user.setUsername("user");
				user.setEmail("user@restaurant.com");
				user.setPassword(passwordEncoder.encode("user123"));
				user.setLatitude(40.7580);
				user.setLongitude(-73.9855);
				user.setRole("ROLE_USER");
				userRepository.save(user);
				System.out.println("Sample user created: username=user, password=user123");
			}
		};
	}
}
