package com.restaurant.places_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GooglePlacesResponse {
    @JsonProperty("results")
    private List<GooglePlace> results;

    @JsonProperty("status")
    private String status;

    @JsonProperty("error_message")
    private String errorMessage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GooglePlace {
        @JsonProperty("name")
        private String name;

        @JsonProperty("rating")
        private Double rating;

        @JsonProperty("geometry")
        private Geometry geometry;

        @JsonProperty("types")
        private List<String> types;

        @JsonProperty("user_ratings_total")
        private Integer userRatingsTotal;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geometry {
        @JsonProperty("location")
        private Location location;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        @JsonProperty("lat")
        private Double lat;

        @JsonProperty("lng")
        private Double lng;
    }
}

