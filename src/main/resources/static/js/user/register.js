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

// 회원정보 입력 시 올바르게 입력하는지 확인하는 정규식
UserEmail.onchange = () => {
    const idReg = RegExp(/^[a-zA-Z\d]{6,12}$/);
    const comment = UserEmail.parentElement.parentElement.querySelector('span')

    if (UserEmail.value.length === 0 || UserEmail.value === "" || RegExp(/\s/).test(UserEmail.value)) {
        comment.innerText = "아이디를 입력해주세요."
        comment.style.color = "red";
    } else if (!idReg.test(UserEmail.value)) {
        comment.innerText = "6~12자리의 영문자, 숫자로 입력해주세요."
        comment.style.color = "red";
    } else {
        email_authenticated(UserEmail.value)
    }

    function email_authenticated(userEmail){
        fetch(`/api/user/` + userEmail)
            .then(value => value.text())
            .then(value => {
                if(value === 'true'){
                    comment.innerText = "아이디가 이미 존재합니다."
                    comment.style.color = "red";
                    EmailCheck = false;
                }else {
                    comment.innerText = "사용가능한 아이디입니다."
                    comment.style.color = "green"
                    EmailCheck = true;
                }
            })
            .catch(reason => {console.log(reason)})
    }
}

Password.onchange = () => {
    const pwReg = RegExp(/^[a-zA-Z\d!@#]{4,20}$/);
    const comment = Password.nextElementSibling;

    if(Password.value.length === 0 || Password.value === "" || RegExp(/\s/g).test(Password.value)) {
        comment.innerText = "비밀번호를 입력해주세요."
        comment.style.color = "red"
    }
    else if(!pwReg.test(Password.value)){
        comment.innerText = "4~20자리의 영문자, 숫자, 특수문자(!,@,#)로 입력해주세요"
        comment.style.color = "red"
    }
    else {
        comment.innerText = "올바르게 입력하셨습니다."
        comment.style.color = "green"
    }
    passwordValue = Password.value;
}

PasswordConfirm.onchange = () => {
    passwordConfirmValue = PasswordConfirm.value;
    const comment = PasswordConfirm.nextElementSibling;

    if(passwordValue === passwordConfirmValue) {
        comment.innerText = "비밀번호가 일치합니다.";
        comment.style.color = "green";
        PasswordCheck = true;
    }
    else {
        comment.innerText = "비밀번호가 일치하지 않습니다.";
        comment.style.color = "red";
        PasswordCheck = false;
    }
}

UserName.onchange = () => {
    const nameReg = RegExp(/^[가-힣a-zA-Z]{2,15}$/);
    const comment = UserName.nextElementSibling;

    if(UserName.value.length === 0 || UserName.value === "" || RegExp(/\s/).test(UserName.value)){
        comment.innerText = "이름을 입력해주세요."
        comment.style.color = "red";
    }
    else if(!nameReg.test(UserName.value)){
        comment.innerText = "2~15자리의 한글, 영문자로 입력해주세요."
        comment.style.color = "red";
    }
    else {
        comment.innerText = "올바르게 입력하셨습니다."
        comment.style.color = "green"
    }
}

Year.onchange = () => {
    const yearReg = /\d{4}/
    const comment = Year.parentElement.nextElementSibling;
    console.log(typeof parseInt(Year.value))

    if(Year.value.length === 0 || Year.value === "" || RegExp(/\s/g).test(Year.value)) {
        comment.innerText = "년도를 입력해주세요.";
        comment.style.color = "red";
    }
    else if(!yearReg.test(Year.value)) {
        comment.innerText = "1900~2023년 사이로 숫자 4자리로 입력해주세요.";
        comment.style.color = "red";
    }
    else if(!(Year.value <= 2023 && Year.value >= 1900)) {
        comment.innerText = "1900~2023년 사이로 숫자 4자리로 입력해주세요.";
        comment.style.color = "red";
    }
    else {
        comment.innerText = "올바르게 입력하셨습니다.";
        comment.style.color = "green";
    }
}

Phone.onchange = () => {
    const phoneReg = /\d{10,11}/g;
    const comment = Phone.parentElement.nextElementSibling.nextElementSibling;

    if(Phone.value.length === 0 || Phone.value === "" || RegExp(/\s/g).test(Phone.value)) {
        comment.innerText = "핸드폰 번호를 입력해주세요"
        comment.style.color = "red";
    }
    else if(!phoneReg.test(Phone.value)) {
        comment.innerText = "'-'를 뺀 휴대번호 10~11자리를 입력해주세요"
        comment.style.color = "red";
    }
    else if(!Phone.value.length >= 10) {
        comment.innerText = "'-'를 뺀 휴대번호 10~11자리를 입력해주세요"
        comment.style.color = "red";
    }
    else {
        comment.innerText = "올바르게 입력하셨습니다."
        comment.style.color = "green";
    }
}

// 회원가입 버튼 눌렀을 때 (do register)
RegisterBtn.onclick = () => {
    Birth.value = Year.value + "-" +  Month.value + "-" + Day.value;
    const userPhoneValue = Phone.value;
    const userPhoneLength = Phone.value.length;
    PhoneValue.value =
        userPhoneLength === 11 ?
            userPhoneValue.substring(0, 3) + '-' + userPhoneValue.substring(3, 7) + '-' + userPhoneValue.substring(7, 11) :
            userPhoneValue.substring(0, 3) + '-' + userPhoneValue.substring(3, 6) + '-' + userPhoneValue.substring(6, 10);
    if(UserEmail.value !== "" && Password.value !== "" && PasswordConfirm.value !== ""
        && UserName.value !== "" && Birth.value !== "" && PhoneValue.value !== ""){
        if(EmailCheck && PasswordCheck && PhoneCheck){
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
    const cancelConfirm = confirm('회원가입창을 나가시겠습니까?');
    if(cancelConfirm) {
        location.href = '/user/login';
    }}

create_user_month_value();
create_user_day_value();
