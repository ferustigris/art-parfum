package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import com.kuznetsov.parfum.entities.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

/**
 * Store products
 */
@Component
@Transactional
public class ProductsStorage {
    Random r = new Random();
    private final StoresRepository storesRepo;
    private final ProductsRepository productsRepository;
    private final SalesRepository salesRepository;

    @Autowired
    public ProductsStorage(StoresRepository storesRepo, ProductsRepository productsRepository, SalesRepository salesRepository) {
        this.storesRepo = storesRepo;
        this.productsRepository = productsRepository;
        this.salesRepository = salesRepository;
    }

     public List<Product> getProducts(Long store) {
        return productsRepository.findAll();
    }

    public List<Sale> getSalesGroupedByDate(String code, Long days, Long storeId) {
        Product product = productsRepository.findByCode(code);
        return salesRepository.findByProductIdAndStoreId(product.getId(), storeId);
    }

    public Product createNew(Product product) {
        Product p = productsRepository.findByCode(product.getCode());
        if (p != null) {
            return p;
        }
        return productsRepository.save(product);
    }

    public Product update(Product product) {
        return product;
    }

    public void remove(Product product) {
    }

    public List<Store> getStores() {
        return storesRepo.findAll();
    }
}
