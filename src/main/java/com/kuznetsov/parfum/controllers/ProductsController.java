package com.kuznetsov.parfum.controllers;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;
import com.kuznetsov.parfum.storage.ProductsStorage;
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

    private ProductsStorage storage = new ProductsStorage();

    @RequestMapping("/data/products.json")
    @ResponseBody()
    public List<Product> getProducts() {
        log.debug("get products request");
        return storage.getProducts();
    }

    @RequestMapping("/data/salesGroupedByDate.json")
    @ResponseBody()
    public List<Sale> getSalesGroupedByDate(@RequestParam("code") String code) {
        log.debug("get getSalesGroupedByDate request for " + code);
        return storage.getSalesGroupedByDate(code);
    }

}
