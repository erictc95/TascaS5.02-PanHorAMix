package com.panhoramix.backend.entity.enums;

import lombok.Getter;

@Getter
public enum StorageFolder {

    IMAGES("images"),
    VIDEOS("videos"),
    THUMBNAILS("thumbnails"),
    AVATARS("avatars"),
    BANNERS("banners");

    private final String folder;

    StorageFolder(String folder) {
        this.folder = folder;
    }

}
