package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Store products
 */
public class ProductsStorage {
    public List<Product> getProducts() {
        return Arrays.asList(new Product());
    }

    public List<Sale> getSalesGroupedByDate(String code) {
        Random r = new Random();
        return Arrays.asList(new Sale(r.nextInt(1000)), new Sale(r.nextInt(1000)), new Sale(r.nextInt(1000)), new Sale(r.nextInt(1000)));
    }
}
