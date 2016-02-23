package com.kuznetsov.parfum.entities;

import javax.persistence.*;

/**
 * Represents 1 product
 */
@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String code;
    @Column
    private String name;

    public Product() {
    }

    public Product(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }
    public String getName() {
        return name;
    }
    public Store getStore() {
        return null;
    }
    public Long getCount() {
        return Long.valueOf(0);
    }

    public Long getId() {
        return id;
    }
}
