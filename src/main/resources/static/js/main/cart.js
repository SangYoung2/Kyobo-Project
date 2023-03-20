const CartBookInfoContainer = document.getElementById('cart_book_info_container')
const OrderContainer = document.getElementById('order_container')

get_cart()

function get_cart(){
    fetch('/user/cart')
        .then(response => response.json())
        .then(value => {
            create_cart_book(value)
            set_book_count()
        })
        .catch(reason => console.log(reason))
}

function create_cart_book(cartBooks){
    CartBookInfoContainer.innerHTML = '';
    for (const cartBook of cartBooks) {
        CartBookInfoContainer.insertAdjacentHTML('beforeend', '' +
            '            <div class="cart_book_info">\n' +
            '                <div class="cart_book_info_left">\n' +
            '                    <input type="checkbox">\n' +
            '                    <img class="book_img" src="" alt="책이미지">\n' +
            '                    <div class="book_common_info">\n' +
            `                        <span class="title">${cartBook.title}</span><br/>\n` +
            `                        <span class="price">${cartBook.price}원</span>\n` +
            `                        <input type="hidden" name="bookISBN" value="${cartBook.bookISBN}">\n` +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="cart_book_info_right">\n' +
            '                    <div class="book_price_container">\n' +
            `                        <b>${cartBook.price * cartBook.bookCount}원</b>\n` +
            '                        <div class="book_count">\n' +
            '                            <i class="fa-solid fa-plus plus"></i>\n' +
            `                            <input class="book_count_value" type="text" value="${cartBook.bookCount}" name="bookCount">\n` +
            '                            <i class="fa-solid fa-minus minus"></i>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n')
    }
}

function set_book_count(){
    /*BookCount*/
    const BookCountPlus = document.querySelectorAll('.plus')
    const BookCountMinus = document.querySelectorAll('.minus')
    const BookCountValue = document.querySelectorAll('.book_count_value')

    BookCountPlus.forEach((x, index) => {
        x.onclick = () => {
            BookCountValue[index].value = parseInt(BookCountValue[index].value) + 1
            fetch('/user/cart',
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => console.log(response))
                .catch(reason => {
                    console.log(reason)
                })
        }
    })

    BookCountMinus.forEach((x, index) => {
        x.onclick = () => {
            if (BookCountValue[index].value === '1') {
                alert('더 이상 숫자를 낮출 수 없습니다.')
            }
            else {
                BookCountValue[index].value = parseInt(BookCountValue[index].value) - 1
                fetch('/user/cart',
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => console.log(response))
                    .catch(reason => {
                        console.log("에러 발생")
                        console.log(reason)
                    })
            }
        }
    })
}



function create_order_container(){
    OrderContainer.innerHTML = '';

}