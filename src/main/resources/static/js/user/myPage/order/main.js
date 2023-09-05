const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const detailOrderContents = document.querySelector(".detail_order_table")
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
            create_detail_order_contents(value);
        })
        .catch(reason => console.log(reason))
}

function create_detail_order_contents(cartBooks) {
    detailOrderContents.innerHTML = "";
    detailOrderContents.border = "1px";
    detailOrderContents.insertAdjacentHTML("beforeend",
        `
            <thead>
                <tr>
                    <td>순번</td>
                    <td>책 제목</td>
                    <td>수량</td>
                    <td>가격</td>
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