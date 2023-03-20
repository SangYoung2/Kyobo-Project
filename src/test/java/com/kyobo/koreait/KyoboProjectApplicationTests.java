package com.kyobo.koreait;

import com.kyobo.koreait.domain.vos.CartVO;
import com.kyobo.koreait.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class KyoboProjectApplicationTests {
    @Autowired
    UserMapper userMapper;

    @Test
    void contextLoads() {
        CartVO vo = new CartVO();
        vo.setUserEmail("test");
        vo.setBookISBN("11");
        vo.setBookCount(3);

        userMapper.modify_cart_book_count(vo);
    }

}
