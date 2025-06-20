package com.example.skillv.storage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.PublicAccessType;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
//
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Service
public class AzureBlobStorageService {

    private final BlobServiceClient blobServiceClient;
    private final BlobContainerClient containerClient;
    private final boolean usePublicContainer;
    private final long maxFileSizeBytes;

    public AzureBlobStorageService(
            @Value("${azure.storage.connection-string}") String connectionString,
            @Value("${azure.storage.container-name}") String containerName,
            @Value("${azure.storage.use-public-container:true}") boolean usePublicContainer,
            @Value("${spring.servlet.multipart.max-file-size:10MB}") String maxFileSize) {

        this.blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
        this.usePublicContainer = usePublicContainer;

        // Parse max file size - assumes format like "10MB"
        this.maxFileSizeBytes = parseFileSize(maxFileSize);

        // Create a container if it doesn't exist
        if (!containerClient.exists()) {
            containerClient.create();

            // Set the container's access level to public if specified
            if (usePublicContainer) {
                containerClient.setAccessPolicy(PublicAccessType.BLOB, null);
            }
        }
    }

    // Helper method to parse file size from string like "10MB" to bytes
    private long parseFileSize(String sizeString) {
        sizeString = sizeString.toUpperCase();
        long multiplier = 1;

        if (sizeString.endsWith("KB")) {
            multiplier = 1024;
            sizeString = sizeString.substring(0, sizeString.length() - 2);
        } else if (sizeString.endsWith("MB")) {
            multiplier = 1024 * 1024;
            sizeString = sizeString.substring(0, sizeString.length() - 2);
        } else if (sizeString.endsWith("GB")) {
            multiplier = 1024 * 1024 * 1024;
            sizeString = sizeString.substring(0, sizeString.length() - 2);
        } else if (sizeString.endsWith("B")) {
            sizeString = sizeString.substring(0, sizeString.length() - 1);
        }

        return Long.parseLong(sizeString.trim()) * multiplier;
    }

    public String uploadFile(MultipartFile file, String fileName) throws IOException {
        // Check file size before attempting upload
        if (file.getSize() > maxFileSizeBytes) {
            throw new MaxUploadSizeExceededException(maxFileSizeBytes);
        }

        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        BlobClient blobClient = containerClient.getBlobClient(uniqueFileName);

        // Set the content type based on a file type
        BlobHttpHeaders headers = new BlobHttpHeaders()
                .setContentType(file.getContentType());

        // Upload the file with headers
        blobClient.upload(file.getInputStream(), file.getSize(), true);
        blobClient.setHttpHeaders(headers);

        // If using public container, return the direct URL
        if (usePublicContainer) {
            return blobClient.getBlobUrl();
        } else {
            // Otherwise, generate a SAS token for read access
            return generateSasUrl(blobClient);
        }
    }

    private String generateSasUrl(BlobClient blobClient) {
        // Create a SAS token that's valid for 1 year
        OffsetDateTime expiryTime = OffsetDateTime.now(ZoneOffset.UTC).plusYears(1);

        BlobSasPermission permission = new BlobSasPermission()
                .setReadPermission(true);

        BlobServiceSasSignatureValues values = new BlobServiceSasSignatureValues(expiryTime, permission)
                .setStartTime(OffsetDateTime.now(ZoneOffset.UTC));

        // Generate the SAS token
        String sasToken = blobClient.generateSas(values);

        // Return the blob URL with the SAS token
        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    public void deleteFile(String fileUrl) {
        // Extract the blob name from the URL, handling both direct URLs
        // and SAS token URLs
        String blobName;
        if (fileUrl.contains("?")) {
            // SAS token URL
            blobName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1, fileUrl.indexOf("?"));
        } else {
            // Direct URL
            blobName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        }

        BlobClient blobClient = containerClient.getBlobClient(blobName);
        blobClient.deleteIfExists();
    }
}