package com.example.mini_ecom.orders;

import com.example.mini_ecom.products.Product;
import com.example.mini_ecom.products.ProductRepository;
import com.example.mini_ecom.users.User;
import com.example.mini_ecom.users.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody @Valid CreateOrderRequest req, HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Order order = new Order();
        order.setUser(user);

        for (Item itemReq : req.items()) {
            Product product = products.findById(itemReq.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
            if (product.getStock() < itemReq.quantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient amount of " + product.getName());
            }
        }

        double total = 0.0;
        for (Item itemReq : req.items()) {
            Product product = products.findById(itemReq.productId()).orElseThrow();
            product.setStock(product.getStock() - itemReq.quantity());
            products.save(product);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .price(product.getPrice())
                    .build();
            order.getItems().add(item);
            total += product.getPrice() * itemReq.quantity();
        }

        order.setTotalPrice(total);
        Order saved = orders.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    public record CreateOrderRequest(List<Item> items) {}
    public record Item(@NotNull Long productId, @NotNull @Min(1) Integer quantity) {}
}