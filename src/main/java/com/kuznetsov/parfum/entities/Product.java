package com.kuznetsov.parfum.entities;

/**
 * Represents 1 product
 */
public class Product {
    public String getCode() {
        return "153";
    }
    public String getName() {
        return "prod1";
    }
    public Store getStore() {
        return new Store();
    }
    public Long getCount() {
        return Long.valueOf(13);
    }
}
