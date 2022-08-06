/* IMPORTS */

import './images/favicon.png';
import './css/style.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import Customer from './classes/Customer';
import Manager from './classes/Manager';
import Hotel from './classes/Hotel';

import { getFetch, cancelBooking } from './api-calls';
import { rooms } from '../test/test-data/Room-data';

/* QUERY SELECTORS */

const loginSection = document.querySelector('#loginSection');
const dashboardSectionCustomer = document.querySelector('#dashboardSectionCustomer');
const dashboardSectionManager = document.querySelector('#dashboardSectionManager');
const bookRoomSectionCustomer = document.querySelector('#bookRoomSectionCustomer');
const boodRoomSectionManager = document.querySelector('#boodRoomSectionManager');

/* VARIABLES */

let customer;
let manager;
let hotel;

const cancelMessege = 'Your booking has been canceled. We are sorry you can\'t make it.';
const bookedMessege = 'Your room has been booked! We are looking forward to your stay.';

/* UTILITY FUNCTIONS */

const makeUpperCase = (string) => string.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
const getTodaysDate = () => {
    let year = new Date().getFullYear().toString();
    let month = new Date().getMonth().toString();
    let date = new Date().getDate().toString();
    month = month.length === 1 ? 0 + month : month;
    date = date.length === 1 ? 0 + date : date;

    return `${year}/${month}/${date}`
}

const hideOn = (elements) => elements.forEach(element => element.classList.add('hidden'));
const hideOff = (elements) => elements.forEach(element => element.classList.remove('hidden'));
const setError = (element) => {
    element.setAttribute('style', 'color: red');
    element.setAttribute('role', 'alert');
    element.setAttribute('tabindex', -1);
    element.focus();

}

const makeDateDisplay = (date) => {
  const dateNums = date.split("/")
  const year = dateNums.shift()
  dateNums.push(year)
  return dateNums.join('/')
};


/* FUNCTIONS */

