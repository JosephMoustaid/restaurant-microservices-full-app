package com.restaurant.restaurant_service.config;

import com.restaurant.restaurant_service.entity.Restaurant;
import com.restaurant.restaurant_service.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(RestaurantRepository repository) {
        return args -> {
            // Only load data if the database is empty
            if (repository.count() == 0) {
                repository.save(new Restaurant(null, "The Italian Corner", "123 Main St, New York, NY 10001", "Italian", 4.5, 40.7128, -74.0060));
                repository.save(new Restaurant(null, "Sushi Palace", "456 Park Ave, New York, NY 10022", "Japanese", 4.8, 40.7614, -73.9776));
                repository.save(new Restaurant(null, "Taco Fiesta", "789 Broadway, New York, NY 10003", "Mexican", 4.2, 40.7308, -73.9973));
                repository.save(new Restaurant(null, "Le Petit Bistro", "321 5th Ave, New York, NY 10016", "French", 4.7, 40.7451, -73.9826));
                repository.save(new Restaurant(null, "Dragon Wok", "654 Madison Ave, New York, NY 10065", "Chinese", 4.3, 40.7644, -73.9665));
                repository.save(new Restaurant(null, "Curry House", "987 Lexington Ave, New York, NY 10021", "Indian", 4.6, 40.7689, -73.9658));
                repository.save(new Restaurant(null, "The Steakhouse", "147 7th Ave, New York, NY 10011", "American", 4.9, 40.7394, -74.0021));
                repository.save(new Restaurant(null, "Mediterranean Delight", "258 3rd Ave, New York, NY 10010", "Mediterranean", 4.4, 40.7348, -73.9840));
                repository.save(new Restaurant(null, "Bangkok Street Food", "369 Amsterdam Ave, New York, NY 10024", "Thai", 4.5, 40.7870, -73.9754));
                repository.save(new Restaurant(null, "Pizzeria Romana", "741 Columbus Ave, New York, NY 10025", "Italian", 4.6, 40.7921, -73.9665));
                repository.save(new Restaurant(null, "The Burger Joint", "852 6th Ave, New York, NY 10001", "American", 4.1, 40.7484, -73.9857));
                repository.save(new Restaurant(null, "Pho Vietnam", "963 1st Ave, New York, NY 10022", "Vietnamese", 4.4, 40.7549, -73.9677));
                repository.save(new Restaurant(null, "Greek Taverna", "159 2nd Ave, New York, NY 10003", "Greek", 4.5, 40.7269, -73.9866));
                repository.save(new Restaurant(null, "BBQ Smokehouse", "753 10th Ave, New York, NY 10019", "BBQ", 4.7, 40.7649, -73.9944));
                repository.save(new Restaurant(null, "Vegetarian Garden", "951 Broadway, New York, NY 10010", "Vegetarian", 4.3, 40.7411, -73.9897));

                System.out.println("✅ Sample restaurant data loaded successfully!");
            } else {
                System.out.println("ℹ️  Database already contains data. Skipping data initialization.");
            }
        };
    }
}

