package com.kyobo.koreait.domain.vos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVO {
    private int orderNo;
    private String userEmail;
    private Date orderTime;
    private int paymentAmount;
}