const refreshCustomerAndHotel = (statusMessege) => {
    Promise.all([getFetch(`customers/${customer.id}`), getFetch('bookings')]) 
    .then(data => {
        customer = new Customer({customer: data[0], allBookings: data[1].bookings});
        hotel = new Hotel({allRooms: hotel.allRooms, allBookings: data[1].bookings});
            dashboardSectionCustomer.innerHTML = (`
                <nav class="customer-dash-nav">
                    <button class="dash-btn" id="dashBtn">Dashboard</book>
                    <button class="book-room-btn" id="bookRoomBtn">Book a Room</button>
                </nav>
                <h1 class="" tabindex="-1">${statusMessege}</h1>
                `)      
            })
            .catch(console.error);
        }
        
        const buildBookings = (bookingsAndElementID) => {
            if (!bookingsAndElementID.bookings.length) {
                document.querySelector(`#${bookingsAndElementID.elementID}`).innerHTML += (`
                <p class="booking-info">You don't have any bookings to show.</p>
                `);
            } else {
                bookingsAndElementID.bookings.forEach(booking => {
                    const room = hotel.findRoom(booking.roomNumber);
                    document.querySelector(`#${bookingsAndElementID.elementID}`).innerHTML += (`
                    <button class="booking-detail-btn" id="bookingDetailBtn" type="button" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">
                        <p class="booking-info" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">${makeDateDisplay(booking.date)}</p>
                        <p class="booking-info" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Room Number: ${booking.roomNumber}</p>
                        <p class="booking-info" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Cost Per Night: $${room.costPerNight}</p>
                        <p class="screen-reader-only">Click for room info</p>
                    </button>
                    `);
                });
            }
            
        } 
        
        const displayCustomerDash = () => {
            hideOff([dashboardSectionCustomer]);
            hideOn([loginSection, bookRoomSectionCustomer]);
            dashboardSectionCustomer.innerHTML = (`
            <nav class="customer-dash-nav">
                <button class="book-room-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
            </nav>
            <h1 class="customer-dash-heading" tabindex="-1">Welcome back ${customer.name}!</h1>
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
    
    const showSelectBooking = (bookingIDAndRoom) => {
        const selectedBooking = hotel.findBooking(bookingIDAndRoom.selectedBooking);
        const hasBidet = bookingIDAndRoom.selectedRoom.bidet ? 'This room has a bidet' : 'This room doesn\'t have a bidet';
        dashboardSectionCustomer.innerHTML = (`
        <nav class="customer-dash-nav">
            <button class="dash-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
            <button class="book-room-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
        </nav>
        <h1 class="room-description-heading" tabindex="-1">A Beautiful ${makeUpperCase(bookingIDAndRoom.selectedRoom.roomType)}</h1>
        <p class="room-description">Cost Per Night: $${bookingIDAndRoom.selectedRoom.costPerNight}</p>
        <ul class="room-description-list">
            <li>${makeUpperCase(bookingIDAndRoom.selectedRoom.bedSize)} bed</li>
            <li>Has ${bookingIDAndRoom.selectedRoom.numBeds} bed(s)</li>
            <li>${hasBidet}</li>
            <li>The room number is ${bookingIDAndRoom.selectedRoom.number}</li>
        </ul>
        `);
        if (selectedBooking.date >= getTodaysDate()) {
            dashboardSectionCustomer.innerHTML += (`
            <p class="room-description">${makeDateDisplay(selectedBooking.date)}</p>
            <button class="cancel-btn" id="cancelBtn" data-selectedBookingID="${selectedBooking.id}"><i class="fa-solid fa-rectangle-xmark"></i> Cancel Booking</button>
            `)
        }
    }
    
    const confirmCancel = (bookingID) => {
        document.getElementById('cancelBtn').remove();
        dashboardSectionCustomer.innerHTML += (`
        <form class="confirm-cancel-form" tabindex="-1">
            <lable class="confirm-cancel-label" for="confirm-cancel">Are you sure you want too cancel?</label>
            <input class="confirm-cancel-btn" id="confirmCancelBtn" type="submit" name="confirm-cancel" value="Confirm" data-selectedBookingID="${bookingID}">
        </form>
        `);
    }
    
    const cancelBookingAndShowResponse = (bookingID) => {
        cancelBooking(bookingID)
        .then(response => {
            if (!response.ok) {
                throw 'Oops, looks like something went wrong. Please try agian.'
            } else {
                refreshCustomerAndHotel(cancelMessege);
            }
        
    })
    .catch(error => {
        dashboardSectionCustomer.innerHTML += (`<p id="bookingError">${error}</p>`);
        setError(document.getElementById('bookingError'));
    });
    
}

const bookRoomCustomer = () => {
    hideOn([dashboardSectionCustomer]);
    hideOff([bookRoomSectionCustomer]);
    bookRoomSectionCustomer.innerHTML = (`
    <nav class="customer-dash-nav">
        <button class="dash-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
    </nav>
    <h1 class="room-picker-heading" tabindex="-1">Let's find your perfect room.</h1>
    <p class="room-picker-description">Pick the date of your stay.</p>
    <form id="roomPicker">
        <label class="room-picker-label" for="stay-date">Pick your stay date: </label>
        <input class="room-picker-date" type="date" id="datePicker" name="stay-date" value="${getTodaysDate().split('/').join('-')}" min="${getTodaysDate().split('/').join('-')}" max="2024-01-01">
        <input class="room-picker-btn" id="roomPickerBtn" type="submit" value="Find Rooms">
    </form>
    `)
}

const displayAvailibleRooms = (date) => {
    // fix navbar for bookRoomSectionCustomer section
    bookRoomSectionCustomer.innerHTML = (`
    <nav class="customer-dash-nav">
        <button class="dash-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
    </nav>
    `);
    const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(date).availibleRooms;
    if (!availibleRooms.length) {
        bookRoomSectionCustomer.innerHTML += (`
        <h1 class="room-picker-heading" tabindex="-1">There are no availible rooms for ${makeDateDisplay(date)}.</h1>
        <p class="room-picker-description">We're so sorry! We are looking forward to having you, can you come another night?</p>
        <button class="return-btn" id="returnToPickerBtn">Pick another Date</button>
        `)
    } else {
        bookRoomSectionCustomer.innerHTML += (`
            <h1 class="room-picker-heading" id="roomPickerHeading" tabindex="-1">Here are all availible rooms for ${makeDateDisplay(date)}.</h1>
            <form class="filter-rooms-form" id="filterRooms">
                <label class="room-picker-label" for="room-type">Filter rooms by type: </lable>
                <select class="room-picker-room-type" id="filterRoomChoice" name="room-type">
                    <option class="room-type-option" value="">All Availible</option>
                    <option class="room-type-option" value="residential suite">Residential Suite</option>
                    <option class="room-type-option" value="suite">Suite</option>
                    <option class="room-type-option" value="single room">Single Room</option>
                    <option class="room-type-option" value="junior suite">Junior Suite</option>
                </select> 
                <input class="room-filter-btn" id="roomFilterBtn" type="button" value="Filter" data-date="${date}">
            </form>
            <section class="availible-room-section" id="availibleRoomSection"></section>
            `)
            
            displayRoomsAndDetails({rooms: availibleRooms, date: date, element: 'availibleRoomSection'})
        }
        
    }
    
    const displayFilteredRoomDetails = (dateAndRoomType) => {
        const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(dateAndRoomType.date).availibleRooms;
        if (!dateAndRoomType.roomType.length) {
            document.getElementById('roomPickerHeading').innerText = (`Here are all availible rooms for ${makeDateDisplay(dateAndRoomType.date)}.`)
            displayRoomsAndDetails({rooms: availibleRooms, date: dateAndRoomType.date, element: 'availibleRoomSection'});
        } else {
            const filteredRooms = hotel.filterRoomsByType({rooms: availibleRooms, roomType: dateAndRoomType.roomType});
            if (!filteredRooms.length) {
                document.getElementById('roomPickerHeading').innerText = (`Sorry, there are no rooms with the type ${makeUpperCase(dateAndRoomType.roomType)} availible for ${makeDateDisplay(dateAndRoomType.date)}.`)
            } else {
                document.getElementById('roomPickerHeading').innerText = (`Here are all the rooms with the type ${makeUpperCase(dateAndRoomType.roomType)} availible for ${makeDateDisplay(dateAndRoomType.date)}.`)
            displayRoomsAndDetails({rooms: filteredRooms, date: dateAndRoomType.date, element: 'availibleRoomSection'});
        }
    }
    
}

const displayRoomsAndDetails = (roomsDateAndElementID) => {
    document.getElementById(roomsDateAndElementID.element).innerHTML = '';
    roomsDateAndElementID.rooms.forEach(room => {
        const hasBidet = room.bidet ? 'Has a bidet' : 'Doesn\'t have a bidet';
        document.getElementById(roomsDateAndElementID.element).innerHTML += (`
        <article class="room-wrapper">
        <p class="room-description">${makeUpperCase(room.roomType)}</p>
        <ul class="room-description-list">
        <li class="room-description-li">Room number ${room.number}</li>
        <li class="room-description-li">${makeUpperCase(room.bedSize)} bed</li>
        <li class="room-description-li">${room.numBeds} bed(s)</li>
        <li class="room-description-li">${hasBidet}</li>
        <li class="room-description-li">$${room.costPerNight} per night</li> 
        </ul>
        <button class="select-room-btn" id="selectRoomBtn" data-customerID="${customer.id}" data-date="${roomsDateAndElementID.date}" data-roomNumber="${room.roomNumber}">Book</button>
        </article>
        `);
    })
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
            displayCustomerDash();  
        })
        .catch(console.error);

}

/* EVENT LISTENERS */

window.addEventListener('load', () => {
    hideOff([loginSection]);
    loginSection.innerHTML = (`
        <h1 class="login-heading">Welcome to Overlook</h1>
        <p class="login-description" id="loginDescription">Please sign in.</p>
        <form>
            <div class="login-name-wrapper">
                <label class="screen-reader-only" for="login-name">Login Name: </label>
                <input class="login-name-input" id="loginName" type="text" name="login-name" placeholder="Login Name">
            </div>
            <div class="password-wrapper">
                <label class="screen-reader-only" for="password">Password: </label>
                <input class="password-input" id="password" type="password" name="password" placeholder="Password">
            </div>
            <input class="login-submit-btn" id="loginSubmitBtn" type="submit" value="Login"> 
        <form>
    `);

});

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

dashboardSectionCustomer.addEventListener('click', (event) => {
    if (event.target.getAttribute('data-bookingID')) {
        const selectedRoom = hotel.findRoom(parseInt(event.target.getAttribute('data-roomNum')));
        if (event.target.getAttribute('data-date') < getTodaysDate()) {
            showSelectBooking({selectedBooking: event.target.getAttribute('data-bookingID'), selectedRoom: selectedRoom})
        } else if (event.target.getAttribute('data-date') >= getTodaysDate()){
            showSelectBooking({selectedBooking: event.target.getAttribute('data-bookingID'), selectedRoom: selectedRoom});
        } 
    } else if (event.target.id === 'dashBtn') {
            displayCustomerDash();
    } else if (event.target.id === 'cancelBtn') {
        confirmCancel(event.target.getAttribute('data-selectedBookingID'));
    } else if (event.target.id === 'confirmCancelBtn') {
        event.preventDefault();
        cancelBookingAndShowResponse(event.target.getAttribute('data-selectedBookingID'));
    } else if (event.target.id === 'bookRoomBtn') {
        bookRoomCustomer();
    }

});


bookRoomSectionCustomer.addEventListener('click', (event) => {
    if (event.target.id === 'roomPickerBtn') {
        event.preventDefault();
        displayAvailibleRooms(document.getElementById('datePicker').value.split('-').join('/'));
    } else if (event.target.id === 'roomFilterBtn') {
        event.preventDefault();
        displayFilteredRoomDetails({roomType: document.getElementById('filterRoomChoice').value, date: event.target.getAttribute('data-date')});
    } else if (event.target.id === 'dashBtn') {
        displayCustomerDash();
    }
});