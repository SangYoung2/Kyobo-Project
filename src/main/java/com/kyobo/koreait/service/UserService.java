package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.dtos.CartDTO;
import com.kyobo.koreait.domain.dtos.HeartDTO;
import com.kyobo.koreait.domain.dtos.OrderDTO;
import com.kyobo.koreait.domain.enums.OrderState;
import com.kyobo.koreait.domain.vos.*;
import com.kyobo.koreait.mapper.UserMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Log4j2
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    // 유저를 회원가입시키는 서비스
    public void register_user(UserVO userVO){
        userVO.setPassword(passwordEncoder.encode(userVO.getPassword()));
        userMapper.register_user(userVO);
    }

    public List<CartDTO> get_cart(String userEmail){
        return userMapper.get_cart(userEmail);
    };

    public boolean insert_books_in_cart(UserDetails userDetails, List<CartVO> cartVOS){
//        forEach 방식
//        for(CartDTO cartDTO : cartDTOS){
//            cartDTO.setUserEmail(userDetails.getUsername());
//        }

        cartVOS.parallelStream().forEach(cartVO -> {
            cartVO.setUserEmail(userDetails.getUsername());
        });

        return userMapper.insert_books_in_cart(cartVOS);
    }

    public boolean modify_cart_book_count(String userEmail, CartVO cartVO){
        cartVO.setUserEmail(userEmail);
        return userMapper.modify_cart_book_count(cartVO);
    }

    public boolean modify_book_count_in_cart_by_count(String userEmail, List<CartVO> cartVOS, OrderState orderState){
        cartVOS.parallelStream().forEach(cartVO -> cartVO.setUserEmail(userEmail));
        if(orderState == OrderState.ADD){
            cartVOS.parallelStream().forEach(cartVO -> cartVO.setBookCount(-cartVO.getBookCount()));
        }
        return userMapper.modify_book_count_in_cart_by_count(cartVOS);
    }

    public boolean delete_book_in_cart(String userEmail, List<CartVO> cartVOS){
        cartVOS.parallelStream().forEach(vo -> vo.setUserEmail(userEmail));
        return userMapper.delete_book_in_cart(cartVOS);
    }

    public boolean insert_books_in_heart(UserDetails userDetails, List<HeartDTO> heartDTOS){
        heartDTOS.parallelStream().forEach(heartDTO -> {
            heartDTO.setUserEmail(userDetails.getUsername());
        });

        return userMapper.insert_books_in_heart(heartDTOS);
    }

    public List<BookVO> get_book_in_heart(String userEmail){
        return userMapper.get_book_in_heart(userEmail);
    }

    public boolean delete_book_in_heart(UserDetails userDetails, List<HeartVO> heartVOS) {
        heartVOS.parallelStream().forEach(heartVO -> heartVO.setUserEmail(userDetails.getUsername()));
        return userMapper.delete_book_in_heart(heartVOS);
    }

    // 결제 내역 + 주문 내역 추가하기 (결제가 제대로 이루어졌다면 주문 내역에 추가)
    @Transactional // 오류 발생시 처음 상태로 롤백을 시킨다.
    public boolean insert_payment_order(String userEmail, OrderDTO orderDTO){
        // 주문 유저 정보 설정하기
        PaymentVO paymentVO = orderDTO.getPaymentVO();
        paymentVO.setUserEmail(userEmail);
        List<CartVO> cartVOS = orderDTO.getCartVOS();
        // 결제 내역에 추가하기
        boolean paymentSucceed =  userMapper.insert_payment(paymentVO);
        // 주문 내역에 추가하기
        boolean orderSucceed =  userMapper.insert_order(cartVOS);

        boolean modifySucceed = modify_book_count_in_cart_by_count(userEmail, cartVOS, OrderState.DELETE);

        // 장바구니에 있는 내역 삭제하기
        boolean removeSucceed = delete_book_in_cart(userEmail, cartVOS);
        return paymentSucceed && orderSucceed;
    }

}
