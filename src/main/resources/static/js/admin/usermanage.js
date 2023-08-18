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
    console.log(userObj)
    tbody.innerHTML = '';
    for (user of userObj) {
        tbody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td>${user.birth}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
            </tr>
        `)
    }
}