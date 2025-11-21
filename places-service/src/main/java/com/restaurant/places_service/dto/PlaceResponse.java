package com.restaurant.places_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceResponse {
    private List<PlaceItem> results;
    private String status;
}

