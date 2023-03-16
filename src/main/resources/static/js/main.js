const BookContainer = document.getElementById('book_container');
const CartBtn = document.getElementById('cart_btn');
CartBtn.parentElement.previousElementSibling
get_all_books()

CartBtn.onclick = () => {
    const bookISBNArray = [];
    const bookInfoCheckBox = document.getElementsByClassName('cart_check_btn');
    for(checkbox of bookInfoCheckBox){
        //체크박스가 선택되어 있다면
        if(checkbox.checked){
            const bookISBN = checkbox.parentElement.previousElementSibling.value
            bookISBNArray.push(bookISBN)
            console.log(checkbox)
        }
    }
    if(bookISBNArray.length === 0){
        alert('상품을 하나라도 선택해주세요!')
    }else {
        insert_cart(bookISBNArray)
    }
}

function insert_cart(bookISBNArray){
    fetch('main/cart',
        {
            method: 'POST',
            headers:{
                "Content-Type": 'application/json'
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
           `\t\t\t\t<div class="check"><input class="cart_check_btn" type="checkbox"></div>\n` +
           `\t\t\t\t<div class="product_img"><img src="" alt="상품이미지"></div>\n` +
           `\t\t\t\t<div class="product_title"><h4>${book.title}</h4></div>\n` +
           `\t\t\t\t<div class="product_author"><span>${book.author} * ${book.publisher}</span></div>\n` +
           `\t\t\t\t<div class="product_price"><span>${book.price}원</span></div>\n` +
           `\t\t\t\t<div class="heart"><input type="button" value="하트"></div>\n` +
           '</div>')
    }
}