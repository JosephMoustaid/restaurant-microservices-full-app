package com.restaurant.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String cuisine;
    private Double rating;
    private Double latitude;
    private Double longitude;
}

