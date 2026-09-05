package com.panhoramix.backend.service;

import com.panhoramix.backend.entity.enums.StorageFolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

@Service
public class ProfileImageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private static final int AVATAR_MIN_WIDTH = 300;
    private static final int AVATAR_MIN_HEIGHT = 300;

    private static final int BANNER_MIN_WIDTH = 1200;
    private static final int BANNER_MIN_HEIGHT = 400;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final FileStorageService fileStorageService;

    public ProfileImageService(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public String uploadAvatar(MultipartFile file, Long userId) {

        validateImage(
                file,
                AVATAR_MIN_WIDTH,
                AVATAR_MIN_HEIGHT,
                "Avatar"
        );

        return fileStorageService.uploadFile(
                file,
                StorageFolder.AVATARS,
                userId
        );
    }

    public String uploadBanner(MultipartFile file, Long userId) {

        validateImage(
                file,
                BANNER_MIN_WIDTH,
                BANNER_MIN_HEIGHT,
                "Banner"
        );

        return fileStorageService.uploadFile(
                file,
                StorageFolder.BANNERS,
                userId
        );
    }

    private void validateImage(
            MultipartFile file,
            int minimumWidth,
            int minimumHeight,
            String imageType
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    imageType + " file cannot be empty."
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    imageType + " format is not supported. " +
                            "Allowed formats: JPG, JPEG, PNG and WebP."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    imageType + " file is too large. " +
                            "Maximum allowed size is 10 MB."
            );
        }

        try (InputStream inputStream = file.getInputStream()) {

            BufferedImage image = ImageIO.read(inputStream);

            if (image == null) {
                throw new IllegalArgumentException(
                        imageType + " could not be read as a valid image."
                );
            }

            if (
                    image.getWidth() < minimumWidth ||
                            image.getHeight() < minimumHeight
            ) {
                throw new IllegalArgumentException(
                        imageType + " resolution is too low. " +
                                "Minimum required: " +
                                minimumWidth + " × " + minimumHeight + " px."
                );
            }

        } catch (IOException e) {

            throw new IllegalArgumentException(
                    imageType + " could not be read as a valid image.",
                    e
            );
        }
    }
}
