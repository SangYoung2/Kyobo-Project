package com.kyobo.koreait.domain.vos.dtos;

import com.kyobo.koreait.domain.vos.BookVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadBookDTO {
    private MultipartFile mainImageFile;
    private MultipartFile contentsImageFile;
    private BookVO bookVO;
}
