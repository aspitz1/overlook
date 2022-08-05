import './images/favicon.png';
import './css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

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
const setError = (element) => {
    element.setAttribute('style', 'color: red');
    element.setAttribute('role', 'alert');
    element.setAttribute('tabindex', -1);
    element.focus();
}

const loginAsManager = () => {
    Promise.all([getFetch('customers'), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            manager = new Manager({customers: data[0].customers, allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
            hideOff([dashboardSectionManager]);
            hideOn([loginSection]);
        })
        .catch(console.error);

}

const loginAsCustomer = (loginNum) => {
    Promise.all([getFetch(`customers/${loginNum}`), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            customer = new Customer({customer: data[0], allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
            hideOff([dashboardSectionCustomer]);
            hideOn([loginSection]);
            loadCustomerDash();  
        })
        .catch(console.error);

}

const loadCustomerDash = () => {
    console.log(customer);
    dashboardSectionCustomer.innerHTML = (`
        <nav class="customer-dash-nav">
            <button class="book-room-btn" id="bookRoomBtn">Book a Room</button>
        </nav>
        <h1 class="customer-dash-heading">Welcome back ${customer.name}!</h1>
        <section class="upcoming-bookings-section" id="upcomingBookingSection">
            <h2 class="customer-dash-section-heading">Upcoming Bookings</h2>
        </section>
        <section class="past-bookings-section" id="pastBookingSection">
            <h2 class="customer-dash-section-heading">Past Bookings</h2>
        </section>
        <section class="total-spent-section" id="totalSpentSection">
            <h2 class="customer-dash-section-heading">Total Amount Spent on Past Bookings</h2>
            <p class="customer-dash-total-spent">$${customer.returnTotalSpent(hotel.allRooms)}</p>
        </section>
    `);
    buildBookings({bookings: customer.futureBookings, elementID: 'upcomingBookingSection'});
    buildBookings({bookings: customer.pastBookings, elementID: 'pastBookingSection'});

}

const buildBookings = (bookingsAndElementID) => {
    bookingsAndElementID.bookings.forEach(booking => {
        const room = hotel.findRoom(booking.roomNumber);
        document.querySelector(`#${bookingsAndElementID.elementID}`).innerHTML += (`
            <button class="booking-detail-btn" id="bookingDetailBtn data-bookingID=${booking.id}" data-roomNum="${booking.roomNumber}">
                <p class="booking-info">${booking.date}</p>
                <p class="booking-info">Room Number: ${booking.roomNumber}</p>
                <p class="booking-info">Cost Per Night: $${room.costPerNight}</p>
            </button>
        `);
    });
} 

window.addEventListener('load', () => {
    hideOff([loginSection]);
    loginSection.innerHTML = (`
        <h1 class="login-heading">Welcome to Overlook</h1>
        <p class="login-description" id="loginDescription">Please sign in.</p>
        <form>
            <div class="login-name-wrapper">
                <label class="hidden" for="login-name">Login Name: </label>
                <input class="login-name-input" id="loginName" type="text" name="login-name" placeholder="Login Name">
            </div>
            <div class="password-wrapper">
                <label class="hidden" for="password">Password: </label>
                <input class="password-input" id="password" type="password" name="password" placeholder="Password">
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
        const loginDescription = document.querySelector('#loginDescription');
        if (!loginName.length || !password.length) {
            loginDescription.innerHTML = '<i class="fa-solid fa-x"></i> Please enter your login name and password.';
            setError(loginDescription);
        } else if (password === 'overlook2021' && loginName === 'manager') {
            loginAsManager();
        } else if (password === 'overlook2021' && loginName.includes('customer') && loginName.replace('customer', '') <= 50) {
            loginAsCustomer(loginName.replace('customer', ''));
        } else {
            loginDescription.innerHTML = '<i class="fa-solid fa-x"></i> Invalid login credentials.';
            setError(loginDescription);
        }
    }

});