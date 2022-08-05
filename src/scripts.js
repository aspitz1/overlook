import './images/favicon.png';
import './css/style.css';

import Customer from './classes/Customer';
import Manager from './classes/Manager';
import Hotel from './classes/Hotel';

import getFetch from './api-calls';

const loginSection = document.querySelector('#loginSection');
const dashboardSectionCustomer = document.querySelector('#dashboardSectionCustomer');
const dashboardSectionManager = document.querySelector('#dashboardSectionManager');
const bookRoomSectionCustomer = document.querySelector('#bookRoomSectionCustomer');
const boodRoomSectionManager = document.querySelector('#boodRoomSectionManager');

let customer;
let manager;
let hotel;

const hideOn = (elements) => elements.forEach(element => element.classList.add('hidden'));
const hideOff = (elements) => elements.forEach(element => element.classList.remove('hidden'));

const loginAsManager = () => {
    Promise.all([getFetch('customers'), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            manager = new Manager({customers: data[0].customers, allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
        })
        .catch(console.error);

}

const loginAsCustomer = (loginNum) => {
    Promise.all([getFetch(`customers/${loginNum}`), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            customer = new Customer({customer: data[0], allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});   
        })
        .catch(console.error);

}

const startApp = (loginData) => {
    if (loginData.login === 'manager' && loginData.password === 'overlook2021') {
        loginAsManager();
    } else if (loginData.login.includes('customer') && loginData.password === 'overlook2021') {
        loginAsCustomer(loginData.login.replace('customer', ''));
    }

}

window.addEventListener('load', () => {
    hideOff([loginSection]);
    loginSection.innerHTML = (`
        <h1 class="login-heading">Welcome to Overlook</h1>
        <p class="login-description">Please sign in.</p>
        <form>
            <div class="login-name-wrapper">
                <label class="hidden" for="login-name">Login Name: </label>
                <input class="login-name-input" id="loginName" type="text" name="login-name" placeholder="Login Name" required>
            </div>
            <div class="password-wrapper">
                <label class="hidden" for="password">Password: </label>
                <input class="password-input" id="password" type="password" name="password" placeholder="Password" required>
            </div>
            <input class="login-submit-btn" id="loginSubmitBtn" type="submit" value="Login"> 
        <form>
    `)
})

loginSection.addEventListener('click', (event) => {
    if (event.target.id === 'loginSubmitBtn') {
        event.preventDefault();
        const loginName = document.querySelector('#loginName').value;
        const password = document.querySelector('#password').value;
        if (loginName.length || password.length) {
            // make login-description give info on missing login/password. remember to focus
        }
    }
});