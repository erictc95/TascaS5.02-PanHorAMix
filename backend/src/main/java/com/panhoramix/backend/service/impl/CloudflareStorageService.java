package com.panhoramix.backend.service.impl;

import com.panhoramix.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

@Service
public class CloudflareStorageService implements FileStorageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    public CloudflareStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public void deleteFile(String fileUrl) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
