let dataTable = document.getElementById("data");
let countryState = []
let statesState = []
let cityState = []

let users = [
    {
        name: "jasmin axim",
        email: "bhesaniya@gmail.com",
        gender: "male",
        hobby: ["reading", "sports"],
        country: "india",
        state: "gujarat",
        city: "surat",
    },
    {
        name: "divyesh kubavat",
        email: "dkubavat@gmail.com",
        gender: "male",
        hobby: ["reading"],
        country: "india",
        state: "gujarat",
        city: "surat",
    },
];

let country = [
    {
        cid: 0,
        country: "India"
    },
    {
        cid: 1,
        country: "UnitedStates",
    },
    {
        cid: 2,
        country: "China",
    },
    {
        cid: 3,
        country: "UnitedKingdom"
    }
]


let state = [
    {
        cid: 0,
        states: [
            {
                sid : 0 ,
                state : "Gujarat"
            },
            {
                sid : 1,
                state : "Maharshtra",
            },
            {
                sid : 2,
                state : "MadhyaPradesh",
            },
            {
                sid : 3,
                state : "Rajsthan",
            }
        ]
    },
    {
        cid: 1,
        states: [
            {
                sid : 0 ,
                state : "California"
            },
            {
                sid : 1,
                state : "NewYork",
            },
            {
                sid : 2,
                state : "Texas",
            },
            {
                sid : 3,
                state : "Florida",
            }
        ]
    },

]

let city = [ 
    {
        cid : 0,
        sid : 0,
        cities : [{ name : "Surat"}, {name : "Rajkot"}, {name : "Ahmdabad"}, {name : "Vadodra"}, {name : "Amreli"}, {name : "Navsari"}, {name : "Kamrej"}]
    },
    {
        cid : 0,
        sid : 1,
        cities : [{name : "Mumbai"}, {name : "Nagpur"}, {name : "Aurangabad"}, {name : "Nashik"}, {name : "Pune"}, {name : "Amravati"}, {name : "Thane"}]
    },
    {
        cid : 0,
        sid : 2,
        cities : [{name : "Gwalior"}, {name : "Orchha"}, {name  : "Khajuraho"}, {name : "Omkareshwar"}, {name : "Chitrakoot"},{name:  "Mandu"}, {name : "Jabalpur"}, {name : "Sanchi"}, {name : "Kanha"}, {name : "Ujjain"}, {name : "Panchmarhi"}]
    },
    {
        cid : 0,
        sid : 3,
        cities : [{name : "jaipur"}, {name : "Jodhpur"}, {name : "Kota"}, {name : "Udaipur"}, {name : "Ajmer"}, {name : "Sikar"}, {name : "Pall"}, {name : "Tonk"}]
    },
    {
        cid : 1,
        sid : 0,
        cities : [{name : "Los Angeles"}, {name : "San Francisco"}, {name : "San Diego"}, {name : "Sacramento"}, {name : "San Jose"}, {name : "Oakland"},{name :  "Fresno"}]
    },
    {
        cid : 1,
        sid : 1,
        cities : [{name : "New York City"}, {name : "Buffalo"}, {name : "Rochester"}, {name : "Syracuse"}, {name : "Albany"}, {name : "Yonkers"},{name:"Utica"}]
    },
    {
        cid : 1,
        sid : 2,
        cities : [{name : "Houston"}, {name : "Dallas"}, {name : "San Antonio"}, {name : "Austin"}, {name : "Fort Worth"}, {name : "El Paso"}, {name : "Arlington"}]
    },
    {
        cid : 1,
        sid : 3,
        cities : [{name : "Miami"}, {name : "Tampa"}, {name : "Orlando"}, {name : "Jacksonville"}, {name : "Fort Lauderdale"}, {name : "Tallahassee"}, {name : "St. Petersburg"}]
    },
 ]



let display = (array) => {
    let target = document.getElementById("data");
    let text = "<tr>";

    array.map((item) => {
        for (const key in item) {
            text += `<td>${item[key]}</td>`;
        }
        text += `<td class='action'>
        <button class="btnEdit">Edit</button>
        <button class="btnDelete">Delete</button>
       </td>`;
        text += `</tr>`;
    });

    target.innerHTML = text;
};


display(users);

let countrySelectBox = document.getElementById("country")
let stateSelectBox = document.getElementById("state")
let citySelectBox = document.getElementById("city")



let getCountry = () =>{
    return country.map(e => e)
}

let getStateForContry = (id) =>{
    return state.filter((e)=> {
        if (id == e.cid) {
           return e.states
        }
    } ).map((e)=>e.states)
}
  

let getCityForState = (cid , sid) =>{
    return city.filter((e)=>{
        if (e.sid == sid && e.cid == cid) {
            return e
        }
    }).map((e)=> e.cities)
}

let handleSelection = (array , selectedBox , val , text)=>{
    let bind = ''
    array?.forEach((e)=>{
        bind += `<option value='${e[val]}' >${e[text]}</option>`
    })
    selectedBox.innerHTML = bind
}


let countries = getCountry()

handleSelection(country , countrySelectBox , 'cid' , 'country' )

var cid ;
countrySelectBox.addEventListener("change", (event) =>{
    cid = event.target.value;
    let allState = getStateForContry(cid)[0]
    handleSelection(allState , stateSelectBox , 'sid' , 'state' )
    citySelectBox.innerHTML = ''
})


stateSelectBox.addEventListener("change" , (event)=>{
    let sid = event.target.value
    let cities = getCityForState(cid , sid)
    handleSelection(cities[0] , citySelectBox , 'name' , 'name' )
})



//when user submitng form...
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    let name = document.forms["form"]["name"].value;
    let email = document.forms["form"]["email"].value;
    let gender = document.forms["form"]["gender"].value;
    let chkBox = document.querySelectorAll("input[type='checkbox']:checked");
    let hobbies = [];
    chkBox.forEach((e) => hobbies.push(e.value));
    let selectedAddress = document.querySelectorAll("select");
});