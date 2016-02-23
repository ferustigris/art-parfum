package com.kuznetsov.parfum.storage;

import com.kuznetsov.parfum.entities.Store;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface StoresRepo extends Repository<Store, Long> {
    List<Store> findAll();
}
