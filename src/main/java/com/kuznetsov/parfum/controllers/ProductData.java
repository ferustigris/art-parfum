package com.kuznetsov.parfum.controllers;

import com.kuznetsov.parfum.entities.Product;
import com.kuznetsov.parfum.entities.Sale;

import java.util.List;

public class ProductData {
    private Long id;
    private String code;
    private String name;
    private SaleData input;
    private Long balance;
    private List<SaleData> sales;

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public SaleData getInput() {
        return input;
    }

    public Long getBalance() {
        return balance;
    }

    public List<SaleData> getSales() {
        return sales;
    }

    public ProductData(Product product, List<SaleData> sales, Long balance, SaleData input) {
        id = product.getId();
        code = product.getCode();
        name = product.getName();

        this.sales = sales;
        this.balance = balance;
        this.input = input;
    }
}
