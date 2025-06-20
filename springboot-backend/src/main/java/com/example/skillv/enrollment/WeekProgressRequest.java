package com.example.skillv.enrollment;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WeekProgressRequest {
    private int week;
    private boolean completed;
}