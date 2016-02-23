package com.kuznetsov.parfum.controllers;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import com.kuznetsov.parfum.entities.Store;
import com.kuznetsov.parfum.storage.ProductsStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
public class ProductsController {
    private Logger log = LoggerFactory.getLogger(ProductsController.class);

    @Autowired
    private ProductsStorage storage;

    @RequestMapping("/data/products.json")
    @ResponseBody()
    public List<Product> getProducts(@RequestParam("store") Long store) {
        log.debug("get products request for " + store);
        return storage.getProducts(store);
    }

    @RequestMapping("/data/stores.json")
    @ResponseBody()
    public List<Store> getStores() {
        log.debug("get stores request");
        return storage.getStores();
    }

    @RequestMapping("/data/salesGroupedByDate.json")
    @ResponseBody()
    public List<Sale> getSalesGroupedByDate(@RequestParam("code") String code, @RequestParam("days") Long days, @RequestParam("store") Long storeId) {
        log.debug("get getSalesGroupedByDate request for " + code);
        return storage.getSalesGroupedByDate(code, days, storeId);
    }

    @RequestMapping("/data/addNewProduct.json")
    @ResponseBody()
    public Product addNewProduct(@RequestParam("name") String name, @RequestParam("code") String code, @RequestParam("count") Long count, @RequestParam("store") Long store) {
        Product product = new Product(code, name);
        log.debug("request for creating new product " + product);
        return storage.createNew(product);
    }

    @RequestMapping("/data/removeProduct.json")
    @ResponseBody
    public String removeProduct(@RequestParam("code") String code) {
        log.debug("request for removing product with code " + code);
        Product product = new Product(code, "");
        storage.remove(product);
        return "";
    }

    @RequestMapping("/data/updateProduct.json")
    @ResponseBody()
    public Product updateProduct(@RequestParam("name") String name, @RequestParam("code") String code, @RequestParam("count") Long count) {
        Product product = new Product(code, name);
        log.debug("request for creating new product " + product);
        return storage.update(product);
    }

    @RequestMapping("/data/updateSale.json")
    @ResponseBody()
    public String updateSale(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("day") Long day, @RequestParam("count") Long count) {
        log.debug("request for sale");
        return "";
    }

}
