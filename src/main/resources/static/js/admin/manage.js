const bookInfoContainer = document.getElementById("book_info_container")
let book

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
				<td><input type="button" value="삭제"></td>
			</tr>
        `)
    }
}

function delete_book(){

}