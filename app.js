let countrySelectBox , stateSelectBox, citySelectBox 
let defaultIndex = 0 ;

const appState = {
    dataTable: document.getElementById("data"),
    countryID: '',
    errorState: [],
    userName: document.getElementById("name"),
    selectedGender: '',
    isAnyError: false,
    email: document.getElementById("email"),
    selectedCheckBox: '',
    selectedHobbies: [],
    globleUpdateID: '',
    users: getFromStorage("users") || [],
    form: document.getElementById("form"),
    submitFormState: true,
    country: { key: '', value:''},
    state: { key: '' , value: '' },
    city: { key: '' , value: '' },
    dateOfJoin: new Date().toDateString(),
    userWhoWillUpdate: {},
    temp : []
};

const fetchDATA = () =>{
    document.querySelectorAll("input[type='checkbox']:checked")
    .forEach((e) => {
        appState.selectedHobbies.push(e?.value)
    });
    document.querySelectorAll("input[type='radio']:checked").forEach((e) => (appState.selectedGender = e.value))
    countrySelectBox = document.getElementById("country")
    stateSelectBox = document.getElementById("state")
    citySelectBox = document.getElementById("city")
    appState.country.key = countrySelectBox.value
    appState.country.value = countrySelectBox.selectedOptions[defaultIndex]?.label
    appState.state.key = stateSelectBox.value
    appState.state.value = stateSelectBox.selectedOptions[defaultIndex]?.label
    appState.city.key = citySelectBox.value
    appState.city.value = citySelectBox.selectedOptions[defaultIndex]?.label
}
fetchDATA()


