package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.vos.BookVO;

import com.kyobo.koreait.domain.vos.UserVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AdminMapper {
    @Select("SELECT * FROM `book_tbl`")
    List<BookVO> get_all_books();

    @Insert("INSERT INTO `book_tbl` VALUES (#{ISBN}, #{title}, #{contents}, #{author}, #{publisher}, #{introduce}, #{price}, default, default)")
    void insert_new_book(BookVO bookVO);

    @Delete("DELETE FROM `book_tbl` WHERE ISBN = #{ISBN}")
    boolean delete_book_data(String bookISBN);

    @Update("UPDATE `book_tbl` SET `title` =  #{title}, `contents` = #{contents}, `author` = #{author}, `publisher` = #{publisher}, `introduce` = #{introduce}, `price` = #{price} WHERE `ISBN` = #{ISBN}")
    void modify_book_data(BookVO bookVO);

    @Select("SELECT * FROM `user_tbl`")
    List<UserVO> get_all_users();

    @Delete("DELETE FROM `user_tbl` WHERE email = #{email}")
    boolean delete_user_data(String userEmail);
}
