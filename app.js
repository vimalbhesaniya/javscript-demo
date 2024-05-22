let dataTable = document.getElementById("data");
let countryState = [];
let statesState = [];
let cityState = [];
var cid;
let errorState = []
let username, gender, isAnyError, chkBox, email;
let hobbies = [];
let globleUpdateId;
let address = [];
let dataToBeUpdate = []
let users = getFromStorage("users") || [];
let countrySelectBox = document.getElementById("country");
let stateSelectBox = document.getElementById("state");
let citySelectBox = document.getElementById("city");
let form = document.getElementById("form")
let flag = {
    submitSTATE : false,
    editSTATE : false,   
}

//data set in locatorage
let setInStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

//data get in locatorage
function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

//clearing field
let clearField = () => {
    hobbies = []
    address = []
    errorState = []
    countryState = []
    cityState = []
    countryState = []
    isAnyError = []
}

//Handling  Form
function getDataFromUser() {
    clearField()
    username = document.getElementById("name");
    email = document.getElementById("email");
    document.querySelectorAll("input[type='radio']").forEach((e) => { e.checked == true ? gender = e.value : false });
    chkBox = document.querySelectorAll("input[type='checkbox']:checked");
    chkBox.forEach((e) => hobbies.push(e.value));
    let selectedAddress = document.querySelectorAll("select");
    selectedAddress.forEach((e) => {
        if (e.selectedOptions.item(0).value !== "0") {
            address.push({
                key: e.selectedOptions.item(0).value,
                value: e.selectedOptions.item(0)?.innerHTML,
            });
        } else {
            address.push({
                key: e.selectedOptions.item(0).value,
                value: e.selectedOptions.item(0)?.value,
            });
        }
    });
}

//displaing data in table
let display = (array) => {
    let target = document.getElementById("data");
    let text = "<tr >"
    array.map((item, i) => {
        for (const key in item) {
            if (key !== 'id') {
                !Array.isArray(item[key]) && typeof item[key] == "object"
                    ? text += `<td >${item[key]["value"]}</td>`
                    : text += `<td >${item[key]}</td>`;
            }
        }
        text += `<td class='action' >
        <button class="btnEdit" id='btnEdit${i}' ${globleUpdateId == item.id && `style='cursor:not-allowed' disabled`}   onclick="handleUpdate(${item.id})">Edit</button>
        <button class="btnDelete" id='btnDelete${i}' ${globleUpdateId == item.id && `style='cursor:not-allowed' disabled`}  onclick="handledelete(${item.id})">Delete</button>
        </td>`;
        text += `</tr>`;
    });
    target.innerHTML = text;
};
//get country
let getCountry = () => {
    return country.map((e) => e);
};
//get state
let getStateForContry = (id) => {
    return state.filter((e) => id == e.cid && e.states).map((e) => e.states);
};
//get city
let getCityForState = (cid, sid) => {
    return city.filter((e) => e.sid == sid && e.cid == cid && e).map((e) => e.cities);
};

//handle select box
let handleSelection = (array, selectedBox, val, text, title, valueToSelect) => {
    let bind = `<option value="0"}>${title}</option>`;
    array?.forEach((e) => {
        bind += `<option value='${e[val]}' ${valueToSelect == e[val] && "selected"
            } >${e[text]}</option>`;
    });
    selectedBox.innerHTML = bind;
};
//country handling...
countrySelectBox.addEventListener("change", (event) => {
    handleSelection([], stateSelectBox, "", "", "Select State");
    cid = event.target.value;
    let allState = getStateForContry(cid)[0];
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State");
    handleSelection([], citySelectBox, "", "", "Select City");
});

//state handling...
stateSelectBox.addEventListener("change", (event) => {
    handleSelection([], citySelectBox, "", "", "Select City");
    let sid = event.target.value;
    let cities = getCityForState(cid, sid);
    handleSelection(cities[0], citySelectBox, "id", "name", "Select City");
});


//validations
let checkEmail = (email, whereToShow) => {
    let error = document.getElementById(whereToShow);
    let emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length !== 0) {
        error.innerHTML = "";
        if (!emailRegex.test(email)) {
            error.innerHTML = "Please enter a valid email ";
            return false;
        } else {
            error.innerHTML = "";
            return true;
        }
    }
    else {
        error.innerHTML = "Email is required";
        return false;
    }
};

document.getElementById("email").addEventListener("change" , (event) => checkEmail(event.target.value , "emailError"))

//this method will check input is valid or not
let checkInputs = (errMsg, value, whereToShow, type) => {
    let where = document.getElementById(whereToShow);
    switch (type) {
        case "text":
            if (value.trim().length == 0) {
                where.innerHTML = errMsg;
                return false;
            } else {
                where.innerHTML = "";
                return true;
            }
            break;
        case "email":
            return checkEmail(value, whereToShow);
            break;
        case "radio":
            if (!value) {
                where.innerHTML = errMsg;
                return false;
            } else {
                where.innerHTML = "";
                return true;
            }
            break;
        case "select":
            if (value == "0") {
                where.innerHTML = errMsg;
                return false;
            } else {
                where.innerHTML = "";
                return true;
            }
            break;
        case "checkbox":
            if (value.length == 0) {
                where.innerHTML = errMsg;
                return false;
            } else {
                where.innerHTML = "";
                return true;
            }
            break;
        default:
            return false;
            break;
    }
};

