package com.restaurant.places_service.service;

import com.restaurant.places_service.dto.GooglePlacesResponse;
import com.restaurant.places_service.dto.PlaceItem;
import com.restaurant.places_service.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlacesService {

    private final WebClient webClient;

    @Value("${google.places.api-key}")
    private String apiKey;

    @Value("${google.places.base-url}")
    private String baseUrl;

    public Mono<PlaceResponse> searchPlaces(String query, String location, Integer radius) {
        log.info("Searching places with query: {}, location: {}, radius: {}", query, location, radius);

        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .scheme("https")
                            .host("maps.googleapis.com")
                            .path("/maps/api/place/nearbysearch/json")
                            .queryParam("key", apiKey);

                    if (location != null && !location.isEmpty()) {
                        builder.queryParam("location", location);
                    }

                    if (query != null && !query.isEmpty()) {
                        builder.queryParam("keyword", query);
                    }

                    if (radius != null) {
                        builder.queryParam("radius", radius);
                    } else {
                        builder.queryParam("radius", 5000); // Default 5km radius
                    }

                    return builder.build();
                })
                .retrieve()
                .bodyToMono(GooglePlacesResponse.class)
                .map(this::convertToPlaceResponse)
                .doOnError(error -> log.error("Error calling Google Places API: {}", error.getMessage()))
                .onErrorResume(error -> Mono.just(new PlaceResponse(Collections.emptyList(), "ERROR")));
    }

    private PlaceResponse convertToPlaceResponse(GooglePlacesResponse googleResponse) {
        if (googleResponse == null || googleResponse.getResults() == null) {
            return new PlaceResponse(Collections.emptyList(), "ERROR");
        }

        List<PlaceItem> places = googleResponse.getResults().stream()
                .map(this::convertToPlaceItem)
                .collect(Collectors.toList());

        return new PlaceResponse(places, googleResponse.getStatus());
    }

    private PlaceItem convertToPlaceItem(GooglePlacesResponse.GooglePlace googlePlace) {
        PlaceItem item = new PlaceItem();
        item.setName(googlePlace.getName());
        item.setRating(googlePlace.getRating());
        item.setUserRatingsTotal(googlePlace.getUserRatingsTotal());

        if (googlePlace.getGeometry() != null && googlePlace.getGeometry().getLocation() != null) {
            item.setLatitude(googlePlace.getGeometry().getLocation().getLat());
            item.setLongitude(googlePlace.getGeometry().getLocation().getLng());
        }

        if (googlePlace.getTypes() != null) {
            item.setTypes(googlePlace.getTypes().toArray(new String[0]));
        }

        return item;
    }
}

