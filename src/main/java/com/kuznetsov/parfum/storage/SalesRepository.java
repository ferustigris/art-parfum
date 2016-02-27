package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Sale;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface SalesRepository extends Repository<Sale, Long> {
    List<Sale> findAll();
    List<Sale> findByProductId(Long id);
    <S extends Sale> S findByProductIdAndStoreIdAndDateAndCountGreaterThan(Long productId, Long storeId, Date d, Long count);
    <S extends Sale> S findByProductIdAndStoreIdAndDateAndCountLessThan(Long productId, Long storeId, Date d, Long count);
    <S extends Sale> S save(Sale p);

    List<Sale> findByProductIdAndStoreIdAndDateBetween(Long productId, Long storeId, Date fromDate, Date toDate);

    @Query(value = "select SUM(count) FROM sales WHERE product_id=:productId AND store_id=:storeId", nativeQuery = true)
    Long getSalesSummary(@Param("productId") Long productId, @Param("storeId") Long storeId);
}
