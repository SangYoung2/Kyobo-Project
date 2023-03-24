package com.kyobo.koreait.domain.vos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO {
    private int no;
    private int orderNo;
    private String bookISBN;
}
