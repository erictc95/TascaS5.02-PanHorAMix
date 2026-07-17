package com.panhoramix.backend.exception;

public class MediaNotFoundException extends RuntimeException {

    public MediaNotFoundException(Long id) {
        super("Media with id " + id + " not found.");
    }

}
