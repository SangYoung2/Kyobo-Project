package com.kyobo.koreait.controller;

import com.kyobo.koreait.domain.vos.dtos.UploadBookDTO;
import com.kyobo.koreait.domain.vos.BookVO;
import com.kyobo.koreait.service.AdminService;
import com.kyobo.koreait.service.MainService;
import com.kyobo.koreait.util.S3Uploader;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.PermitAll;
import java.awt.print.Book;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Log4j2
@Controller
@RequestMapping("admin")
public class AdminController {
    @Autowired
    private S3Uploader s3Uploader;
    @Autowired
    private AdminService adminService;
    @Autowired
    private MainService mainService;

    @Value("${com.kyobo.koreait.upload.path}")
    private String uploadPath;

    @PermitAll
    @GetMapping("/upload")
    public void upload_book(){
       log.info("===== upload 화면 =====");
    }

    @PermitAll
    @PostMapping("/upload")
    public void upload_book_data(UploadBookDTO uploadBookDTO) throws Exception{
        log.info("===== upload_book_data - 게시물 작성 =====");
        log.info("uploadBookDTO ==> " + uploadBookDTO);
        BookVO bookVO = uploadBookDTO.getBookVO();
        log.info("getBookVO = " + bookVO);
        adminService.insert_new_book(bookVO);
        List<String> fileNames = save_book_data(uploadBookDTO.getMainImageFile(), uploadBookDTO.getContentsImageFile(), bookVO.getISBN());
        List<String> uploadImageUrls = s3Uploader.upload(bookVO.getISBN(), uploadPath, fileNames);
        log.info(uploadImageUrls);
    }

    private List<String> save_book_data(MultipartFile mainImageFile, MultipartFile contentsImageFile , String dirName) {
        File saveDirObj = new File(uploadPath, dirName);
        // 해당 ISBN 폴더가 존재하지 않는다면 폴더를 만들어준다
        if(!saveDirObj.exists()){
            saveDirObj.mkdir();
        }

        // 유저가 올린 파일의 확장자 형식을 가져온다.
        String mainImageFileContents = mainImageFile.getContentType().split("/")[1];
        String contentsImageFileContents = contentsImageFile.getContentType().split("/")[1];

        // 유저가 올린 파일을 저장할 경로를 지정하여 파일 객체 생성
        File saveFileObj = new File(saveDirObj, "main." + mainImageFileContents);
        File contentsFileObj = new File(saveDirObj, "contents." + contentsImageFileContents);
        // 해당 파일 객체를 실제 위치에 write 한다.
        try {
            mainImageFile.transferTo(saveFileObj);
            contentsImageFile.transferTo(contentsFileObj);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return Arrays.asList("main." + mainImageFileContents, "contents." + contentsImageFileContents);
    }

    @GetMapping("/manage")
    public void get_manage(){
        log.info("===== ManagePage =====");
    }

    @ResponseBody
    @GetMapping("/books")
    public List<BookVO> get_all_books(){
        return adminService.get_all_books();
    }

    @ResponseBody
    @DeleteMapping("/manage")
    public boolean delete_books_data(String bookISBN){
        return adminService.delete_book_data(bookISBN);
    }

    @GetMapping("/bookmodify")
    public void get_book_modify(String bookISBN, Model model){
        log.info("===== bookModify Page =====");
        model.addAttribute("bookVO", mainService.get_book_by_isbn(bookISBN));
    }
}
