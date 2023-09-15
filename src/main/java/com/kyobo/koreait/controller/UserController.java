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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

//    로그아웃 페이지로 이동하여 로그아웃 버튼을 눌러 로그아웃 하는 방식
//    @GetMapping("/logout")
//    public void logout(){log.info("===== 유저 로그아웃 =====");}

    @GetMapping("/logout")
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        // SpringSecurity를 이용하여 로그아웃을 할 시 POST요청을 해야하지만  아래 방법으로 GET방법으로 우회하여 사용할수있다.
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return "redirect:/";
    }

    @GetMapping("/register")
    public void register_user(){}

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

    @PreAuthorize("isAuthenticated()")
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
        log.info("===== GET_BOOKS_IN_HEART =====");
        return userService.get_book_in_heart(userDetails.getUsername());
    }

    @ResponseBody
    @DeleteMapping("/heart")
    public boolean delete_books_in_heart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<HeartVO> heartVOS
    ){
        log.info("===== DELETE CART =====");
        log.info("heartVOS:" + heartVOS);
        return userService.delete_book_in_heart(userDetails.getUsername(), heartVOS);
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
        return "/user/myPage/order/main";
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myPage/order/main")
    public void myPage_order(
            @AuthenticationPrincipal UserDetails userDetails,
            Model model
    ){
        log.info("===== myPage_order =====");
        List<PaymentVO> paymentVOS = userService.get_payment(userDetails.getUsername());
        log.info("paymentVOS = " + paymentVOS);
        model.addAttribute("paymentVOS", paymentVOS);
    }

    @ResponseBody
    @PermitAll
    @PostMapping("/myPage/order/detail/{orderNo}")
    public List<CartDTO> get_order_detail(@PathVariable String orderNo){
        log.info("===== get_detail_order =====");
        return userService.get_order(orderNo);
    }
}
