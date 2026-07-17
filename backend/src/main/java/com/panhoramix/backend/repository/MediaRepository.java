package com.panhoramix.backend.repository;

import com.panhoramix.backend.entity.Media;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByVisibility(Visibility visibility);

    List<Media> findByMediaType(MediaType mediaType);

    List<Media> findByCategory(String category);

}