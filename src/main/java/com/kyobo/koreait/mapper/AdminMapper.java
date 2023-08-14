package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.vos.BookVO;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AdminMapper {
    @Select("SELECT * FROM `book_tbl`")
    List<BookVO> get_all_books();

    @Insert("INSERT INTO `book_tbl` VALUES (#{ISBN}, #{title}, #{contents}, #{author}, #{publisher}, #{introduce}, #{price}, default, default)")
    void insert_new_book(BookVO bookVO);

    @Delete("DELETE FROM `book_tbl` WHERE ISBN = #{ISBN}")
    boolean delete_book_data(String bookISBN);
}
