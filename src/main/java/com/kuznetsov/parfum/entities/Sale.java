package com.kuznetsov.parfum.entities;

/**
 * Represents one sale fact
 */
public class Sale {
    Long count;

    public Sale(long count) {
        this.count = Long.valueOf(count);
    }

    public Long getCount() {
        return count;
    }
}
