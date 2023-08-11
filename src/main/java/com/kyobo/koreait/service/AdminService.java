package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.vos.BookVO;
import com.kyobo.koreait.mapper.AdminMapper;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    AdminMapper adminMapper;

    public boolean insert_new_book(BookVO bookVO){
        return adminMapper.insert_new_book(bookVO);
    }
}
