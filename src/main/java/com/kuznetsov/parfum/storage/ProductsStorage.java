package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import com.kuznetsov.parfum.entities.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Store products
 */
@Component
@Transactional
public class ProductsStorage {
    Random r = new Random();
    private final StoresRepo storesRepo;

    @Autowired
    public ProductsStorage(StoresRepo storesRepo) {
        this.storesRepo = storesRepo;
    }

    List<Product> products = Arrays.asList(
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store()),
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store()),
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store()),
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store()),
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store()),
        new Product(String.valueOf(100 + r.nextInt(100)), "parfum" + String.valueOf(r.nextInt(100)), r.nextInt(10), new Store())
    );

    public List<Product> getProducts() {
        for(Store s :storesRepo.findAll()) {
            System.out.println("s=" + s.getName());

        }
        return products;
    }

    public List<Sale> getSalesGroupedByDate(String code) {
        Random r = new Random();
        return Arrays.asList(
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000)),
                new Sale(r.nextInt(1000))
        );
    }

    public Product createNew(Product product) {
        return product;
    }

    public Product update(Product product) {
        int i = products.indexOf(product);
        if (i >= 0) {
            return product;
        }
        return null;
    }
}
