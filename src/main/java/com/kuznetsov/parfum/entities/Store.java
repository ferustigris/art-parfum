package com.kuznetsov.parfum.entities;


import javax.persistence.*;

/**
 * Represents storage class
 */
@Entity
@Table(name = "stores")
public class Store {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String name;

    public Store() {
        this.name = "name";
    }

    public Store(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
