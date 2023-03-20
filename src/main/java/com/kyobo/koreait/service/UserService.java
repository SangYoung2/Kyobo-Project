package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.dtos.CartDTO;
import com.kyobo.koreait.domain.dtos.HeartDTO;
import com.kyobo.koreait.domain.vos.CartVO;
import com.kyobo.koreait.domain.vos.UserVO;
import com.kyobo.koreait.mapper.UserMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public boolean insert_books_in_heart(UserDetails userDetails, List<HeartDTO> heartDTOS){

        heartDTOS.parallelStream().forEach(heartDTO -> {
            heartDTO.setUserEmail(userDetails.getUsername());
        });

        return userMapper.insert_books_in_heart(heartDTOS);
    }

    public boolean modify_cart_book_count(String userEmail, CartVO cartVO){
        cartVO.setUserEmail(userEmail);
        return userMapper.modify_cart_book_count(cartVO);
    }

}
