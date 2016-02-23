package com.kuznetsov.parfum.entities;

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
    private Date date;

    public Sale() {
    }

    public Sale(long count) {
        this.count = Long.valueOf(count);
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
}
