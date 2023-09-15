const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content");
const tbody = document.querySelector('tbody');

get_all_users();

function get_all_users(){
    fetch("/admin/user")
        .then(value => value.json())
        .then(value => {
            console.log(value)
            create_user_list(value)
        })
        .catch(reason => console.log(reason))
}

function create_user_list(userObj) {
    tbody.innerHTML = '';
    for (user of userObj) {
        if(user.email === 'admin') {
            continue;
        } else {
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.name}</td>
                    <td>${user.birth}</td>
                    <td>${user.phone}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="delete_user_data(this)">삭제</button>
                    </td>
                </tr>
            `)
        }
    }
}

function delete_user_data(e) {
    let userEmail = e.parentElement.parentElement.firstElementChild.innerText;
    if (confirm("삭제하시겠습니까?")){
        fetch("/admin/user?userEmail=" + userEmail, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(userEmail)})
            .then(value => {
               console.log(value);
               get_all_users();
            })
            .catch(reason => console.log(reason))
    }
}