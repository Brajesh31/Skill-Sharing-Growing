package com.example.skillv.util;

import com.example.skillv.exception.BadRequestException;
import com.example.skillv.storage.AzureBlobStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class VideoThumbnailService {

    @Value("${video.thumbnail.ffmpeg.path}")
    private String ffmpegPath;

    @Value("${video.thumbnail.temp.dir}")
    private String tempDirectory;

    private final AzureBlobStorageService storageService;

    public VideoThumbnailService(AzureBlobStorageService storageService) {
        this.storageService = storageService;
    }

    public String generateAndUploadThumbnail(MultipartFile videoFile, int videoDuration) {
        try {
            // Create temporary files for video and thumbnail
            String uniqueId = UUID.randomUUID().toString();
            String videoFileExt = getFileExtension(videoFile.getOriginalFilename());
            String tempVideoPath = tempDirectory + "/" + uniqueId + "_video." + videoFileExt;
            String tempThumbnailPath = tempDirectory + "/" + uniqueId + "_thumbnail.jpg";

            // Write video to temp file
            File tempVideoFile = new File(tempVideoPath);
            videoFile.transferTo(tempVideoFile);

            // Calculate timestamp for thumbnail (1/3 of the way through the video or at 5 seconds)
            int thumbnailTimeSeconds = Math.min(videoDuration / 3, 5);

            // Generate thumbnail using FFmpeg
            boolean success = generateThumbnail(tempVideoPath, tempThumbnailPath, thumbnailTimeSeconds);

            if (!success) {
                throw new BadRequestException("Failed to generate thumbnail from video");
            }

            // Upload the thumbnail to Azure Blob Storage
            File thumbnailFile = new File(tempThumbnailPath);
            String thumbnailUrl = storageService.uploadFile(
                    new MockMultipartFile(
                            "thumbnail.jpg",
                            "thumbnail.jpg",
                            "image/jpeg",
                            Files.readAllBytes(thumbnailFile.toPath())
                    ),
                    uniqueId + "_thumbnail.jpg"
            );

            // Clean up temp files
            tempVideoFile.delete();
            thumbnailFile.delete();

            return thumbnailUrl;

        } catch (IOException e) {
            throw new RuntimeException("Error processing video for thumbnail: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts a frame from the video at the specified time to create a thumbnail
     */
    private boolean generateThumbnail(String videoPath, String outputPath, int timeSeconds) {
        try {
            // FFmpeg command to extract a frame at the specified time
            ProcessBuilder processBuilder = new ProcessBuilder(
                    ffmpegPath,
                    "-i", videoPath,
                    "-ss", String.valueOf(timeSeconds),
                    "-vframes", "1",
                    "-q:v", "2",
                    outputPath
            );

            Process process = processBuilder.start();

            // Capture error output for debugging
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                System.err.println("FFmpeg error: " + errorOutput);
                return false;
            }

            // Check if thumbnail file was created
            return Files.exists(Path.of(outputPath));

        } catch (IOException | InterruptedException e) {
            System.err.println("Error generating thumbnail: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extracts the file extension from a filename
     */
    private String getFileExtension(String filename) {
        if (filename == null) return "mp4";
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "mp4" : filename.substring(dotIndex + 1);
    }
}
