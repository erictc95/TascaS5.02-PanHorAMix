package com.panhoramix.backend.service;

import com.panhoramix.backend.entity.enums.StorageFolder;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadFile(MultipartFile file, StorageFolder folder, Long userId);

    void deleteFile(String fileUrl);

}
