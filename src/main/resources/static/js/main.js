$(document).ready(fillUsersTable);

let userLink = document.getElementById('user-page-link');
userLink.addEventListener("click", fillUserTable);
let adminLink = document.getElementById('admin-page-link');
adminLink.addEventListener("click", fillUsersTable);
let newUserForm = document.getElementById('newUserForm');
newUserForm.onsubmit = function (event) {
    return submitForm(event, "POST", new FormData(newUserForm));
}

function fillUsersTable() {
    let userTable = $('.table-body');
    document.getElementById("users-table-body").innerHTML = "";
    $.getJSON("http://localhost:8081/admin/users", function (data) {
        for (let i = 0; i < Object.keys(data).length; i++) {
            userTable.append("<tr>");
            userTable.append("<td>" + data[i]['id'] + "</td>");
            userTable.append("<td>" + data[i]['firstName'] + "</td>");
            userTable.append("<td>" + data[i]['lastName'] + "</td>");
            userTable.append("<td>" + data[i]['email'] + "</td>");
            userTable.append("<td>" + (data[i]['receiveEmails'] ? 'Yes' : 'No') + "</td>");
            let roles = '';
            data[i]['roles'].forEach(myFunction)

            function myFunction(item) {
                roles += '[' + item['authority'] + ']';
            }

            userTable.append("<td>" + roles + "</td>");
            userTable.append("<td><button class='btn btn-danger deleteButton' data-toggle='modal' data-target='#deleteModal' type='button' id='delete-button-" + data[i]['id'] + "'>Delete</button></td>");
            document.getElementById('delete-button-' + data[i]['id']).addEventListener("click", function () {
                passToModal(data[i]['id'], "delete")
            });
            userTable.append("<td><button class='btn btn-info editButton' data-toggle='modal' data-target='#editModal' type='button' id='edit-button-" + data[i]['id'] + "'>Edit</button></td>");
            document.getElementById('edit-button-' + data[i]['id']).addEventListener("click", function () {
                passToModal(data[i]['id'], "edit")
            });
            userTable.append("</tr>");
        }
    });
}

function fillUserTable() {
    let $userTable = $('.main-user-table');
    document.getElementById("main-user-table").innerHTML = "";
    let userID = document.getElementById("current-user-id").getAttribute("value");
    let url = "http://localhost:8081/user/" + userID;
    $.getJSON(url, function (data) {
        $userTable.append("<td>" + data['id'] + "</td>");
        $userTable.append("<td>" + data['firstName'] + "</td>");
        $userTable.append("<td>" + data['lastName'] + "</td>");
        $userTable.append("<td>" + data['email'] + "</td>");
        $userTable.append("<td>" + data['receiveEmails'] + "</td>");
        let roles = '';
        data['roles'].forEach(myFunction)

        function myFunction(item) {
            roles += '[' + item['authority'] + ']';
        }

        $userTable.append("<td>" + roles + "</td>");
    });
}

function passToModal(id, modalType) {
    let url = "http://localhost:8081/admin/users/" + id;
    $.getJSON(url, function (data) {
        document.getElementById(modalType + '-id').value = data['id'];
        document.getElementById(modalType + '-firstName').value = data['firstName'];
        document.getElementById(modalType + '-lastName').value = data['lastName'];
        document.getElementById(modalType + '-email').value = data['email'];
        let roleOptions = document.getElementById(modalType + '-roles').getElementsByTagName('option');
        for (let i = 0; i < roleOptions.length; i++) {
            roleOptions[i].selected = false;
        }

        data['roles'].forEach(element => {
            document.getElementById(modalType + '-' + element['authority']).selected = true;
        });

        if (data['receiveEmails']) {
            document.getElementById(modalType + 'ReceiveEmailsTrue').checked = true;
        } else {
            document.getElementById(modalType + 'ReceiveEmailsFalse').checked = true;
        }

        if (modalType === "delete") {
            let deleteModalForm = document.getElementById('delete-modal-form');
            deleteModalForm.onsubmit = function (event) {
                return deleteForm(event, data['id']);
            }
        } else if (modalType === "edit") {
            let editModalForm = document.getElementById('edit-modal-form');
            editModalForm.onsubmit = function (event) {
                return submitForm(event, "PUT", new FormData(editModalForm));
            }
        }
    });
}

function deleteForm(event, id) {
    const url = "http://localhost:8081/admin/users/" + id;
    fetch(url,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "DELETE",
        }).then(fillUsersTable);
    $('#deleteModal').modal('hide');
    return false;
}

function submitForm(event, submitMethod, formData) {
    let url = "http://localhost:8081/admin/users"
    if (submitMethod === "PUT") {
        url += "/" + formData.get("id");
    }

    let object = {};
    object['roles'] = [];

    for (let [key, value] of formData.entries()) {
        if (key === 'roles') {
            object['roles'].push({'id': value});
        } else {
            object[key] = value;
        }
    }
    const json = JSON.stringify(object);
    fetch(url,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            body: json,
            method: submitMethod,
        }).then(() => {
        if (submitMethod === "PUT") {
            $('#editModal').modal('hide');
        } else {
            $('#main-admin').addClass("active");
            $('#main-add').removeClass("active");
        }
        fillUsersTable();
    });
    return false;
}
