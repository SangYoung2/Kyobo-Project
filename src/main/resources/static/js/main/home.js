const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content")
const BookContainer = document.getElementById('book_container');
const searchBar = document.getElementById('search_bar');
const searchInput = searchBar.querySelector('input');
const SearchResultOrderSelect = document.getElementById('search_result_order_select')
const SearchResultCountSelect =document.getElementById('search_result_count_select')
const BookPageList = document.getElementById('book_page_list')

get_all_books_by_condition("", "rating", 8, 1);

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
            console.log(btn)
            insert(btn, bookISBNArray)
        }
    }
}

function insert(clickedBtn, bookISBNArray){
    const requestURL = clickedBtn.getAttribute('id') === 'heart_btn' ? '/user/heart' : '/user/cart'
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
        .then(value => {
            create_book_list(value)
            create_list_of_paging(value)
        })
        .catch(reason => {
            console.log(reason)
        })
}

function create_book_list(bookObject){
    BookContainer.innerHTML = '';
    for(book of bookObject.bookVOS){
       BookContainer.insertAdjacentHTML('beforeend', '' +
           '<div class="book">\n' +
           `<input class="product_isbn" type="hidden" value="${book.isbn}">`+
           `    <div class="check"><input class="check_btn" type="checkbox"></div>\n` +
           `    <div class="product_img"><a href="/main/details/${book.isbn}"><img src="https://kyobo-s3-bucket.s3.ap-northeast-2.amazonaws.com/img/book/${book.isbn}.jpg" alt="상품이미지"></a></div>\n` +
           `    <div class="product_title"><a href="/main/details/${book.isbn}">${book.title}</a></div>\n` +
           `    <div class="product_author"><span>${book.author} * ${book.publisher}</span></div>\n` +
           `    <div class="product_price"><span>${book.price}원</span></div>\n` +
           `    <div class="heart"><input type="button" value="하트"></div>\n` +
           '</div>')
    }
}

// 전체 페이지 번호 리스트를 생성하는 메소드
function create_list_of_paging(bookObject){
    BookPageList.innerHTML = '';
    console.log(bookObject);
    for (let i = bookObject.minPage; i <= bookObject.maxPage ; i++) {
        if(i === bookObject.nowPage) {
            BookPageList.insertAdjacentHTML('beforeend',
                `<li onclick="book_page_li_clicked(this)"><b>${i}</b></li>`)
        }
        else {
            BookPageList.insertAdjacentHTML('beforeend',
                `<li onclick="book_page_li_clicked(this)">${i}</li>`)
        }
    }
}

// 페이지 번호 눌렀을 때 동작 (누른 li)
function book_page_li_clicked(li){
    const keyword = searchInput.value;              //키워드
    const order =  SearchResultOrderSelect.value    //정렬순서
    const pagePerArticle = SearchResultCountSelect.value;   //한페이지당 개수
    const nowPage = li.textContent;
    get_all_books_by_condition(keyword, order, pagePerArticle, nowPage)
}

//키워드를 통해 책들 정보 받아오기
function get_all_books_by_condition(searchKeyword, order, pagePerArticle, nowPage){
    let URL =  `/main/books`;  //기본 URL
    URL += '?order=' + order;                            //순서 조건
    URL += '&pagePerArticle=' + pagePerArticle;          //페이지당 보여줄 개수
    URL += '&nowPage=' + nowPage;                        //현재 페이지 번호
    URL = searchKeyword === '' ? URL : URL + '&searchKeyword=' + searchKeyword;  //검색키워드

    fetch(URL)
        .then(value => value.json())
        .then(value => {
            create_book_list(value);
            create_list_of_paging(value);
        })
        .catch(reason => {console.log(reason)})
}

searchInput.onkeydown = event => {
    if(event.key === 'Enter'){
        if(searchInput.value.trim() === ''){
            alert('검색어를 입력하세요!');
            //모든 책 리스트를 가져오도록 함
            get_books();
        }else{
            const keyword = searchInput.value
            const order = SearchResultOrderSelect.value;
            const pagePerArticle  = SearchResultCountSelect.value;

            //검색어를 제대로 입력하고 엔터키 눌렀을 시 서버에 해당 데이터를 요청함
            get_all_books_by_condition(keyword, order, pagePerArticle, 1);
        }
    }
}

// 정렬 순서 셀렉 박스 클릭 시 동작
SearchResultOrderSelect.onchange = () => {
    const keyword = searchInput.value;    //키워드
    const order =  SearchResultOrderSelect.value    //정렬순서
    const pagePerArticle = SearchResultCountSelect.value;   //한페이지당 개수
    //검색어를 제대로 입력하고 엔터키 눌렀을 시 서버에 해당 데이터를 요청함
    get_all_books_by_condition(keyword, order, pagePerArticle, 1);
}

// 표시 개수 셀렉 박스 클릭 시 동작
SearchResultCountSelect.onchange = () => {
    const keyword = searchInput.value;  //키워드
    const order =  SearchResultOrderSelect.value    //정렬순서
    const pagePerArticle = SearchResultCountSelect.value;   //한페이지당 개수
    if(pagePerArticle === "8") {
        BookContainer.style.gridTemplateRows = "1fr 1fr";
    }else  if (pagePerArticle === "12") {
        BookContainer.style.gridTemplateRows = "1fr 1fr 1fr";
    }else {
        BookContainer.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
    }
    //검색어를 제대로 입력하고 엔터키 눌렀을 시 서버에 해당 데이터를 요청함
    get_all_books_by_condition(keyword, order, pagePerArticle, 1);
}

