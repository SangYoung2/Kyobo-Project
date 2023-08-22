/* Form */
const ResisterForm = document.forms.item(0)
/* Email */
const UserEmail = document.querySelector("input[name='email']");
/* Password */
const Password = document.querySelector("input[name='password']")
const PasswordConfirm = document.querySelector("input[name='password_confirm']")
let passwordValue = Password.value
let passwordConfirmValue = PasswordConfirm.value
/* Name */
const UserName = document.querySelector("input[name = 'name']")
/* Brith */
const Birth = document.querySelector("input[name='birth']")
const Year = document.getElementById("year");
const Month = document.getElementById("month");
const Day = document.getElementById("day");
/* Btn */
const RegisterBtn = document.getElementById("register_btn")
const BackBtn = document.getElementById("back_btn")
/* Phone */
const Phone = document.getElementById("phone")
const PhoneValue = document.querySelector('input[name="phone"]')
const PhoneAuth = document.querySelector('input[name="phone_auth"]')
/* Check */
let EmailCheck = false;
let PasswordCheck = false;
let PhoneCheck = false;

function create_user_month_value(){
    for (let i = 1; i <= 12; i++) {
        i = i >= 10 ? i : '0' + i;
        Month.insertAdjacentHTML('beforeend', '' +
            `<option value="${i}">${i}</option>`)
    }
}

function create_user_day_value(){
    for (let i = 1; i <= 31; i++) {
        i = i >= 10 ? i : '0' + i;
        Day.insertAdjacentHTML('beforeend', '' +
            `<option value="${i}">${i}</option>`)
    }
}

function phoneNumber_authenticate(){
    fetch('/api/sms/' + Phone.value)
        .then(value => {
            if(value.ok){
                console.log(value)
                return value.text();
            }
        })
        .then(value => {
            console.log(value);
        })
        .catch(reason => {console.log(reason)})
}

function phoneNumber_authenticate_confirm(){
    fetch(`/api/sms?authNumber=${PhoneAuth.value}`)
        .then(value => {
            if(value.ok){
                return value.text();
            }
        })
        .then(value => {
            console.log(value)
            PhoneCheck = true;
        })
        .catch(reason => {console.log(reason)})
}

function email_authenticated(){
    fetch(`/api/user/${UserEmail.value}`)
        .then(value => value.text())
        .then(value => {
            if(value === 'true'){
                alert('유저가 존재하기 때문에 불가능!')
                EmailCheck = false;
            }else {
                alert('그 아이디 사용가능!')
                EmailCheck = true;
            }
        })
        .catch(reason => {console.log(reason)})
}

Password.onchange = () => {
    passwordValue = Password.value;
}

PasswordConfirm.onchange = () => {
    passwordConfirmValue = PasswordConfirm.value;
    console.log(passwordConfirmValue)
    if(passwordValue === passwordConfirmValue) {
        console.log("true")
        PasswordCheck = true;
    }
    else {
        console.log("false")
        PasswordCheck = false;
    }
}

// 회원가입 버튼 눌렀을 때 (do register)
RegisterBtn.onclick = () => {
    if(UserEmail.value !== "" && Password.value !== "" && PasswordConfirm.value !== "" && UserName.value !== ""){
        if(EmailCheck && PasswordCheck && PhoneCheck){
            Birth.value = Year.value + "-" +  Month.value + "-" + Day.value;
            const userPhoneValue = Phone.value;
            const userPhoneLength = Phone.value.length;
            PhoneValue.value =
                userPhoneLength === 11 ?
                    userPhoneValue.substring(0, 3) + '-' + userPhoneValue.substring(3, 7) + '-' + userPhoneValue.substring(7, 11) :
                    userPhoneValue.substring(0, 3) + '-' + userPhoneValue.substring(3, 6) + '-' + userPhoneValue.substring(6, 10);
            ResisterForm.submit();
        }
        else if(!EmailCheck){
            alert("이메일 확인을 해주세요!")
        }
        else if(!PasswordCheck){
            alert("패스워드 확인을 해주세요!")
        }
        else {
            alert("핸드폰 인증번호 확인을 해주세요!")
        }
    }
    else {
        alert("빈칸없이 모든 정보를 입력해주세요")
    }
}

// 돌아가기 버튼 눌렀을 때 (do back)
BackBtn.onclick = () => {
    const cancelConfirm = confirm('정말로 회원가입을 취소하고 돌아가시겠습니까?');
    if(cancelConfirm) {
        location.href = '/user/login';
    }}

create_user_month_value();
create_user_day_value();
