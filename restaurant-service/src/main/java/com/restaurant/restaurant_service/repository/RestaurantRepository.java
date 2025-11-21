package com.restaurant.restaurant_service.repository;

import com.restaurant.restaurant_service.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(collectionResourceRel = "restaurants", path = "restaurants")
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}

