package com.restaurant.places_service.controller;

import com.restaurant.places_service.dto.PlaceResponse;
import com.restaurant.places_service.service.PlacesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
@Slf4j
public class PlacesController {

    private final PlacesService placesService;

    @GetMapping("/search")
    public Mono<PlaceResponse> searchPlaces(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "5000") Integer radius) {

        log.info("Received search request - query: {}, location: {}, radius: {}", query, location, radius);

        return placesService.searchPlaces(query, location, radius);
    }
}

