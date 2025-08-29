package com.example.mini_ecom.admin;

import com.example.mini_ecom.products.Product;
import com.example.mini_ecom.products.ProductRepository;
import com.example.mini_ecom.orders.Order;
import com.example.mini_ecom.orders.OrderRepository;
import com.example.mini_ecom.users.User;
import com.example.mini_ecom.users.UserRepository;
import com.example.mini_ecom.users.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository products;
    private final OrderRepository orders;
    private final UserRepository users;

    private void ensureAdmin(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (user.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/low-stock")
    public List<Product> lowStock(HttpSession session) {
        ensureAdmin(session);
        return products.findByStockLessThan(5);
    }

    @GetMapping("/orders")
    public List<Order> orders(HttpSession session) {
        ensureAdmin(session);
        return orders.findAll();
    }
}