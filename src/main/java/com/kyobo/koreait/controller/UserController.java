package com.kyobo.koreait.controller;

import com.kyobo.koreait.domain.vos.dtos.CartDTO;
import com.kyobo.koreait.domain.vos.dtos.HeartDTO;
import com.kyobo.koreait.domain.vos.dtos.OrderDTO;
import com.kyobo.koreait.domain.vos.*;
import com.kyobo.koreait.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Log4j2
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public void login_user() {

    }

    @PostMapping("/login")
    public String login_user_post() {
        return "redirect:/";
    }

    @GetMapping("/logout")
    public void logout(){
        log.info("===== 유저 로그아웃 =====");
    }

    @GetMapping("/register")
    public void register_user(){

    }


    @PostMapping("/register")
    public String register_user(@Validated UserVO userVO,
                                BindingResult bindingResult,
                                HttpSession session
                                ){
        log.info(" ===== register_user =====");
        log.info(" 받아온 userVO => " + userVO);
        if(bindingResult.hasErrors()){
            log.info(" bindingResult에서 에러가 발생하였음 ");
            return "error/main";
        }
        // 인증받은 인증 번호와 중복체크한 유저이메일 (아이디)를 가져온다.
        Boolean phoneAuthenticated = (Boolean) session.getAttribute("phoneAuthenticated"); // 인증이 되었는지 체크
        String authenticateNumber = (String) session.getAttribute("phoneAuthenticatedNumber"); // 휴대폰 번호 일치 체크
        authenticateNumber = authenticateNumber.substring(0,3) + "-" + authenticateNumber.substring(3,7) + "-" + authenticateNumber.substring(7,11);
        String userEmail = (String) session.getAttribute("emailAuthenticated"); // 이메일 일치 체크
        log.info("인증 1 = " +  phoneAuthenticated == null);
        log.info("인증 2 = " +  userEmail == null);
        log.info("인증 3 = " +  !phoneAuthenticated);
        log.info("인증 4 = " +  !userVO.getEmail().equals(userEmail));
        log.info("인증 5 = " +  !userVO.getPhone().equals(authenticateNumber));
        if(phoneAuthenticated == null // 휴대폰 인증을 거치지 않고 왔거나
                || userEmail == null  // 이메일 중복체크를 하지 않았거나
                || !phoneAuthenticated // 인증이 false 이거나 (실패했거나)
                || !userVO.getEmail().equals(userEmail) // 인증받은 이메일과 가입할 이메일이 다르거나
                || !userVO.getPhone().equals(authenticateNumber) // 인증받은 휴대폰과 가입할 휴대폰이 다르거나
                ){

            log.info("에러!");
            return "error/main";
        }
        log.info(" 유저 회원가입을 시도함 ... ");
        userService.register_user(userVO);
        log.info(" => 유저 회원가입이 완료되었음 ");
        return "redirect:/";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myPage/main")
    public void myPage_user(){
        log.info(" ===== user_mypage =====");
    }

    @ResponseBody
    @GetMapping("/cart")
    public List<CartDTO> get_cart(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        log.info(" ===== 장바구니 페이지 (cart) =====");
        log.info(userService.get_cart(userDetails.getUsername()));
        return userService.get_cart(userDetails.getUsername());
    };

    @ResponseBody
    @PostMapping("/cart")
    public boolean insert_cart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<CartVO> cartVOS
    ){
        log.info("===== insert_cart =====");
        log.info("cartDTOS: " + cartVOS);
        return userService.insert_books_in_cart(userDetails, cartVOS);
    }

    @ResponseBody
    @PutMapping("/cart")
    public boolean modify_cart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartVO cartVO
    ){
        log.info("===== PUT CART =====");
        log.info("cartVO: " + cartVO);
        log.info("userDetails: " + userDetails);
        return userService.modify_cart_book_count(userDetails.getUsername(), cartVO);
    }

    @ResponseBody
    @DeleteMapping("/cart")
    public boolean delete_cart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<CartVO> cartVOS
    ){
        log.info("===== DELETE CART =====");
        log.info("cartVOS:" + cartVOS);
        return userService.delete_book_in_cart(userDetails.getUsername(), cartVOS);
    }

    @GetMapping("/myPage/heart")
    public void heart_page(){

    }

    @ResponseBody
    @PostMapping("/heart")
    public boolean insert_heart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<HeartDTO> heartDTOS
    ){
        log.info("===== insert_heart =====");
        log.info("heartDTOS: " + heartDTOS);
        return userService.insert_books_in_heart(userDetails, heartDTOS);
    }

    @ResponseBody
    @GetMapping("/heart")
    public List<BookVO> get_books_in_heart(
            @AuthenticationPrincipal UserDetails userDetails
    ){

        log.info("===== GET_BOOKS_IN_HEART");
        return userService.get_book_in_heart(userDetails.getUsername());
    }

    @ResponseBody
    @DeleteMapping("/heart")
    public boolean delete_books_in_heart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<HeartVO> heartVOS
    ){
        log.info("===== DELETE CART =====");
        log.info("cartVOS:" + heartVOS);
        return userService.delete_book_in_heart(userDetails, heartVOS);
    }

    /*====== 주문 관련 ======*/
    @ResponseBody
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/order")
    public String insert_order(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderDTO orderDTO){
        //현재 로그인된 유저 정보와 javascript에서 받아온 DTO객체 정보를 넘겨줌
        boolean orderResult =  userService.insert_payment_order(userDetails.getUsername(), orderDTO);
        if(!orderResult){
            return "error/main";
        }
        return "main/order";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myPage/order/main")
    public void myPage_order(
            @AuthenticationPrincipal UserDetails userDetails,
            Model model
    ){
        log.info("===== myPage_order =====");
        List<PaymentVO> paymentVOS = userService.get_payment(userDetails.getUsername());
        model.addAttribute("paymentVOS", paymentVOS);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myPage/order/detail/{orderNo}")
    public String myPage_order_detail(
            @PathVariable String orderNo,
            Model model
    ){
        log.info("===== myPage_order =====");
        List<CartDTO> cartDTOS = userService.get_order(orderNo);
        model.addAttribute("cartDTOS", cartDTOS);
        return "user/myPage/order/detail";
    }
}
