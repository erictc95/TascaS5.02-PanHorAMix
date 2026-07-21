package com.panhoramix.backend.service.impl;

import com.panhoramix.backend.entity.enums.StorageFolder;
import com.panhoramix.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class CloudflareStorageService implements FileStorageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    public CloudflareStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(
            MultipartFile file,
            StorageFolder folder,
            Long userId) {

        try {

            String originalFilename = file.getOriginalFilename();

            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;

            String objectKey = folder.getFolder()
                    + "/"
                    + userId
                    + "/"
                    + fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            return publicUrl + "/" + objectKey;

        } catch (IOException e) {
            throw new RuntimeException("Error uploading file to Cloudflare R2", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

}
