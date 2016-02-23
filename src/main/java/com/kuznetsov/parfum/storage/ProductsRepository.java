package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface ProductsRepository extends Repository<Product, Long> {
    List<Product> findAll();
    <S extends Product> S save(Product p);
    Product findByCode(String code);
}
