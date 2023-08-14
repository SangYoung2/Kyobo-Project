package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.vos.BookVO;
import com.kyobo.koreait.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    AdminMapper adminMapper;

    public List<BookVO> get_all_books(){return adminMapper.get_all_books();}

    public void insert_new_book(BookVO bookVO){adminMapper.insert_new_book(bookVO);}


}
