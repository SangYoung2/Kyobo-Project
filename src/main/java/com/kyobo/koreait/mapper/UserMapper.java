package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.dtos.CartDTO;
import com.kyobo.koreait.domain.dtos.HeartDTO;
import com.kyobo.koreait.domain.dtos.UserDTO;
import com.kyobo.koreait.domain.vos.CartVO;
import com.kyobo.koreait.domain.vos.UserVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM `user_tbl` WHERE `email` = #{email}")
    UserVO get_user(String Email);

    @Insert("INSERT INTO `user_tbl` VALUES (#{email}, #{password}, #{name}, #{birth}, #{phone}, default)")
    void register_user(UserVO userVO);

    List<CartDTO> get_cart(String userEmail);
    boolean insert_books_in_cart(List<CartVO> cartVOS);

    boolean insert_books_in_heart(List<HeartDTO> heartDTOS);
}
