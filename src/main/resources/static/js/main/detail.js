const ViewBtn = document.querySelector(".view_btn")
const BookDetailContents = document.querySelector(".book_detail_contents")
const BookDetailContent = document.querySelector(".book_detail_content")

ViewBtn.onclick = () => {

    BookDetailContents.classList.toggle('on');
    if(BookDetailContents.classList.contains('on')) {
        console.log("on")
        BookDetailContents.style.maxHeight  = window.getComputedStyle(BookDetailContent).height;
    }
    else {
        console.log("off")
        BookDetailContents.style.maxHeight = "300px";
    }
}
