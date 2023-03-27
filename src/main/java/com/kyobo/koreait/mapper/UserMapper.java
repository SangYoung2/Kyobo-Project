package com.kyobo.koreait.mapper;

import com.kyobo.koreait.domain.dtos.CartDTO;
import com.kyobo.koreait.domain.dtos.HeartDTO;
import com.kyobo.koreait.domain.dtos.OrderDTO;
import com.kyobo.koreait.domain.dtos.UserDTO;
import com.kyobo.koreait.domain.vos.*;
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

    boolean modify_cart_book_count(CartVO cartVO);

    boolean modify_book_count_in_cart_by_count(List<CartVO> cartVOS);

    boolean delete_book_in_cart(List<CartVO> cartVOS);

    boolean insert_books_in_heart(List<HeartDTO> heartDTOS);

    List<BookVO> get_book_in_heart(String userEmail);

    boolean delete_book_in_heart(List<HeartVO> heartVOS);

    // 결제 내역 가져오기
    List<PaymentVO> get_payment(String userEmail);

    //  주문 내역 가져오기
    List<CartDTO> get_order(String orderNo);

    // 결제 내역 추가하기
    boolean insert_payment(PaymentVO paymentVO);

    // 주문 내역 추가하기
    boolean insert_order(List<CartVO> cartVOS);

}
