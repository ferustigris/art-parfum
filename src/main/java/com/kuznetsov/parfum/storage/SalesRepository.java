package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Sale;
import org.springframework.data.repository.Repository;

import java.util.Date;
import java.util.List;

public interface SalesRepository extends Repository<Sale, Long> {
    List<Sale> findAll();
    List<Sale> findByProductId(Long id);
    <S extends Sale> S findByProductIdAndStoreIdAndDate(Long productId, Long storeId, Date d);
    <S extends Sale> S save(Sale p);

    List<Sale> findByProductIdAndStoreId(Long productId, Long storeId);
}
