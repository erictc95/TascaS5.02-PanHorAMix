package com.panhoramix.backend.exception;

public class UserNotAuthenticatedException
        extends RuntimeException {

    public UserNotAuthenticatedException() {

        super("No authenticated user found.");

    }

}
