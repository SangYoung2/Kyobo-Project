package com.kyobo.koreait.service;

import com.kyobo.koreait.domain.vos.dtos.BookDTO;
import com.kyobo.koreait.domain.vos.BookVO;
import com.kyobo.koreait.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MainService {
    @Autowired
    MainMapper mainMapper;

    public BookVO get_book_by_isbn(String bookISBN) { return mainMapper.get_book_by_isbn(bookISBN); }

    public BookDTO get_all_books_by_condition(
            String searchKeyword,
            String order,
            int pagePerArticle,
            int nowPage
    ){
        //DB 조회 시 해당 keyword를 가지는 목록만 가져오며, 설정한 순번으로 가져온다
        List<BookVO> bookVOS = mainMapper.get_all_books_by_condition(searchKeyword, order);
        //전체 가져온 목록에서 페이지에서 보여줄 친구만 따로 정제한다
        BookDTO bookDTO = new BookDTO(bookVOS, pagePerArticle, nowPage);
        //현재 페이지에 보여줄 정보(리스트)만 반환
        return bookDTO;
    }

}
