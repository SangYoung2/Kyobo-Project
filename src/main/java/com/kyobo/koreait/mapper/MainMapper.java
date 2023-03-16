package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.vos.BookVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MainMapper {
    List<BookVO> get_all_books();
    boolean insert_cart(List<BookVO> bookVOS);
}
