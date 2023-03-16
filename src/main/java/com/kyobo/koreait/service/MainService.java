package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.vos.BookVO;
import com.kyobo.koreait.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MainService {
    @Autowired
    MainMapper mainMapper;

    public List<BookVO> get_all_books(){return mainMapper.get_all_books();}

    public boolean insert_cart(List<BookVO> bookVOS){
        return mainMapper.insert_cart(bookVOS);
    }
}
