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

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
public class ProductsController {
    private Logger log = LoggerFactory.getLogger(ProductsController.class);

    @Autowired
    private ProductsStorage storage;

    @RequestMapping("/data/sales.json")
    @ResponseBody()
    public List<ProductData> getSales(@RequestParam("store") Long store, @RequestParam("from") Long from, @RequestParam("to") Long to) {
        log.debug("get sales request for " + store);
        return getSalesForProduct(store, from, to);
    }

    @RequestMapping("/data/export.json")
    @ResponseBody()
    public String export(@RequestParam("date") Long date) throws IOException {
//        exportFromCsv(date, new BufferedReader(new FileReader("t.csv")));
//        exportFromCsv(date, new BufferedReader(new FileReader("v.csv")));
//        exportFromCsv(date, new BufferedReader(new FileReader("s.csv")));
        return "";
    }

    private void exportFromCsv(@RequestParam("date") Long date, BufferedReader br) throws IOException {
        Date d = new Date(date);
        String line;
        while ((line = br.readLine()) != null) {

            // use comma as separator
            String[] productInfo = line.split(",");

            System.out.println("Product [code= " + productInfo[1]
                    + " , count=" + productInfo[2] + "]");
            Product product = new Product(productInfo[1], "");
            log.debug("request for creating new product " + product);
            product = storage.createNew(product);

            storage.updateInput(product.getId(), Long.valueOf(productInfo[0]), d, -Long.valueOf(productInfo[2]));

        }
    }

    private List<ProductData> getSalesForProduct(Long store, Long from, Long to) {
        List<ProductData> result = new LinkedList<>();
        for (Product product: storage.getProducts(store)) {
            Date fromDate = new Date(from);
            Date toDate = new Date(to);
            Date lastMonday = getLastMonday(toDate);

            Sale inputForProduct = storage.getInput(product.getId(), store, lastMonday);
            SaleData input = new SaleData(inputForProduct);
            List<Sale> salesForProduct = storage.getSales(product.getId(), store, fromDate, toDate);
            List<SaleData> sales = new LinkedList<>();
            for (Sale sale : salesForProduct) {
                SaleData saleData = new SaleData(sale);
                sales.add(saleData);
            }
            Long balance = storage.getBalance(product.getId(), store);

            ProductData productData = new ProductData(product, sales, balance, input);
            result.add(productData);
        }
        return result;
    }


    @RequestMapping("/data/inputs.json")
    @ResponseBody()
    public List<ProductData> getInputs(@RequestParam("store") Long store, @RequestParam("from") Long from, @RequestParam("to") Long to) {
        log.debug("get inputs request for " + store);
        return getSalesForProduct(store, from, to);
    }

    @RequestMapping("/data/stores.json")
    @ResponseBody()
    public List<Store> getStores() {
        log.debug("get stores request");
        return storage.getStores();
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
        storage.removeByCode(code);
        return "";
    }

    @RequestMapping("/data/updateProduct.json")
    @ResponseBody()
    public Product updateProduct(@RequestParam("name") String name, @RequestParam("code") String code) {
        Product product = new Product(code, name);
        log.debug("request for creating new product " + product);
        return storage.update(product);
    }

    @RequestMapping("/data/updateSale.json")
    @ResponseBody()
    public Sale updateSale(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("date") Long date, @RequestParam("count") Long count) {
        log.debug("request for sale");
        Date d = new Date(date);
        return storage.updateSale(productId, storeId, d, count);
    }

    @RequestMapping("/data/updateInput.json")
    @ResponseBody()
    public Sale updateInput(@RequestParam("product") Long productId, @RequestParam("store") Long storeId, @RequestParam("date") Long date, @RequestParam("count") Long count) {
        log.debug("request for sale");
        Date d = new Date(date);
        return  storage.updateInput(productId, storeId, d, -count);
    }

}
