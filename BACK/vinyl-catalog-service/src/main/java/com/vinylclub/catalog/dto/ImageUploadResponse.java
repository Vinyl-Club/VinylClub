package com.vinylclub.catalog.dto;

public class ImageUploadResponse {
    private boolean success;
    private String message;
    private Long imageId;

    // Builders
    public ImageUploadResponse() {}

    public ImageUploadResponse(boolean success, String message, Long imageId) {
        this.success = success;
        this.message = message;
        this.imageId = imageId;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }
}