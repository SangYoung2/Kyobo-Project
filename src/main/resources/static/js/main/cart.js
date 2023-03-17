get_cart()

function get_cart(){
    fetch('/user/cart')
        .then(response => {
            response.json()})
        .catch(reason => {
            console.log(reason)
        })
}