let handleEditAndDeleteFlage = () => {
    if (!appState.submitFormState) {
        save.innerHTML = "Update";
        appState.globleUpdateID = '';
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
    appState.selectedHobbies = [];
    appState.errorState = [];
    appState.selectedGender = ''
    appState.isAnyError = [];
    appState.temp = []
};

//displaing data in table
let display = (array) => {
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
        <button class="btnEdit" id='btnEdit${i}' ${appState.globleUpdateID == item.id && `style='cursor:not-allowed' disabled`
            }   onclick="handleUpdate(${item.id})">Edit</button>
        <button class="btnDelete" id='btnDelete${i}' ${appState.globleUpdateID == item.id && `style='cursor:not-allowed' disabled`
            }  onclick="handledelete(${item.id})">Delete</button>
        </td>`;
        text += `</tr>`;
    });
    appState.dataTable.innerHTML = text;
};
//get country
let getCountry = () => {
    return country.map((e) => e);
};
//get state
let getStateForContry = (id) => {
    let result;
    state.filter((e) => result = id == e.cid ? e.states : result)
    return result
};
//get city
let getCityForState = (cid, sid) => {
    let result;
    city.filter((e) => result = e.sid == sid && e.cid == cid ? e.cities : result)
    return result
};


//handle select box
let handleSelection = (array, selectedBox, val, text, title, valueToSelect) => {
    let bind = `<option value="0">${title}</option>`;
    array?.forEach((e) => {
        bind += `<option value='${e[val]}' id="${e[text]}" ${valueToSelect == e[val] && "selected"
            } >${e[text]}</option>`;
    });
    selectedBox.innerHTML = bind;
};

//country handling...
countrySelectBox.addEventListener("change", (event) => {
    handleSelection([], stateSelectBox, "", "", "Select State");
    appState.countryID = event.target.value;
    console.log(appState.countryID);
    let allState = getStateForContry(appState.countryID);
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State");
    handleSelection([], citySelectBox, "", "", "Select City");
    
});

//state handling...
stateSelectBox.addEventListener("change", (event) => {
    handleSelection([], citySelectBox, "", "", "Select City");
    let stateID = event.target.value;
    let cities = getCityForState(appState.countryID, stateID);
    handleSelection(cities, citySelectBox, "id", "name", "Select City");
});

//validations
let checkEmail = (email, whereToShow) => {
    let error = document.getElementById(whereToShow);
    let emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (appState.email.length !== 0) {
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

document.getElementById("email").addEventListener("change", (event) =>
    checkEmail(event.target.value, "emailError")
);

//this method will check input is valid or not
let checkInputs = (errMsg, value, whereToShow, type, allowNumber) => {
    clearField()
    fetchDATA()
    let errorElement = document.getElementById(whereToShow);
    switch (type) {
        case "text":
            if (value.trim().length == 0) {
                errorElement.innerHTML = errMsg;
                return false;
            } else {
                if (allowNumber) {
                    let numRegx = /[^a-zA-Z ]/g;
                    if (numRegx.test(value)) {
                        errorElement.innerHTML = "Number & Special characters not allowed";
                        return false;
                    } else {
                        errorElement.innerHTML = "";
                        return true;
                    }
                }
                errorElement.innerHTML = "";
                return true;
            }
            break;
        case "email":
            return checkEmail(value, whereToShow);
            break;
        case "radio":
            if (!value) {
                errorElement.innerHTML = errMsg;
                return false;
            } else {
                errorElement.innerHTML = "";
                return true;
            }
            break;
        case "select":
            if (value == "0") {
                errorElement.innerHTML = errMsg;
                return false;
            } else {
                errorElement.innerHTML = "";
                return true;
            }
            break;
        case "checkbox":
            if (value.length == defaultIndex) {
                errorElement.innerHTML = errMsg;
                return false;
            } else {
                errorElement.innerHTML = "";
                return true;
            }
            break;
        default:
            return false;
            break;
    }
};

let checkErrors = () => {
    clearField()
    fetchDATA()
    return (appState.errorState = [
        checkInputs("Please select your name", appState.userName.value, "nameError", "text", true),
        checkInputs("", appState.email.value, "emailError", "email"),
        checkInputs(
            "Please select your gender",
            appState.selectedGender,
            "genderError",
            "radio"
        ),
        checkInputs(
            "Please select atleast one hobby",
            appState.selectedHobbies,
            "hobbyError",
            "checkbox"
        ),
        checkInputs(
            "Please select your country",
            appState.country.key,
            "countryError",
            "select"
        ),
        checkInputs(
            "Please select your state",
            appState.state.key,
            "stateError",
            "select"
        ),
        checkInputs(
            "Please select your city",
            appState.city.key,
            "cityError",
            "select"
        ),
    ]);
};

appState.userName.addEventListener("input", (nameEvent) =>
    checkInputs("Name is required", nameEvent.target.value, "nameError", "text", true)
);
appState.email.addEventListener("input", (emailEvent) =>
    checkInputs("", emailEvent.target.value, "emailError", "email")
);
countrySelectBox.addEventListener("input", (countryEvent) =>
    checkInputs("Please select your country", countryEvent.target.value, "countryError", "text")
);
stateSelectBox.addEventListener("input", (stateEvent) =>
    checkInputs("Please select your state", stateEvent.target.value, "stateError", "text")
);
citySelectBox.addEventListener("input", (cityEvent) =>
    checkInputs("Please select your city", cityEvent.target.value, "cityError", "text")
);
document.getElementsByName("hobby").forEach((hobbyEvent) =>
    hobbyEvent.addEventListener("input", () => {fetchDATA(); checkInputs("Please select atleast one hobby", appState.selectedHobbies, "hobbyError", "checkbox"); console.log(appState.selectedHobbies); })
);

document.getElementsByName("gender").forEach((genderEvent) =>
    genderEvent.addEventListener("input", () => {fetchDATA(); checkInputs("Please select your gender", appState.selectedGender, "genderError", "radio"); })
);

//when user submitng form=
document.getElementById("form").addEventListener("submit", (formEvent) => {
    clearField()
    fetchDATA();
    formEvent.preventDefault();
    handleEditAndDeleteFlage();
    appState.globleUpdateID = getFromStorage("userIdToUpdate");    
    let newUserData = {
        name: appState.userName?.value,
        email: appState.email?.value,
        gender: appState.selectedGender,
        hobby: appState.selectedHobbies,
        country: { id: appState.country.key, value: appState.country.value },
        state: { id: appState.state.key, value: appState.state.value },
        city: { id: appState.city.key, value: appState.city.value },
        id: appState.submitFormState ? (new Date() * 100) / 50 : appState.globleUpdateID,
        date: appState.dateOfJoin,
    };

    appState.isAnyError = checkErrors().every((error) => (error ? 1 : 0));
    if (appState.isAnyError) {
        if (appState.submitFormState) {
            appState.users = [...appState.users, newUserData];
        } else {
            appState.users = appState.users.map((oldUserData) =>{
                if (oldUserData.id == appState.globleUpdateID) {
                    oldUserData = newUserData
                }
                return oldUserData
            })
            
            cancle.classList.add("hide");
            appState.submitFormState = true;
            handleEditAndDeleteFlage();
            beforUpdate()
        }
        form.reset();
    }
    appState.globleUpdateID = '';
    setInStorage("users", appState.users);
    display(getFromStorage("users"));
    clearField();
    appState.submitFormState = true;
});

//when user click on delete button
let handledelete = (id) => {
    let confirmation = confirm("Are you sure");
    if (confirmation) {
        appState.users = appState.users.filter((usersData) => usersData.id != id);
        setInStorage("users", appState.users);
        display(getFromStorage("users"));
    } 
};

function beforUpdate() {
    cancle.classList.add("hide");
    handleSelection([], citySelectBox, "", "", "Select City", "0");
    handleSelection([], stateSelectBox, "", "", "Select State", "0");
    handleSelection(country, countrySelectBox, "cid", "country", "Select Country");
    appState.globleUpdateID = '';
    display(appState.users);
    appState.submitFormState = true;
    handleEditAndDeleteFlage();
    
}

//update functionality

let handleUpdate = (updateId) => {
    fetchDATA();
    appState.submitFormState = false;
    handleEditAndDeleteFlage();
    appState.userWhoWillUpdate = appState.users.find((usersData) => usersData.id == updateId);
    setInStorage("userIdToUpdate", updateId);
    appState.globleUpdateID = localStorage.getItem("userIdToUpdate");
    display(appState.users);
    cancle.classList.remove("hide");
    cancle.addEventListener("click", () => beforUpdate());
    appState.userName.value = appState.userWhoWillUpdate.name;
    appState.email.value = appState.userWhoWillUpdate.email;
    let radio = document.querySelectorAll("input[type=radio]");
    radio.forEach((elements) => {
        if (elements.value == appState.userWhoWillUpdate.gender) elements.checked = true;
    });
    let allCheckBox = document.querySelectorAll("input[type=checkbox]");
    allCheckBox.forEach((checkBoxes) => {
        ;
        checkBoxes.checked = appState.userWhoWillUpdate.hobby.includes(checkBoxes.value) ? true : false;
    });
    handleSelection(country, countrySelectBox, "cid", "country", "Select Country", appState.userWhoWillUpdate.country.id
    );

    let allState = getStateForContry(appState.userWhoWillUpdate.country.id);
    handleSelection(allState, stateSelectBox, "sid", "state", "Select State", appState.userWhoWillUpdate.state.id
    );

    appState.countryID = appState.userWhoWillUpdate.country.id;
    let stateID = appState.userWhoWillUpdate.state.id;
    let cities = getCityForState(appState.countryID, stateID);
    console.log(cities);
    handleSelection(cities, citySelectBox, "id", "name", "Select City", appState.userWhoWillUpdate.city.id
    );
};

//sorting
let shortTableWithPerticulerField = (direction, sortWith, value) => {
    let sorted = [];
    let allArrows = document.querySelectorAll(".arrow");
    allArrows.forEach((e) => {
        e.classList.remove("hide");
    });

    switch (direction.value) {
        case "ascending":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) => a[sortWith] < b[sortWith] ? -1 : a[sortWith] == b[sortWith] ? 0 : 1);
            display(sorted);
            break;
        case "descending":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) =>
                a[sortWith] > b[sortWith] ? -1 : a[sortWith] == b[sortWith] ? 0 : 1
            );
            display(sorted);

            break;
        case "ascendingWithValue":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) => a[sortWith][value] < b[sortWith][value] ? -1 : a[sortWith][value] == b[sortWith][value] ? 0 : 1);
            display(sorted);
            break;
        case "descendingWithValue":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) => a[sortWith][value] > b[sortWith][value] ? -1 : a[sortWith][value] == b[sortWith][value] ? 0 : 1);
            display(sorted);
            break;
        case "dateAsc":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) => {
                a = new Date(a[sortWith]);
                b = new Date(b[sortWith]);
                return a - b;
            });
            display(sorted);
            break;
        case "dateDesc":
            direction.classList.add("hide");
            sorted = appState.users.toSorted((a, b) => {
                a = new Date(a[sortWith]);
                b = new Date(b[sortWith]);
                return b - a;
            });
            display(sorted);
            break;
        case "0":
            display(getFromStorage("users"));
            break;
        default:
            break;
    }
};

function checkIsObject(obj) {
    return typeof obj == "object" && !Array.isArray(obj) ? true : false;
}

function find(obj, value, key) {
    let result = false;
    function checkValueOfObject(obj, value, key) {
        key.forEach((e) => {
            if (!checkIsObject(obj[e])) {
                result = obj[e].toLowerCase().indexOf(value.toLowerCase()) != -1 && true;
                return;
            }
            let keys = Object.keys(obj[e]);
            checkValueOfObject(obj[e], value, keys);
        });
        return result;
    }
    return checkValueOfObject(obj, value, key);
}

function findByKeys(inputValue, key) {
    return getFromStorage("users").filter((element) => find(element, inputValue, [key]) ? element : false);
}

document.getElementById("searchBox").addEventListener("input", (event) => {
    let selectedKey = document.getElementById("select").value;
    let value = event.target.value;
    let searchedUsers = findByKeys(value, selectedKey);
    display(searchedUsers);
    appState.users = searchedUsers
});

//when page is load then...
fetchDATA()
handleSelection(country, countrySelectBox, "cid", "country", "Select Country");
handleSelection([], stateSelectBox, "", "", "Select State");
handleSelection([], citySelectBox, "", "", "Select City");
setInStorage("users", appState.users);
display(getFromStorage("users"));
