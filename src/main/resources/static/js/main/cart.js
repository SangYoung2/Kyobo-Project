const CartBookInfoContainer = document.getElementById('cart_book_info_container')
const OrderContainer = document.getElementById('order_container')

get_cart()

function get_cart(){
    fetch('/user/cart')
        .then(response => response.json())
        .then(value => create_cart_book(value))
        .catch(reason => console.log(reason))
}

function create_cart_book(cartBooks){
    console.log(cartBooks)
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
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="cart_book_info_right">\n' +
            '                    <div class="book_price_container">\n' +
            `                        <b>${cartBook.price * cartBook.bookCount}</b>\n` +
            '                        <div class="book_count">\n' +
            '                            <i class="fa-solid fa-plus"></i>\n' +
            `                            <input type="text" value="${cartBook.bookCount}">\n` +
            '                            <i class="fa-solid fa-minus"></i>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n')
    }
}

function create_order_container(){
    OrderContainer.innerHTML = '';

}