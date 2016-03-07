package com.kuznetsov.parfum.controllers;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.kuznetsov.parfum.entities.Sale;

import java.util.Date;

public class SaleData {
    private Long count = Long.valueOf(0);
    @JsonSerialize(using = PlaneDateSerializer.class)
    private Date date = new Date();
    private Double prise = Double.valueOf(0);

    public Long getCount() {
        return count;
    }

    public Date getDate() {
        return date;
    }

    public Double getPrise() {
        return prise;
    }

    public SaleData(Sale sale) {
        if (sale != null) {
            count = sale.getCount();
            date = sale.getDate();
            prise = sale.getPrise();
        }
    }
}
