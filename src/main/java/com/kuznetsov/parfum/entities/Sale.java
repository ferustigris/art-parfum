package com.kuznetsov.parfum.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.kuznetsov.parfum.controllers.PlaneDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Represents one sale fact
 */
@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private Store store;

    @OneToOne
    private Product product;

    @Column
    private Long count;

    @Column
    private Double prise;

    @Column
    @Temporal(TemporalType.DATE)
    @JsonSerialize(using = PlaneDateSerializer.class)
    private Date date;

    public Sale(Store store, Product product, Date date, Long count) {
        this.store = store;
        this.product = product;
        this.count = count;
        this.date = date;
    }

    public Sale() {
    }

    public Store getStore() {
        return store;
    }

    public Product getProduct() {
        return product;
    }

    public Double getPrise() {
        return prise;
    }

    public Date getDate() {
        return date;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
