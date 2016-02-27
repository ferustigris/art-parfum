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

import java.util.Date;
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

    @RequestMapping("/data/sale.json")
    @ResponseBody()
    public Sale getSales(@RequestParam("product") Long productId, @RequestParam("date") Long date, @RequestParam("store") Long storeId) {
        log.debug("getSale request");
        return storage.getSale(productId, new Date(date), storeId);
    }

    @RequestMapping("/data/sales.json")
    @ResponseBody()
    public Sales getSales(@RequestParam("product") Long productId, @RequestParam("store") Long storeId) {
        log.debug("getSales request");
        return new Sales(storage.getSales(productId, storeId), storage.getBalance(productId, storeId));
    }

    @RequestMapping("/data/addNewProduct.json")
    @ResponseBody()
    public Product addNewProduct(@RequestParam("name") String name, @RequestParam("code") String code) {
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
    public Product updateProduct(@RequestParam("name") String name, @RequestParam("code") String code, @RequestParam("input") Long input) {
        Product product = new Product(code, name);
        log.debug("request for creating new product " + product);
        return storage.update(product);
    }

    @RequestMapping("/data/updateSale.json")
    @ResponseBody()
    public Sale updateSale(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("day") Long day, @RequestParam("count") Long count) {
        log.debug("request for sale");
        Date d = new Date();
        d.setTime(d.getTime() - day * 24 * 60 * 60 * 1000);
        return  storage.updateSale(productId, storeId, d, count);
    }

    private class Sales {
        public List<Sale> getSales() {
            return sales;
        }

        public Long getBalance() {
            return balance;
        }

        List<Sale> sales;
        Long balance;

        public Sales(List<Sale> sales, Long balance) {
            this.sales = sales;
            this.balance = balance;
        }
    }
}
