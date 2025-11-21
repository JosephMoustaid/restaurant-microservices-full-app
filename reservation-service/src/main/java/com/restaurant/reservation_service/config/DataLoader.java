package com.restaurant.reservation_service.config;

import com.restaurant.reservation_service.entity.Reservation;
import com.restaurant.reservation_service.repository.ReservationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ReservationRepository repository) {
        return args -> {
            // Only load data if the database is empty
            if (repository.count() == 0) {
                repository.save(new Reservation(null, 1L, "John Smith", LocalDateTime.of(2025, 11, 22, 19, 0)));
                repository.save(new Reservation(null, 1L, "Jane Doe", LocalDateTime.of(2025, 11, 22, 20, 0)));
                repository.save(new Reservation(null, 2L, "Bob Johnson", LocalDateTime.of(2025, 11, 23, 18, 30)));
                repository.save(new Reservation(null, 3L, "Alice Williams", LocalDateTime.of(2025, 11, 23, 19, 0)));
                repository.save(new Reservation(null, 4L, "Charlie Brown", LocalDateTime.of(2025, 11, 24, 18, 0)));
                repository.save(new Reservation(null, 5L, "Diana Prince", LocalDateTime.of(2025, 11, 24, 20, 0)));
                repository.save(new Reservation(null, 6L, "Edward Norton", LocalDateTime.of(2025, 11, 25, 19, 30)));
                repository.save(new Reservation(null, 7L, "Fiona Green", LocalDateTime.of(2025, 11, 25, 18, 0)));
                repository.save(new Reservation(null, 8L, "George Miller", LocalDateTime.of(2025, 11, 26, 19, 0)));
                repository.save(new Reservation(null, 9L, "Hannah White", LocalDateTime.of(2025, 11, 26, 20, 0)));

                System.out.println("✅ Sample reservation data loaded successfully!");
            } else {
                System.out.println("ℹ️  Database already contains data. Skipping data initialization.");
            }
        };
    }
}

