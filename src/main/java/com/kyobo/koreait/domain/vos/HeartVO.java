package com.kyobo.koreait.domain.vos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeartVO {
    private int no;
    private String userEmail;
    private String bookISBN;
}
