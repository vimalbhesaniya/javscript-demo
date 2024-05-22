let dataTable = document.getElementById("data");
let countryState = [];
let statesState = [];
let cityState = [];
var cid;
let errorState = [];
let username, gender, isAnyError, chkBox, email;
let hobbies = [];
let globleUpdateId;
let address = [];
let users = getFromStorage("users") || [];
let countrySelectBox = document.getElementById("country");
let stateSelectBox = document.getElementById("state");
let citySelectBox = document.getElementById("city");
let form = document.getElementById("form");
let submitFormState = true;

let handleEditAndDeleteFlage = () => {
    if (!submitFormState) {
        save.innerHTML = "Update";
        globleUpdateId = undefined;
    } else {
        save.innerHTML = "Save";
    }
};

//data set in locatorage
let setInStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

//data get in locatorage
function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

//clearing field
let clearField = () => {
    hobbies = [];
    address = [];
    errorState = [];
    countryState = [];
    cityState = [];
    countryState = [];
    isAnyError = [];
};

//Handling  Form
function getDataFromUser() {
    clearField();
    username = document.getElementById("name");
    email = document.getElementById("email");
    document
        .querySelectorAll("input[type='radio']:checked")
        .forEach((e) => (gender = e.value));
    chkBox = document.querySelectorAll("input[type='checkbox']:checked");
    chkBox.forEach((e) => hobbies.push(e?.value));
    let selectedAddress = document.querySelectorAll("select");
    selectedAddress.forEach((e) => {
        if (e.selectedOptions.item(0)?.value !== "0") {
            address.push({
                key: e.selectedOptions?.item(0)?.value,
                value: e.selectedOptions?.item(0)?.innerHTML,
            });
        } else {
            address.push({
                key: e.selectedOptions.item(0)?.value,
                value: e.selectedOptions.item(0)?.value,
            });
        }
    });
}

