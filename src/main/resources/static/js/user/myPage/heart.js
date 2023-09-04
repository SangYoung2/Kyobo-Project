const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const HeartBookContainer = document.getElementById('heart_book_container')
const AllChecked = document.getElementById('all_checked')
const AllCheckImg = document.querySelector(".all_check_img")

get_all_books();

function get_all_books(){
    fetch("/user/heart")
        .then(value => value.json())
        .then(value => {
            console.log(value)
            create_heart_books(value)})
        .catch(reason => console.log(reason))
}

function create_heart_books(BookList){
    HeartBookContainer.innerHTML = '';
    for (const book of BookList) {
        HeartBookContainer.insertAdjacentHTML('beforeend',
            `
            <div class="heart_books">
                <input type="checkbox" name="heart_book_check" hidden>
                <i class="fa-regular fa-circle-check check_img"></i>
                <input type="text" value="${book.isbn}" hidden>
                <img src="https://kyobo-s3-bucket.s3.ap-northeast-2.amazonaws.com/img/book/${book.isbn}/main.jpg"  alt="책 이미지">
                <h4>${book.title}</h4>
                <span>${book.author}</span>
            </div>
        `)
    }

    AllCheckImg.onclick = () => {
        const CheckImg = document.querySelectorAll(".check_img")
        if(AllCheckImg.classList.contains("fa-regular")){
            AllCheckImg.classList.replace("fa-regular", "fa-solid")
            AllChecked.checked = true;
        }
        else{
            AllCheckImg.classList.replace("fa-solid", "fa-regular")
            AllChecked.checked = false;
        }
        CheckImg.forEach(x => {
            if(x.classList.contains("fa-regular")){
                x.classList.replace("fa-regular", "fa-solid")
                x.previousElementSibling.checked = true;
            }
            else{
                x.classList.replace("fa-solid", "fa-regular")
                x.previousElementSibling.checked = false;
            }
        })
    }
}

function btn_checked(btn){
    const bookISBNArray = [];
    const CheckBox = document.getElementsByName('heart_book_check')
    CheckBox.forEach(x => {
        if (x.checked){
            const bookISBN = x.nextElementSibling.nextElementSibling;
            const bookInfoObj = {bookISBN : bookISBN.value}
            bookISBNArray.push(bookInfoObj);
        }
    })
    if(bookISBNArray.length === 0){
        alert('상품을 하나라도 선택해주세요!')
    }else {
        if(btn.value === "삭제"){
            delete_heart_books(bookISBNArray);
        }
        else {
            insert_cart_books(bookISBNArray);
        }
    }
}

function delete_heart_books(bookISBNArray){
    if(bookISBNArray.length < 1){
        alert('한개 이상을 선택 하셔야 합니다.')
    }else {
        fetch("/user/heart", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(bookISBNArray)})
            .then(value => value.text())
            .then(value => {
                if(value === 'true'){
                    get_all_books();
                    bookISBNArray.splice(0, bookISBNArray.length)}
                    location.reload()
            })
            .catch(reason => {
                console.log(reason)});
    }
}

function insert_cart_books(bookISBNArray) {
    fetch('/user/cart',
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