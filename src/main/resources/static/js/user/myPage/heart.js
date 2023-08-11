const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const HeartBookContainer = document.getElementById('heart_book_container')
const AllChecked = document.getElementById('all_checked')
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
                <input type="checkbox" name="heart_book_check">
                <input type="text" value="${book.isbn}" hidden>
                <img src="https://kyobo-s3-bucket.s3.ap-northeast-2.amazonaws.com/img/book/${book.isbn}.jpg"  alt="책 이미지">
                <h4>${book.title}</h4>
                <span>${book.author}</span>
            </div>
        `)
    }

}

function delete_heart_books(){
    const bookISBNArray = [];
    const CheckBox = document.getElementsByName('heart_book_check')
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
            })
            .catch(reason => {
                console.log(reason)});
    }
}

function checkAll(){
    const CheckBox = document.getElementsByName('heart_book_check')
    AllChecked.onclick = () => {
        CheckBox.forEach(x => {
            x.checked = !!AllChecked.checked;
        })
    }
}