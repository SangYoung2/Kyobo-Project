const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const CartBookInfoContainer = document.getElementById('cart_book_info_container')
const OrderContainer = document.getElementById('order_container')
const AllChecked = document.querySelector('.all_checked')
const AllCheckImg = document.querySelector('.all_check_img');
const OrderBtn = document.getElementById('order_btn')

get_cart()

function get_cart(){
    fetch('/user/cart')
        .then(response => response.json())
        .then(value => {
            create_cart_book(value)
            create_order_container(value)
        })
        .catch(reason => console.log(reason))
}

function create_cart_book(cartBooks){
    CartBookInfoContainer.innerHTML = '';
    for (const cartBook of cartBooks) {
        CartBookInfoContainer.insertAdjacentHTML('beforeend',
            `<div class="cart_book_info">\n 
                            <div class="cart_book_info_left">\n
                                <input type="checkbox" name="check" hidden>\n
                                <i class="fa-regular fa-circle-check check_img"></i>\n
                                <input type="hidden" name="bookISBN" value="${cartBook.bookISBN}">\n 
                                <img class="book_img" src="https://kyobo-s3-bucket.s3.ap-northeast-2.amazonaws.com/img/book/${cartBook.bookISBN}/main.jpg" alt="책이미지">\n 
                                <div class="book_common_info">\n 
                                    <span class="title">${cartBook.title}</span><br/>\n 
                                    <span class="price">${cartBook.price}원</span>\n 
                                </div>\n 
                            </div>\n 
                            <div class="cart_book_info_right">\n 
                                <div class="book_price_container">\n 
                                    <b class="a">${cartBook.price * cartBook.bookCount}원</b>\n 
                                    <div class="book_count">\n 
                                        <i class="fa-solid fa-plus" onclick="modify_cart(this, '+')"></i>\n 
                                        <input class="book_count_value" type="text" value="${cartBook.bookCount}" name="bookCount">\n 
                                        <i class="fa-solid fa-minus" onclick="modify_cart(this, '-')"></i>\n 
                                    </div>\n 
                                </div>\n 
                           </div>\n 
                        </div>\n`)
    }
}

function create_order_container(cartBooks){
    OrderContainer.innerHTML = '';
    const CheckImg = document.querySelectorAll(".check_img")
    const bookArray = {
        price : [],
        bookCount : []
    }
    let TotalPrice = 0;
    for (const cartBook of cartBooks){
        bookArray.price.push(cartBook.price)
        bookArray.bookCount.push(cartBook.bookCount)
    }

    modify_order_container_contents();

    const totalPrice = document.getElementById('total_price');
    CheckImg.forEach((x,index) => {
        x.onclick = () => {
            cart_product_checked(x, index)
        }
    })

    AllCheckImg.onclick = () => {
        if(AllCheckImg.classList.contains("fa-regular")){
            AllCheckImg.classList.replace("fa-regular", "fa-solid")
            AllChecked.checked = true;
        }
        else{
            AllCheckImg.classList.replace("fa-solid", "fa-regular")
            AllChecked.checked = false;
        }
        CheckImg.forEach((x,index) => {
            cart_product_checked(x, index)
        })
    }

    function cart_product_checked(x, index) {
        if(AllChecked.checked) {
            if(!x.previousElementSibling.checked){
                x.classList.replace("fa-regular", "fa-solid")
                x.previousElementSibling.checked = true;
                TotalPrice += parseInt(bookArray.price[index]) * parseInt(bookArray.bookCount[index]);
                modify_order_container_contents()
            }
        }
        else {
            if(x.classList.contains("fa-regular")){
                x.classList.replace("fa-regular", "fa-solid")
                x.previousElementSibling.checked = true;
                TotalPrice += parseInt(bookArray.price[index]) * parseInt(bookArray.bookCount[index]);
                modify_order_container_contents()
            }
            else{
                x.classList.replace("fa-solid", "fa-regular")
                x.previousElementSibling.checked = false;
                TotalPrice -= parseInt(bookArray.price[index]) * parseInt(bookArray.bookCount[index]);
                modify_order_container_contents()
            }
        }
    }

    function modify_order_container_contents(){
        OrderContainer.innerHTML = "";
        OrderContainer.insertAdjacentHTML('beforeend', '' +
            `            <div><span>상품금액: </span><span>${TotalPrice}원</span></div>\n` +
            '            <div><span>배송비: </span><span>0원</span></div>\n' +
            '            <hr>\n' +
            `            <div><b>결제 예정 금액: </b><b id="total_price">${TotalPrice}</b><b>원</b></div>\n` +
            '            <input id="order_btn" type="button" value="주문하기" onclick="book_order()">\n')
    }

}


function delete_heart_cart(btn){
    const bookISBNArray = [];
    const CheckBox = document.getElementsByName('check')
    CheckBox.forEach(x => {
        if (x.checked){
            const bookISBN = x.nextElementSibling.nextElementSibling;
            const bookInfoObj = {bookISBN : bookISBN.value}
            bookISBNArray.push(bookInfoObj);
        }
    })
    if(bookISBNArray.length < 1){
        alert('한개 이상을 선택 하셔야 합니다.')
    }else {
        const requestURL = btn === 'heart' ? '/user/heart' : '/user/cart'
        const requestMethod = btn === 'heart' ? 'POST' : 'DELETE'
        fetch(requestURL, {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(bookISBNArray)})
            .then(value => value.text())
            .then(value => {
                if(value === 'true'){
                    if(btn === 'heart') {
                        alert("찜 목록에 등록 완료하였습니다.")
                    } else  {
                        alert("장바구니에서 삭제 완료하였습니다.")
                    }
                    get_cart();
                    bookISBNArray.splice(0, bookISBNArray.length)}
                    location.reload()
            })
            .catch(reason => {
                console.log(reason)});
    }
}

function modify_cart(btn , operator){
    /*BookCount*/
    const BookCountValue = btn.parentElement.querySelector('input');
    const bookISBN = btn.parentElement.parentElement.parentElement.previousElementSibling.querySelector('input[name="bookISBN"]').value;
    const bookCount = operator === '+' ? +BookCountValue.value + 1  : +BookCountValue.value - 1;

    if(operator === "-" && BookCountValue.value == 1) {
        alert("최소 갯수는 1개 입니다.")
    }else {
        fetch('/user/cart',
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken
                },
                body: JSON.stringify({bookISBN: bookISBN, bookCount: bookCount})
            })
            .then(value => {
                console.log(value)
                get_cart()
            })
            .catch(reason => {
                console.log("에러 발생")
                console.log(reason)
            })
    }
}

/***** 주문하기 *****/
// 주문하기 버튼 눌렀을 시
function book_order(){
    const CheckBox = document.getElementsByName('check')
    const TotalPrice = document.getElementById('total_price')
    const body = {
        paymentVO: {paymentAmount: TotalPrice.textContent},
        cartVOS: []
    };
    CheckBox.forEach(x => {
        if (x.checked){
            const bookISBN = x.nextElementSibling.nextElementSibling;
            const bookCount = x.parentElement.nextElementSibling.querySelector('.book_count_value');
            const bookInfoObj = {bookISBN : bookISBN.value, bookCount : bookCount.value}
            body.cartVOS.push(bookInfoObj);
        }
    })
    if(body.cartVOS.length < 1){
        alert('한개 이상을 선택 하셔야 합니다.')
    }else {
        fetch("/user/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(body)})
            .then(value => value.text())
            .then(value => {
                    location.href = value
                delete_heart_cart('delete')
            })
            .catch(reason => {
                console.log(reason)});
    }
}
