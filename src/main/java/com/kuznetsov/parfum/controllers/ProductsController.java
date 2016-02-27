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

import java.util.Calendar;
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

    @RequestMapping("/data/sales.json")
    @ResponseBody()
    public Sales getSales(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("from") Long from, @RequestParam("to") Long to) {
        log.debug("getSales request");
        Date fromDate = new Date(from);
        Date toDate = new Date(to);
        Date lastMonday = getLastMonday(toDate);
        Sale input =   storage.getInput(productId, storeId, lastMonday);

        List<Sale> sales = storage.getSales(productId, storeId, fromDate, toDate);
        Long balance = storage.getBalance(productId, storeId);
        return new Sales(sales, balance, input);
    }

    private Date getLastMonday(Date toDate) {
        // Get calendar set to current date and time
        Calendar c = Calendar.getInstance();
        c.setTime(toDate);
        // Set the calendar to monday of the current week
        c.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        return c.getTime();
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
    public Sale updateSale(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("date") Long date, @RequestParam("count") Long count) {
        log.debug("request for sale");
        Date d = new Date(date);
        return  storage.updateSale(productId, storeId, d, count);
    }

    @RequestMapping("/data/updateInput.json")
    @ResponseBody()
    public Sale updateInput(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("date") Long date, @RequestParam("count") Long count) {
        log.debug("request for sale");
        Date toDate = new Date(date);
        Date lastMonday = getLastMonday(toDate);
        return  storage.updateInput(productId, storeId, lastMonday, count);
    }

    private class Sales {
        List<Sale> sales;
        Long balance;
        Sale input;

        public Sales(List<Sale> sales, Long balance, Sale input) {
            this.sales = sales;
            this.balance = balance;
            this.input = input;
        }

        public Sale getInput() {
            return input;
        }

        public List<Sale> getSales() {
            return sales;
        }

        public Long getBalance() {
            return balance;
        }
    }
}
