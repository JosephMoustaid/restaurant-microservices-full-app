package com.restaurant.reservation_service.controller;

import com.restaurant.reservation_service.client.RestaurantClient;
import com.restaurant.reservation_service.entity.Reservation;
import com.restaurant.reservation_service.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RestaurantClient restaurantClient;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        // Optionally verify restaurant exists by calling restaurant-service
        try {
            Object restaurant = restaurantClient.getRestaurant(reservation.getRestaurantId());
            if (restaurant == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            // Restaurant service unavailable or restaurant not found
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

