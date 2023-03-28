package com.kyobo.koreait.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.mail.Multipart;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileDTO {
    private List<Multipart> files;
}
