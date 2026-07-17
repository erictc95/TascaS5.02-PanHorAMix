package com.panhoramix.backend.repository;

import com.panhoramix.backend.entity.Media;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {

    Page<Media> findByVisibility(
            Visibility visibility,
            Pageable pageable);

    Page<Media> findByMediaType(
            MediaType mediaType,
            Pageable pageable);

    Page<Media> findByCategory(
            String category,
            Pageable pageable);

}