//checking error with showing into frontend
let checkErrors = () => {
    getDataFromUser()
    return errorState = [
        checkInputs(msg, username.value, "nameError", "text"),
        checkInputs(msg, email.value, "emailError", "email"),
        checkInputs(msg, gender, "genderError", "radio"),
        checkInputs(msg, hobbies, "hobbyError", "checkbox"),
        checkInputs(msg, address[0].value, "countryError", "select"),
        checkInputs(msg, address[1].value, "stateError", "select"),
        checkInputs(msg, address[2].value, "cityError", "select"),
    ];
}

//when user submitng form
let msg = "This field is required";
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    getDataFromUser();
    isAnyError = checkErrors().every((err) => (err ? 1 : 0));
    if (isAnyError) {
        users = [
            ...users,
            {
                name: username?.value,
                email: email?.value,
                gender: gender,
                hobby: hobbies,
                country: { id: address[0]?.key, value: address[0]?.value },
                state: { id: address[1]?.key, value: address[1]?.value },
                city: { id: address[2]?.key, value: address[2]?.value },
                id: Math.trunc(Math.random() * 1000000)
            }
        ];
        form.reset();
    }
    setInStorage('users', users)
    display(getFromStorage('users'));
    clearField()
});

//when user click on delete button 
let handledelete = (id) => {
    users = users.filter((e) => e.id != id)
    setInStorage('users', users)
    display(getFromStorage('users'));
};

let deleteButton, editButton;
let afterUpdate = (id) => {
    deleteButton = document.getElementById(`btnDelete${id}`)
    editButton = document.getElementById(`btnEdit${id}`)
    save.classList.add("hide");
    edit.classList.remove("hide");
    cancle.classList.remove("hide");
}

let beforUpdate = () => {
    save.classList.remove("hide");
    edit.classList.add("hide");
    cancle.classList.add("hide");
    handleSelection([], citySelectBox, "", "", "Select City", "0");
    handleSelection([], stateSelectBox, "", "", "Select State", "0");
    handleSelection([], countrySelectBox, "", "", "Select Country", "0");
    globleUpdateId = undefined
    display(users);
}

//update functionality
let userWhoWillUpdate;
let handleUpdate = (updateId) => {
    userWhoWillUpdate = users.find((e) => e.id == updateId);
    globleUpdateId = updateId
    display(users)
    getDataFromUser();
    afterUpdate(updateId)
    cancle.addEventListener("click", () => beforUpdate());
    username.value = userWhoWillUpdate.name;
    email.value = userWhoWillUpdate.email;
    let radio = document.querySelectorAll("input[type=radio]");
    radio.forEach((e) => {
        if (e.value == userWhoWillUpdate.gender) e.checked = true;
    });

    let checkBox = document.querySelectorAll("input[type=checkbox]");
    checkBox.forEach((e) => {
        userWhoWillUpdate.hobby.includes(e.value)
            ? e.checked = true
            : e.checked = false;
    });

    handleSelection(country, countrySelectBox, "cid", "country", "Select Country", userWhoWillUpdate.country.id);

    let allState = getStateForContry(userWhoWillUpdate.country.id)[0];
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State", userWhoWillUpdate.state.id);
    cid = userWhoWillUpdate.country.id
    sid = userWhoWillUpdate.state.id
    let cities = getCityForState(cid, sid);
    handleSelection(cities[0], citySelectBox, "id", "name", "Select City", userWhoWillUpdate.city.id);
};

let updateButton = document.getElementById("edit");
updateButton.addEventListener("click", () => {
    isAnyError = checkErrors().every((err) => (err ? 1 : 0));
    let dataToUpdateId = users.findIndex((e) => e.id == globleUpdateId);
    if (isAnyError) {
        users = users.with(
            dataToUpdateId,
            {
                name: username?.value,
                email: email?.value,
                gender: gender,
                hobby: hobbies,
                country: { id: address[0]?.key, value: address[0]?.value },
                state: { id: address[1]?.key, value: address[1]?.value },
                city: { id: address[2]?.key, value: address[2]?.value },
                id: userWhoWillUpdate.id
            }
        )
        globleUpdateId = undefined
        beforUpdate()
        setInStorage('users', users)
        display(getFromStorage("users"))
    }
});

//sorting
let shortByName = (e) => {
    let sorted;
    switch (e.value) {
        case "1":
            sorted = getFromStorage('users').toSorted((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1)
            users = sorted
            display(users)
            break;
        case "2":
            sorted = users.toSorted((a, b) => a.name > b.name ? -1 : a.name == b.name ? 0 : 1);
            users = sorted
            display(users)
            break;
        case "0": display(getFromStorage('users'))
            break;
        default: break;
    }
}

//search handling
let search = (value) => {
    let searchedUsers = users.filter((e) => e.name.toLowerCase()?.startsWith(value.toLowerCase()))
    display(searchedUsers)
}

document.getElementById("searchBox").addEventListener("input", (event) => { search(event.target.value) })

//when page is load then...
handleSelection(country, countrySelectBox, "cid", "country", "Select Country");
handleSelection([], stateSelectBox, "", "", "Select State");
handleSelection([], citySelectBox, "", "", "Select City");
setInStorage('users', users)
display(getFromStorage('users'));
