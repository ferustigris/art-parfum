package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import org.springframework.web.bind.annotation.RequestParam;

import javax.xml.ws.RequestWrapper;
import java.util.Arrays;
import java.util.List;

/**
 * Store products
 */
public class ProductsStorage {
    public List<Product> getProducts() {
        return Arrays.asList(new Product());
    }

    public List<Sale> getSalesGroupedByDate(String code) {
        return Arrays.asList(new Sale());
    }
}
