const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const detailOrderContents = document.querySelector(".detail_order_table")
const orderTitle = document.querySelector(".order_title")
const orderNo = orderTitle.querySelector("span")
function get_detail_order(e){
    let orderNo = e.innerText
    fetch('/user/myPage/order/detail/' + orderNo, {
        method : "POST",
        headers: {
            'Content-Type': 'application/json',
            "X-CSRF-TOKEN": csrfToken
        },
    })
        .then(response => response.json())
        .then(value => {
            create_detail_order_contents(value, orderNo);
        })
        .catch(reason => console.log(reason))
}

function create_detail_order_contents(cartBooks, no) {
    detailOrderContents.innerHTML = "";
    orderNo.innerText = `주문번호 : ${no}`
    detailOrderContents.insertAdjacentHTML("beforeend",
        `
            <thead>
                <tr>
                    <th>도서번호</th>
                    <th>책 제목</th>
                    <th>수량</th>
                    <th>가격</th>
                </tr>
            </thead>
        `)
    for (const cartBook of cartBooks) {
        detailOrderContents.insertAdjacentHTML("beforeend",
            `
            <tbody>
                <tr>
                    <td>${cartBook.bookISBN}</td>
                    <td>${cartBook.title}</td>
                    <td>${cartBook.bookCount}</td>
                    <td>${cartBook.price}</td>
                </tr>
            </tbody>
            `)
    }
}