//displaing data in table
let display = (array) => {
    let target = document.getElementById("data");
    let text = "<tr >";
    array.map((item, i) => {
        for (const key in item) {
            if (key !== "id") {
                !Array.isArray(item[key]) && typeof item[key] == "object"
                    ? (text += `<td >${item[key]["value"]}</td>`)
                    : (text += `<td >${item[key]}</td>`);
            }
        }
        text += `<td class='action' >
        <button class="btnEdit" id='btnEdit${i}' ${globleUpdateId == item.id && `style='cursor:not-allowed' disabled`
            }   onclick="handleUpdate(${item.id})">Edit</button>
        <button class="btnDelete" id='btnDelete${i}' ${globleUpdateId == item.id && `style='cursor:not-allowed' disabled`
            }  onclick="handledelete(${item.id})">Delete</button>
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
    return city
        .filter((e) => e.sid == sid && e.cid == cid && e)
        .map((e) => e.cities);
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
    } else {
        error.innerHTML = "Please Enter your Email";
        return false;
    }
};

document
    .getElementById("email")
    .addEventListener("change", (event) =>
        checkEmail(event.target.value, "emailError")
    );

//this method will check input is valid or not
let checkInputs = (errMsg, value, whereToShow, type, allowNumber) => {
    let where = document.getElementById(whereToShow);
    switch (type) {
        case "text":
            if (value.trim().length == 0) {
                where.innerHTML = errMsg;
                return false;
            } else {
                if (allowNumber) {
                    let numRegx = /[^a-zA-Z ]/g;
                    if (numRegx.test(value)) {
                        where.innerHTML = "Number & Special characters not allowed";
                        return false;
                    }
                    else {
                        where.innerHTML = "";
                        return true;
                    }
                }
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
let checkErrors = () => {
    getDataFromUser();
    return (errorState = [
        checkInputs("Please select your name", username.value, "nameError", "text", true),
        checkInputs("", email.value, "emailError", "email"),
        checkInputs("Please select your gender", gender, "genderError", "radio"),
        checkInputs("Please select atleast one hobby", hobbies, "hobbyError", "checkbox"),
        checkInputs("Please select your country", address[0].value, "countryError", "select"),
        checkInputs("Please select your state", address[1].value, "stateError", "select"),
        checkInputs("Please select your city", address[2].value, "cityError", "select"),
    ]);
};

let msg = "This field is required";
document.getElementById("name")
    .addEventListener("input", (nameEvent) =>
        checkInputs("Name is required", nameEvent.target.value, "nameError", "text", true)
    );
document.getElementById("email")
    .addEventListener("input", (emailEvent) =>
        checkInputs("", emailEvent.target.value, "emailError", "email")
    );
document.getElementById("country")
    .addEventListener("input", (countryEvent) =>
        checkInputs("Please select your country", countryEvent.target.value, "countryError", "text")
    );
document.getElementById("state")
    .addEventListener("input", (stateEvent) =>
        checkInputs("Please select your state", stateEvent.target.value, "stateError", "text")
    );
document.getElementById("city")
    .addEventListener("input", (cityEvent) =>
        checkInputs("Please select your city", cityEvent.target.value, "cityError", "text")
    );
document.getElementsByName("hobby").forEach((e) =>
    e.addEventListener("input", () => {
        getDataFromUser(); checkInputs("Please select atleast one hobby", hobbies, "hobbyError", "checkbox");
    })
);

document.getElementsByName("gender").forEach((genderEvent) =>
    genderEvent.addEventListener("input", () => {
        getDataFromUser();
        checkInputs("Please select your gender", gender, "genderError", "radio");
    })
);

//when user submitng form=
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    handleEditAndDeleteFlage();
    getDataFromUser();
    globleUpdateId = getFromStorage("userIdToUpdate");
    let assignDataToArray = {
        name: username?.value,
        email: email?.value,
        gender: gender,
        hobby: hobbies,
        country: { id: address[0]?.key, value: address[0]?.value },
        state: { id: address[1]?.key, value: address[1]?.value },
        city: { id: address[2]?.key, value: address[2]?.value },
        id: submitFormState ? Math.trunc(Math.random() * 1000000) : globleUpdateId,
    };

    console.log(checkErrors());
    isAnyError = checkErrors().every((err) => (err ? 1 : 0));
    console.log(isAnyError);
    if (isAnyError) {
        if (submitFormState) {

            users = [...users, assignDataToArray];
        } else {
            dataToUpdateId = users.findIndex((e) => e.id == globleUpdateId);
            users = users.with(dataToUpdateId, assignDataToArray);
        }
        form.reset();
    }
    globleUpdateId = undefined;
    setInStorage("users", users);
    display(getFromStorage("users"));
    clearField();
    submitFormState = true;
});

//when user click on delete button
let handledelete = (id) => {
    let confirmation = confirm("Are you sure");
    if (confirmation) {

        users = users.filter((e) => e.id != id);
        setInStorage("users", users);
        display(getFromStorage("users"));
    } else {
        return;
    }
};

let deleteButton, editButton;
function afterUpdate(id) {
    deleteButton = document.getElementById(`btnDelete${id}`);
    editButton = document.getElementById(`btnEdit${id}`);
    cancle.classList.remove("hide");
}

function beforUpdate() {
    cancle.classList.add("hide");
    handleSelection([], citySelectBox, "", "", "Select City", "0");
    handleSelection([], stateSelectBox, "", "", "Select State", "0");
    handleSelection([], countrySelectBox, "", "", "Select Country", "0");
    globleUpdateId = undefined;
    display(users);
    submitFormState = true;
    handleEditAndDeleteFlage();
}

//update functionality
let userWhoWillUpdate;
let handleUpdate = (updateId) => {
    submitFormState = false;

    handleEditAndDeleteFlage();
    userWhoWillUpdate = users.find(
        (e) => e.id == updateId
    );

    setInStorage("userIdToUpdate", updateId);
    globleUpdateId = localStorage.getItem("userIdToUpdate");
    display(users);
    getDataFromUser();
    afterUpdate(updateId);
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
            ? (e.checked = true)
            : (e.checked = false);
    });

    handleSelection(country, countrySelectBox, "cid", "country", "Select Country", userWhoWillUpdate.country.id);

    let allState = getStateForContry(userWhoWillUpdate.country.id)[0];
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State", userWhoWillUpdate.state.id
    );
    cid = userWhoWillUpdate.country.id;
    sid = userWhoWillUpdate.state.id;
    let cities = getCityForState(cid, sid);
    handleSelection(cities[0], citySelectBox, "id", "name", "Select City", userWhoWillUpdate.city.id);
};

//sorting
let shortTableWithPerticulerField = (direction, sortWith, value) => {
    let sorted, element, activeMode;
    element = document.getElementById(direction.id);
    activeMode = document.activeElement

    let allArrows = document.querySelectorAll(".arrow")
    allArrows.forEach((e) => {
        e.classList.remove("hide")
    })

    switch (direction.value) {
        case "ascending":
            direction.classList.add("hide")
            sorted = getFromStorage("users").toSorted((a, b) =>
                a[sortWith] < b[sortWith] ? -1 : a[sortWith] == b[sortWith] ? 0 : 1);
            users = sorted;
            display(users);
            break;
        case "descending":
            direction.classList.add("hide")
            sorted = getFromStorage("users").toSorted((a, b) =>
                a[sortWith] > b[sortWith] ? -1 : a[sortWith] == b[sortWith] ? 0 : 1
            );
            users = sorted;
            display(users);

            break;
        case "ascendingWithValue":
            direction.classList.add("hide")
            sorted = getFromStorage("users").toSorted((a, b) =>
                a[sortWith][value] < b[sortWith][value]
                    ? -1
                    : a[sortWith][value] == b[sortWith][value]
                        ? 0
                        : 1
            );
            users = sorted;
            display(users);
            break;
        case "descendingWithValue":
            direction.classList.add("hide")
            sorted = getFromStorage("users").toSorted((a, b) =>
                a[sortWith][value] > b[sortWith][value]
                    ? -1
                    : a[sortWith][value] == b[sortWith][value]
                        ? 0
                        : 1
            );
            users = sorted;
            display(users);
            break;
        case "0":
            display(getFromStorage("users"));
            break;
        default:
            break;
    }
};

//search handling
let search = (value, searchedBy) => {
    let searchedUsers = users.filter((e) => {
        if (e[searchedBy].indexOf(value) != -1) {
            return e
        }
    }
    );
    display(searchedUsers);
};

document
    .getElementById("select")
    .addEventListener("change", (selectedOption) => {
        document.getElementById("searchBox").addEventListener("input", (event) => {
            search(event.target.value, selectedOption.target.value);
        });
    });

document.getElementById("searchBox").addEventListener("input", (event) => {
    search(event.target.value, "name");
});

//when page is load then...
handleSelection(country, countrySelectBox, "cid", "country", "Select Country");
handleSelection([], stateSelectBox, "", "", "Select State");
handleSelection([], citySelectBox, "", "", "Select City");
setInStorage("users", users);
display(getFromStorage("users"));
