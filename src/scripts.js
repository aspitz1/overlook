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

startApp({login: 'customer3', password: 'overlook2021'});

const hideOn = (elements) => elements.forEach(element => element.classList.add('hidden'));
const hideOff = (elements) => elements.forEach(element => element.classList.remove('hidden'));