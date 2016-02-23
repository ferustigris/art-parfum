package com.kuznetsov.parfum.entities;

/**
 * Represents 1 product
 */
public class Product {

    private String code;
    private String name;
    private Long count;
    private Store store;

    public Product(String code, String name, long count, Store store) {
        this.code = code;
        this.name = name;
        this.count = count;
        this.store = store;
    }

    public String getCode() {
        return code;
    }
    public String getName() {
        return name;
    }
    public Store getStore() {
        return store;
    }
    public Long getCount() {
        return count;
    }

    @Override
    public boolean equals(Object o) {
        if (o != null) {
            Product p = (Product)o;
            return p.code.equals(code);
        }
        return false;
    }
}
