package com.example.mini_ecom.products;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpSession;
import com.example.mini_ecom.users.User;
import com.example.mini_ecom.users.UserRepository;
import com.example.mini_ecom.users.Role;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class ProductController {
    

    private final ProductRepository products;
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

    @GetMapping
    public List<Product> all() {
        return products.findAll();
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody @Valid CreateProductRequest req, HttpSession session) {
        ensureAdmin(session);
        if (products.findByName(req.name()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product name already exists");
        }

        Product product = Product.builder()
                .name(req.name())
                .description(req.description())
                .price(req.price())
                .stock(req.stock())
                .build();
        Product saved = products.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestBody @Valid UpdateStockRequest req, HttpSession session) {
        ensureAdmin(session);
        Product product = products.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        product.setStock(product.getStock() + req.quantity());
        Product saved = products.save(product);
        return ResponseEntity.ok(saved);
    }

    public record CreateProductRequest(
            @NotBlank String name,
            @NotBlank String description,
            @NotNull @DecimalMin("0.0") Double price,
            @NotNull @Min(0) Integer stock
    ) {}

    public record UpdateStockRequest(
            @NotNull @Min(0) Integer quantity
    ) {}
}