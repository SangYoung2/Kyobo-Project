const ViewBtn = document.querySelector(".view_btn")
const BookDetailContent = document.querySelector(".book_detail_content")

ViewBtn.onclick = () => {
    BookDetailContent.classList.toggle('on');
}