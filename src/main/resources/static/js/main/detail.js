const ViewBtn = document.querySelector(".view_btn")
const BookDetailContents = document.querySelector(".book_detail_contents")
const BookDetailContent = document.querySelector(".book_detail_content")

if(BookDetailContent.querySelectorAll("div").length < 10) {
    ViewBtn.style.display = "none";
}


ViewBtn.onclick = () => {

    BookDetailContents.classList.toggle('on');
    if(BookDetailContents.classList.contains('on')) {
        BookDetailContents.style.maxHeight  = window.getComputedStyle(BookDetailContent).height;
    }
    else {
        BookDetailContents.style.maxHeight = "300px";
    }
}