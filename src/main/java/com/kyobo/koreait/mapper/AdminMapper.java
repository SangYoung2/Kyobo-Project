package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.vos.BookVO;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminMapper {
    @Insert("INSERT INTO `book_tbl` VALUES (#{ISBN}, #{title}, #{contents}, #{author}, #{publisher}, #{introduce}, #{price}, default, default)")
    boolean insert_new_book(BookVO bookVO);
}
