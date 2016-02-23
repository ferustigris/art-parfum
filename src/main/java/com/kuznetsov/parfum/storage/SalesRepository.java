package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Sale;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface SalesRepository extends Repository<Sale, Long> {
    List<Sale> findAll();
    List<Sale> findByProductId(Long id);

    List<Sale> findByProductIdAndStoreId(Long id, Long storeId);
}
