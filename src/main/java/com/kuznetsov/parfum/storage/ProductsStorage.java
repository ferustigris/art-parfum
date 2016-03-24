package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import com.kuznetsov.parfum.entities.Store;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * Store products
 */
@Component
@Transactional
public class ProductsStorage {
    private Logger log = LoggerFactory.getLogger(ProductsStorage.class);
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

    public List<Store> getStores() {
        return storesRepo.findAll();
    }

    public Sale updateSale(Long productId, Long storeId, Date d, Long count) {
        Sale sale = salesRepository.findByProductIdAndStoreIdAndDateAndCountGreaterThan(productId, storeId, d, Long.valueOf(0));
        if (sale == null) {
            return addNewSale(productId, storeId, d, count);
        }
        sale.setCount(count);
        return salesRepository.save(sale);
    }

    public Sale updateInput(Long productId, Long storeId, Date d, Long count) {
        Sale sale = salesRepository.findByProductIdAndStoreIdAndDateAndCountLessThan(productId, storeId, d, Long.valueOf(0));
        if (sale == null) {
            return addNewSale(productId, storeId, d, count);
        }
        sale.setCount(count);
        return salesRepository.save(sale);
    }

    private Sale addNewSale(Long productId, Long storeId, Date d, Long count) {
        Product product = productsRepository.findById(productId);
        Store store = storesRepo.findById(storeId);
        Sale sale = new Sale(store, product, d, count);
        return salesRepository.save(sale);
    }

    public List<Sale> getSales(Long productId, Long storeId, Date fromDate, Date toDate) {
        return salesRepository.findByProductIdAndStoreIdAndDateBetween(productId, storeId, fromDate, toDate);
    }

    public Long getBalance(Long productId, Long storeId) {
        Long salesSummary = salesRepository.getSalesSummary(productId, storeId);
        if (salesSummary != null) {
            salesSummary = -salesSummary;
        }
        return salesSummary;
    }

    public Sale getInput(Long productId, Long storeId, Date date) {
        return salesRepository.findByProductIdAndStoreIdAndDateAndCountLessThan(productId, storeId, date, Long.valueOf(0));
    }

    public void removeByCode(String code) {
        Product product = productsRepository.findByCode(code);
        salesRepository.removeByProductId(product.getId());
        productsRepository.removeById(product.getId());
    }
}
