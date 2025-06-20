package com.example.skillv.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
//req
@Data
@AllArgsConstructor
@Builder
public class UserRequest {
    @NotBlank String email;
}
