const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const BookContainer = document.getElementById('book_container');
const CartBtn = document.getElementById('cart_btn');
const HeartBtn = document.getElementById('heart_btn');

get_all_books()

// 책 찜하기/장바구니 넣기 공통 처리 부분
// (버튼 눌렀을 시 => 데이터 생성, 가능여부 체크)
function insert_heart_cart_checked(userEmail, btn){
    if(userEmail === ''){
        alert("로그인을 해주셔야합니다.")
    }else {
        const bookISBNArray = [];
        const bookInfoCheckBox = document.getElementsByClassName('check_btn');
        for(checkbox of bookInfoCheckBox){
            //체크박스가 선택되어 있다면
            if(checkbox.checked){
                const bookISBN = checkbox.parentElement.previousElementSibling
                const bookInfoObject = {bookISBN : bookISBN.value}
                bookISBNArray.push(bookInfoObject)
            }
        }
        if(bookISBNArray.length === 0){
            alert('상품을 하나라도 선택해주세요!')
        }else {
            console.log(bookISBNArray)
            insert(btn, bookISBNArray)
        }
    }
}

function insert(clickedBtn, bookISBNArray){
    const requestURL = clickedBtn === HeartBtn ? '/main/heart' : '/main/cart'
    fetch(requestURL,
        {
            method: 'POST',
            headers:{
                "content-Type": 'application/json',
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(bookISBNArray)
        })
        .then(value => value.text())
        .then(value => {console.log(value);})
        .catch(reason => {console.log(reason);})
}

function get_all_books(){
    fetch('main/books')
        .then(response => response.json())
        .then(value => create_book_list(value))
        .catch(reason => {
            console.log(reason)
        })
}

function create_book_list(bookList){
    BookContainer.innerHTML = '';
    for(book of bookList){
       BookContainer.insertAdjacentHTML('beforeend', '' +
           '<div class="book">\n' +
           `<input class="product_isbn" type="hidden" value="${book.isbn}">`+
           `    <div class="check"><input class="check_btn" type="checkbox"></div>\n` +
           `    <div class="product_img"><img src="" alt="상품이미지"></div>\n` +
           `    <div class="product_title"><h4>${book.title}</h4></div>\n` +
           `    <div class="product_author"><span>${book.author} * ${book.publisher}</span></div>\n` +
           `    <div class="product_price"><span>${book.price}원</span></div>\n` +
           `    <div class="heart"><input type="button" value="하트"></div>\n` +
           '</div>')
    }
}