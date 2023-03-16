package com.kyobo.koreait.domain.vos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BookVO {
    private String ISBN;
    private String title;
    private String contents;
    private String author;
    private String publisher;
    private String introduce;
    private int price;
    private int rating;
}
