const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const CartBookInfoContainer = document.getElementById('cart_book_info_container')
const OrderContainer = document.getElementById('order_container')
const AllChecked = document.querySelector('.all_checked')

get_cart()

function get_cart(){
    fetch('/user/cart')
        .then(response => response.json())
        .then(value => {
            create_cart_book(value)

        })
        .catch(reason => console.log(reason))
}

function create_cart_book(cartBooks){
    CartBookInfoContainer.innerHTML = '';
    for (const cartBook of cartBooks) {
        CartBookInfoContainer.insertAdjacentHTML('beforeend',
            `<div class="cart_book_info">\n 
                            <div class="cart_book_info_left">\n 
                                <input type="checkbox" name="check">\n 
                                <input type="hidden" name="bookISBN" value="${cartBook.bookISBN}">\n 
                                <img class="book_img" src="" alt="책이미지">\n 
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

    OrderContainer.innerHTML = '';
    let TotalPrice = 0;
    for (const cartBook of cartBooks){
        TotalPrice += cartBook.price * cartBook.bookCount;
    }
    OrderContainer.insertAdjacentHTML('beforeend', '' +
        `            <div><span>상품금액</span><span>${TotalPrice}</span></div>\n` +
        '            <div><span>배송비</span><span>price</span></div>\n' +
        '            <hr>\n' +
        `            <div><b>결제 예정 금액</b><b>${TotalPrice}</b></div>\n` +
        '            <input class="order_btn" type="button" value="주문하기">\n')
}

function checkAll(){
    const CheckBox = document.getElementsByName('check')
    AllChecked.onclick = () => {
        CheckBox.forEach(x => {
            x.checked = !!AllChecked.checked;
        })
    }
}

function delete_heart_cart(btn){
    const bookISBNArray = [];
    const CheckBox = document.getElementsByName('check')
    CheckBox.forEach(x => {
        if (x.checked){
            const bookISBN = x.nextElementSibling;
            const bookInfoObj = {bookISBN : bookISBN.value}
            bookISBNArray.push(bookInfoObj);
        }
    })
    console.log(bookISBNArray)
    if(bookISBNArray.length < 1){
        alert('한개 이상을 선택 하셔야 합니다.')
    }else {
        const requestURL = btn === 'heart' ? '/user/heart' : '/user/cart'
        const requestMethod = btn === 'heart' ? 'POST' : 'DELETE'
        console.log(requestURL)
        console.log(requestMethod)
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
                    get_cart();
                    bookISBNArray.splice(0, bookISBNArray.length)}
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

