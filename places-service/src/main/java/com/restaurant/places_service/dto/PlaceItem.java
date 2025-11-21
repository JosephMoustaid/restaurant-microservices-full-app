package com.restaurant.places_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceItem {
    private String name;
    private Double rating;
    private Double latitude;
    private Double longitude;
    private String[] types;
    private Integer userRatingsTotal;
}

