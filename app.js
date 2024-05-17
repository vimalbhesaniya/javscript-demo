let dataTable = document.getElementById("data");
let countryState = [];
let statesState = [];
let cityState = [];
var cid;
let errorState = []
let username, gender, isAnyError, chkBox, email;
let hobbies = [];
let address = [];


let clearField = () => {
    hobbies = []
    address = []
    errorState = []
    countryState = []
    cityState = []
    countryState = []
}

let data = () => {
    return {
        name: username?.value,
        email: email?.value,
        gender: gender?.value,
        hobby: hobbies,
        country: { id: address[0]?.key, value: address[0]?.value },
        state: { id: address[1]?.key, value: address[1]?.value },
        city: { id: address[2]?.key, value: address[2]?.value },
    }
}

function getDataFromFromUser() {
    username = document.getElementById("name");
    email = document.getElementById("email");
    gender = document.querySelector("input[type='radio']:checked");
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

let display = (array) => {
    let target = document.getElementById("data");
    let text = "<tr>";

    array.map((item, i) => {
        for (const key in item) {
            if (!Array.isArray(item[key]) && typeof item[key] == "object") {
                text += `<td>${item[key]["value"]}</td>`;
            } else {
                text += `<td>${item[key]}</td>`;
            }
        }
        text += `<td class='action'>
        <button class="btnEdit" onclick="handleUpdate(${i})">Edit</button>
        <button class="btnDelete" onclick="handledelete(${i})">Delete</button>
       </td>`;
        text += `</tr>`;
    });

    target.innerHTML = text;
};

let countrySelectBox = document.getElementById("country");
let stateSelectBox = document.getElementById("state");
let citySelectBox = document.getElementById("city");

//get country
let getCountry = () => {
    return country.map((e) => e);
};
//get state
let getStateForContry = (id) => {
    return state
        .filter((e) => {
            if (id == e.cid) {
                return e.states;
            }
        })
        .map((e) => e.states);
};

//get city
let getCityForState = (cid, sid) => {
    return city
        .filter((e) => {
            if (e.sid == sid && e.cid == cid) {
                return e;
            }
        })
        .map((e) => e.cities);
};

//handle select box
let handleSelection = (array, selectedBox, val, text, title, valueToSelect) => {
    let bind = `<option value="0" ${(val == "0") & "selected"}>${title}</option>`;
    array?.forEach((e) => {
        bind += `<option value='${e[val]}' ${valueToSelect == e[val] && "selected"
            } >${e[text]}</option>`;
    });
    selectedBox.innerHTML = bind;
};
//country handling...
countrySelectBox.addEventListener("change", (event) => {
    cid = event.target.value;
    let allState = getStateForContry(cid)[0];
    handleSelection([], stateSelectBox, "", "", "Select State");
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State");
    handleSelection([], citySelectBox, "", "", "Select City");
});

//state handling...
stateSelectBox.addEventListener("change", (event) => {
    let sid = event.target.value;
    let cities = getCityForState(cid, sid);
    handleSelection(cities[0], citySelectBox, "id", "name", "Select City");
});

//when page is load then...
handleSelection(country, countrySelectBox, "cid", "country", "Select Country");
handleSelection([], stateSelectBox, "", "", "Select State");
handleSelection([], citySelectBox, "", "", "Select City");
display(users);

//validations

let checkEmail = (email, whereToShow) => {
    let error = document.getElementById(whereToShow);
    let emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length == 0) {
        error.innerHTML = "Email is required";
        return false;
    } else if (!emailRegex.test(email)) {
        error.innerHTML = "Please enter a valid email ";
        return false;
    } else {
        return true;
    }
};

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
                console.log(value);
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

let checkErrors = () => {

    return errorState = [
        checkInputs(msg, username.value, "nameError", "text"),
        checkInputs(msg, email.value, "emailError", "email"),
        checkInputs(msg, gender?.value, "genderError", "radio"),
        checkInputs(msg, hobbies, "hobbyError", "checkbox"),
        checkInputs(msg, address[0].value, "countryError", "select"),
        checkInputs(msg, address[1].value, "stateError", "select"),
        checkInputs(msg, address[2].value, "cityError", "select"),
    ];

}

//when user submitng form...

let msg = "This field is required";
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    getDataFromFromUser();

    isAnyError = checkErrors().every((err) => (err ? 1 : 0));

    if (isAnyError) {
        users = [
            ...users,
            data(),
        ];
        form.reset();
        console.log(users);
    }

    display(users);
    clearField()
});

let handledelete = (id) => {
    users.splice(id, 1);
    display(users);
};

let handleUpdate = (id) => {
    save.classList.add("hide");
    edit.classList.remove("hide");
    cancle.classList.remove("hide");
    cancle.addEventListener("click", () => {
        save.classList.remove("hide");
        edit.classList.add("hide");
        cancle.classList.add("hide");
    });

    username.value = users[id].name;
    email.value = users[id].email;

    let radio = document.querySelectorAll("input[type=radio]");
    radio.forEach((e) => {
        if (e.value == users[id].gender) {
            e.checked = true;
        }
    });

    let checkBox = document.querySelectorAll("input[type=checkbox]");
    checkBox.forEach((e) => {
        if (users[id].hobby.includes(e.value)) {
            e.checked = true;
        } else {
            e.checked = false;
        }
    });

    handleSelection(
        country,
        countrySelectBox,
        "cid",
        "country",
        "Select Country",
        users[id].country.id
    );

    let allState = getStateForContry(users[id].country.id)[0];

    handleSelection(
        allState,
        stateSelectBox,
        "sid",
        "state",
        "Select State",
        users[id].state.id
    );

    let cities = getCityForState(users[id].country.id, users[id].state.id);

    handleSelection(
        cities[0],
        citySelectBox,
        "id",
        "name",
        "Select City",
        users[id].city.id
    );

    document.getElementById("edit").addEventListener("click", () => {
        getDataFromFromUser();

        isAnyError = checkErrors().every((err) => (err ? 1 : 0));
        if (isAnyError) {
            users = users.with(
                id,
                data()
            )
            display(users)
            clearField()
        }
    });
};

let shortName = () => {
    console.log(users.sort((a, b) => {
        if (a.name < b.name)
            return -1;
        else if (a.name == b.name)
            return 0;
        else
            return 1;
    }));

}

shortName()