package com.kyobo.koreait.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private String bookISBN;
    private int no;
    private int bookCount;
    private String title;
    private int price;
}
