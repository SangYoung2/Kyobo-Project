const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content");
const bookInfoContainer = document.getElementById("book_info_container");

get_all_books()
function get_all_books(){
    fetch('/admin/books')
        .then(response => response.json())
        .then(value => {
            create_book_list(value)
        })
        .catch(reason => {
            console.log(reason)
        })
}

function create_book_list(bookObject){
    console.log(bookObject)
    bookInfoContainer.innerHTML = '';
    for(book of bookObject){
        bookInfoContainer.insertAdjacentHTML('beforeend', `
        	<tr>
				<td>${book.isbn}</td>
				<td>${book.title}</td>
				<td>${book.author}</td>
				<td>${book.publisher}</td>
				<td>
				    <input type="button" value="삭제" onclick="delete_book_data(this)">				 
				    <input type="button" value="수정" onclick="modify_book_data(this)">
				</td>
			</tr>
        `)
    }
}

function delete_book_data(e){
    let bookISBN = e.parentElement.parentElement.firstElementChild.innerText;
    alert("삭제하시겠습니까?")
    fetch("/admin/manage?bookISBN=" + bookISBN, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(bookISBN)})
        .then(value => {
            value.json();
            get_all_books();
        })
        .catch(reason => console.log(reason))

}

function modify_book_data(e) {
    let bookISBN = e.parentElement.parentElement.firstElementChild.innerText;

    location.href = "/admin/bookmodify?bookISBN=" + bookISBN
}