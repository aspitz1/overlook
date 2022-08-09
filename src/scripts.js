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

import { getFetch, cancelBooking, postBooking } from './api-calls';

/* QUERY SELECTORS */

const loginSection = document.querySelector('#loginSection');
const dashboardSectionCustomer = document.querySelector('#dashboardSectionCustomer');
const dashboardSectionManager = document.querySelector('#dashboardSectionManager');
const bookRoomSectionCustomer = document.querySelector('#bookRoomSectionCustomer');
const bookRoomSectionManager = document.querySelector('#bookRoomSectionManager');

/* VARIABLES */

let customer;
let manager;
let hotel;

const cancelMessege = '<h1>Your booking has been canceled.</h1><p>We are sorry you can\'t make it.</p>';
const bookedMessege = '<h1></><i class="fa-solid fa-face-smile-beam"></i> Your room has been booked!</h1><p>We are looking forward to your stay.</p>';

/* UTILITY FUNCTIONS */

const makeUpperCase = (string) => string.split(' ').map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ');
const getTodaysDate = () => {
    let year = new Date().getFullYear().toString();
    let month = (new Date().getMonth() + 1).toString();
    let date = new Date().getDate().toString();
    month = month.length === 1 ? 0 + month : month;
    date = date.length === 1 ? 0 + date : date;

    return `${year}/${month}/${date}`;
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
    const dateNums = date.split("/");
    const year = dateNums.shift();
    dateNums.push(year);
    return dateNums.join('/');
};


/* FUNCTIONS */

const refreshCustomerAndHotel = (statusMessege) => {
    Promise.all([getFetch(`customers/${customer.id}`), getFetch('bookings')]) 
    .then(data => {
        customer = new Customer({customer: data[0], allBookings: data[1].bookings});
        hotel = new Hotel({allRooms: hotel.allRooms, allBookings: data[1].bookings});
        hideOff([dashboardSectionCustomer]);
        hideOn([bookRoomSectionCustomer]);
        dashboardSectionCustomer.innerHTML = (`
            <nav class="nav">
                <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
                <button class="nav-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
            </nav>
            <div class="status-msg-wrapper" id="statusMsgWrapper"></div>
            `)
            document.getElementById('statusMsgWrapper').innerHTML = statusMessege;      
        })
        .catch(err => {
            dashboardSectionCustomer.innerHTML = (`
            <nav class="nav">
                <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
                <button class="nav-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
            </nav>
            <h1 class="heading">Sorry, it looks like something went wrong reloading the page. Error: ${err}</h1>
            `)
        });

}

const refreshManagerHoterAndCustomers = (cancledOrConfirmed) => {
    Promise.all([getFetch('customers'), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            manager = new Manager({customers: data[0].customers, allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
            displayManagerDash();
            document.getElementById('managerDashHeading').innerText = `${customer.name}'s booking is ${cancledOrConfirmed}.`
            customer = null;
        })
        .catch(error => {
            setError(document.getElementById('loginDescription'));
            document.getElementById('loginDescription').innerHTML = `<i class="fa-solid fa-x"></i> Looks like something went wrong. Error: ${error}`
    });

}
        
const buildBookings = (bookingsAndElementID) => {
    if (!bookingsAndElementID.bookings.length) {
        document.querySelector(`#${bookingsAndElementID.elementID}`).innerHTML += (`
            <p class="informational-p">You don't have any bookings to show.</p>
        `);
    } else {
        bookingsAndElementID.bookings.forEach(booking => {
            const room = hotel.findRoom(booking.roomNumber);
            document.querySelector(`#${bookingsAndElementID.elementID}`).innerHTML += (`
                <button class="booking-detail-btn" id="bookingDetailBtn" type="button" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">
                    <p class="information" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">${makeDateDisplay(booking.date)}</p>
                    <p class="information" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Room Number: ${booking.roomNumber}</p>
                    <p class="information" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Cost Per Night: $${room.costPerNight}</p>
                    <p class="screen-reader-only">Click for room info</p>
                </button>
            `);
        });
    }
        
} 

const displayCustomerSearch = () => {
    hideOff([dashboardSectionManager]);
    hideOn([bookRoomSectionManager]);
    dashboardSectionManager.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="managerDashBtn"><i class="fa-solid fa-house-chimney"></i> Dashboard</button>
        </nav>
        <h1 class="customer-search-heading">Let's get to work!</h1>
        <section class="search-customer-wrapper">
            <label class="search-label" for="customer-search">Search for customer by name: </label>
            <input class="search-input" id="customerSearchInput" type="test" name="customer-search">
            <input class="search-btn" id="customerSearchBtn" type="button" value="Find Customer">
            <p class="information hidden" id="invalidName"><i class="fa-solid fa-x"></i> This isn't a valid name.</p>
        </section>
    `);

}

const displayCustomer = (customerData) => {
    dashboardSectionManager.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="managerDashBtn"><i class="fa-solid fa-house-chimney"></i> Dashboard</button>
            <button class="nav-btn" id="managerFindCustomerBtn"><i class="fa-solid fa-bell-concierge"></i> Find a Customer</button>
        </nav>
    `);

    if (customerData.name) {
        customer = customerData;
        displayCustomerInfoManager();
        buildFutureCustomerBookingsManager();
        buildPastCustomerBookingsManager();
    } else {
        dashboardSectionManager.innerHTML += (`
            <h1 class="heading">${customerData}<h1>
        `);
    }
}

const displayCustomerInfoManager = () => {
    dashboardSectionManager.innerHTML += (`
            <h1 class="customer-info-heading">Here is ${customer.name}'s information.</h1>
            <section class="customer-date-wrapper">
                <p class="customer-info">ID: ${customer.id}</p>
                <p class="customer-info">Total Spent: ${customer.returnTotalSpent(hotel.allRooms)}</p>
                <button class="make-booking-btn" id="makeBookingBtnManager">Make Booking</button>
            </section>
            <h2 class="heading-manager-customer">Future Bookings</h2>
            <section class="list-bookings-manager" id="futureBookingsManager">
            </section>
            <h2 class="heading-manager-customer">Past Bookings</h2>
            <section class="list-bookings-manager" id="pastBookingsManager"></section>
        `);

}

const buildFutureCustomerBookingsManager =() => {
    customer.futureBookings.forEach(booking => {
            document.getElementById('futureBookingsManager').innerHTML += (`
                <article class="customer-booking-article" id="a${booking.id}">
                    <p class="booking-info">ID: ${booking.id}</p>
                    <p class="booking-info">Date: ${makeDateDisplay(booking.date)}</p>
                    <p class="booking-info">Room Number: ${booking.roomNumber}</p>
                    <button class="cancel-btn" id="${booking.id}" data-bookingID="${booking.id}">Cancel</button>
                </article>
            `);
        });

}

const buildPastCustomerBookingsManager = () => {
     customer.futureBookings.forEach(booking => {
            document.getElementById('pastBookingsManager').innerHTML += (`
                <article class="customer-booking-article">
                    <p class="information">ID: ${booking.id}</p>
                    <p class="information">Date: ${makeDateDisplay(booking.date)}</p>
                    <p class="information">Room Number: ${booking.roomNumber}</p>
                </article>
            `);
        }); 

}

const confirmCancelManager = (bookingID) => {
    document.getElementById(bookingID).setAttribute('data-confirmCancel', 'true');
    document.getElementById(bookingID).innerText = 'Confirm Cancelation';

}

const confirmBookingManager = (elementID) => {
    document.getElementById(elementID).setAttribute('data-confirmBooking', 'true');
    document.getElementById(elementID).innerText = 'Confirm Booking';

}

const makeBookingDashManager = () => {
    hideOn([dashboardSectionManager]);
    hideOff([bookRoomSectionManager]);

    bookRoomSectionManager.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="managerDashBtn"><i class="fa-solid fa-house-chimney"></i> Dashboard</button>
            <button class="nav-btn" id="managerFindCustomerBtn"><i class="fa-solid fa-bell-concierge"></i> Find a Customer</button>
        </nav>
        <section class="book-for-customer-section" id="bookForCustomerSection">
            <h1 class="manager-book-room-heading">Let's make your customer's booking.</h1>
            <form class="room-picker-manager-form" id="roomPickerManager">
                <label class="search-label" for="stay-date">Pick your stay date: </label>
                <input class="search-intput-calander" type="date" id="datePickerManager" name="stay-date" value="${getTodaysDate().split('/').join('-')}" min="${getTodaysDate().split('/').join('-')}" max="2024-01-01">
                <input class="search-btn" id="roomPickerBtnManager" type="submit" value="Find Rooms">
            </form>
            </section>
        <section class="manager-display-availible-rooms" id="availibleRoomSectionManager"></section>
    `)

} 

const displayAvailibleRoomsManager = (date) => {
    const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(date).availibleRooms
    if (!availibleRooms.length) {
        document.getElementById('availibleRoomSectionManager').innerHTML = ('<h1 class="heading">We\'re so sorry. Looks like we are all booked up for this night.</h1>');
    } else {
        displayAvailibleUnfilteredRooms({rooms: availibleRooms, date: date, element: document.getElementById('availibleRoomSectionManager')});
    }

}

const displayManagerDash = () => {
    hideOff([dashboardSectionManager]);
    hideOn([loginSection, bookRoomSectionManager]);
    dashboardSectionManager.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="managerFindCustomerBtn"><i class="fa-solid fa-bell-concierge"></i> Find a Customer</button>
        </nav>
        <div class="manager-heading-wrapper">
            <h1 class="heading" id="managerDashHeading">Welcome, thanks for being here!</h1>
        </div>
        <section class="daily-stats-section" id="dailyStatsSection">
            <h2 class="heading-two-stats">Here are today's stats.</h2>
            <p class="stats-info"><i class="fa-solid fa-book-open"></i> There are ${hotel.getAvailibleAndUnavailibleRooms(getTodaysDate()).availibleRooms.length} availible rooms.</p>
            <p class="stats-info"><i class="fa-solid fa-book"></i> There are ${hotel.getAvailibleAndUnavailibleRooms(getTodaysDate()).unavailibleRooms.length} unavailible rooms.</p>
            <p class="stats-info"><i class="fa-solid fa-chart-line"></i> There is ${manager.getPercentAvailibleRooms({allRooms: hotel.allRooms, allBookings: hotel.allBookings, date: getTodaysDate()})} of rooms booked for tonight.</p>
        </section>
    `);

}
    
const displayCustomerDash = () => {
    dashboardSectionCustomer.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
        </nav>
        <div class="customer-heading-wrapper">
            <h1 class="heading customer-dash-heading white-font">Welcome back ${customer.name}!</h1>
        </div>
        <h2 class="heading-two booking-heading white-font">Upcoming Bookings</h2>
        <section class="bookings-section" id="upcomingBookingSection"></section>
        <h2 class="heading-two booking-heading white-font">Past Bookings</h2>
        <section class="bookings-section" id="pastBookingSection"></section>
        <section class="total-spent-section" id="totalSpentSection">
            <h2 class="heading-two">Total Amount Spent on Past Bookings</h2>
            <p class="amount-spent">$${customer.returnTotalSpent(hotel.allRooms)}</p>
        </section>
`);

    buildBookings({bookings: customer.futureBookings, elementID: 'upcomingBookingSection'});
    buildBookings({bookings: customer.pastBookings, elementID: 'pastBookingSection'});
        
}
    
const showSelectBooking = (bookingIDAndRoom) => {
    const selectedBooking = hotel.findBooking(bookingIDAndRoom.selectedBooking);
    const hasBidet = bookingIDAndRoom.selectedRoom.bidet ? 'This room has a bidet' : 'This room doesn\'t have a bidet';
    dashboardSectionCustomer.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
            <button class="nav-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
        </nav>
        <div class="room-display-wrapper" id="roomDisplayWrapper">
            <h1 class="heading">A Beautiful ${makeUpperCase(bookingIDAndRoom.selectedRoom.roomType)}</h1>
            <p class="information">Cost Per Night: $${bookingIDAndRoom.selectedRoom.costPerNight}</p>
            <ul class="list">
                <li><i class="fa-solid fa-asterisk"></i> ${makeUpperCase(bookingIDAndRoom.selectedRoom.bedSize)} bed</li>
                <li><i class="fa-solid fa-asterisk"></i> Has ${bookingIDAndRoom.selectedRoom.numBeds} bed(s)</li>
                <li><i class="fa-solid fa-asterisk"></i> ${hasBidet}</li>
                <li><i class="fa-solid fa-asterisk"></i> The room number is ${bookingIDAndRoom.selectedRoom.number}</li>
            </ul>
        </div>
    `);
    
    if (selectedBooking.date >= getTodaysDate()) {
        document.getElementById('roomDisplayWrapper').innerHTML += (`
            <p class="information">Your booking is for ${makeDateDisplay(selectedBooking.date)}</p>
            <button class="cancel-btn" id="cancelBtn" data-selectedBookingID="${selectedBooking.id}"><i class="fa-solid fa-rectangle-xmark"></i> Cancel Booking</button>
    `);
    }

}
    
const confirmCancelCustomer = (bookingID) => {
    document.getElementById('cancelBtn').remove();
    document.getElementById('roomDisplayWrapper').innerHTML += (`
        <form class="form">
            <lable class="search-label" for="confirm-cancel">Are you sure you want too cancel?</label>
            <input class="cancel-btn" id="confirmCancelBtn" type="submit" name="confirm-cancel" value="Confirm" data-selectedBookingID="${bookingID}">
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
        <nav class="nav">
            <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
        </nav>
        <section class="find-room-wrapper">
            <h1 class="heading find-room-heading">Let's find your perfect room.</h1>
            <p class="information pick-date-info">Pick the date of your stay.</p>
            <form class="room-picker" id="roomPicker">
                <label class="search-label" for="stay-date">Pick your stay date: </label>
                <input class="search-intput-calander" type="date" id="datePicker" name="stay-date" value="${getTodaysDate().split('/').join('-')}" min="${getTodaysDate().split('/').join('-')}" max="2024-01-01">
                <input class="find-btn" id="roomPickerBtn" type="submit" value="Find Rooms">
            </form>
        </section>
    `);

}

const displayAvailibleRooms = (dateAndElement) => {
    dateAndElement.element.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
            <button class="nav-btn" id="backToSelectDate">Back</button>
        </nav>
    `);
    const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(dateAndElement.date).availibleRooms;
    if (!availibleRooms.length) {
        dateAndElement.element.innerHTML += (`
            <h1 class="heading">There are no availible rooms for ${makeDateDisplay(dateAndElement.date)}.</h1>
            <p class="information">We're so sorry! We are looking forward to having you, can you come another night?</p>
            <button class="search-btn" id="returnToPickerBtn">Pick another Date</button>
        `)
    } else {    
        displayAvailibleUnfilteredRooms({rooms: availibleRooms, date: dateAndElement.date, element: dateAndElement.element});
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

const displayAvailibleUnfilteredRooms = (roomsDateAndElement) => {
    roomsDateAndElement.element.innerHTML += (`
            <h1 class="heading availible-room-heading" id="roomPickerHeading">Here are all availible rooms for ${makeDateDisplay(roomsDateAndElement.date)}.</h1>
            <form class="form-filter" id="filterRooms">
                <label class="search-label-filter" for="room-type">Filter rooms by type: </label>
                <select class="room-type-select" id="filterRoomChoice" name="room-type">
                    <option class="room-type-option" value="">All Availible</option>
                    <option class="room-type-option" value="residential suite">Residential Suite</option>
                    <option class="room-type-option" value="suite">Suite</option>
                    <option class="room-type-option" value="single room">Single Room</option>
                    <option class="room-type-option" value="junior suite">Junior Suite</option>
                </select> 
                <input class="search-btn-filter" id="roomFilterBtn" type="button" value="Filter" data-date="${roomsDateAndElement.date}">
            </form>
            <section class="availible-room-section" id="availibleRoomSection"></section>
        `)   
    displayRoomsAndDetails({rooms: roomsDateAndElement.rooms, date: roomsDateAndElement.date, element: 'availibleRoomSection'})
        
}

const displayRoomsAndDetails = (roomsDateAndElementID) => {
    document.getElementById(roomsDateAndElementID.element).innerHTML = '';
    roomsDateAndElementID.rooms.forEach((room, i) => {
        const hasBidet = room.bidet ? 'Has a bidet' : 'Doesn\'t have a bidet';
        document.getElementById(roomsDateAndElementID.element).innerHTML += (`
            <article class="room-wrapper ${room.roomType.split(' ').join('-')}" id="room${room.number}">
                <p class="room-filter-info">${makeUpperCase(room.roomType)}</p>
                <ul class="list">
                    <li class="room-filter-info">Room number ${room.number}</li>
                    <li class="room-filter-info">${makeUpperCase(room.bedSize)} bed</li>
                    <li class="room-filter-info">${room.numBeds} bed(s)</li>
                    <li class="room-filter-info">${hasBidet}</li>
                    <li class="room-filter-info">$${room.costPerNight} per night</li> 
                </ul>
                <button class="book-btn" id="selectRoomBtn${room.number}" data-date="${roomsDateAndElementID.date}" data-roomNumber="${room.number}">Book</button>
            </article>
        `);
    });

}

const displayConfirmBooking = (dateAndRoomNum) => {
    const selectedRoom = hotel.findRoom(parseInt(dateAndRoomNum.roomNumber));
    bookRoomSectionCustomer.innerHTML = (`
        <nav class="nav">
            <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
            <button class="nav-btn" id="backToSelectRoom" data-date="${dateAndRoomNum.date}">Back</button>
        </nav>
        <section class="confirm-booking-customer">
            <h1 class="heading">Let's confirm your booking details.</h1>
            <p class="information">You have not booked this room yet, confirm below to book this room.</p>
            <ul class="list">
                <li><i class="fa-solid fa-asterisk"></i> Booking Date: ${makeDateDisplay(dateAndRoomNum.date)}</li>
                <li><i class="fa-solid fa-asterisk"></i> Room Type: ${selectedRoom.roomType}</li>
                <li><i class="fa-solid fa-asterisk"></i> Room Number: ${selectedRoom.number}</li>
                <li><i class="fa-solid fa-asterisk"></i> Bed Size: ${selectedRoom.bedSize}</li>
                <li><i class="fa-solid fa-asterisk"></i> Number of Beds: ${selectedRoom.numBeds}</li>
                <li><i class="fa-solid fa-asterisk"></i> Cost Per Night: $${selectedRoom.costPerNight}</li>
            </ul>
            <p class="hidden" id="bookingError"></p>
            <button class="confirm-btn" id="confirmBookingBtn" data-date="${dateAndRoomNum.date}" data-roomNumber="${dateAndRoomNum.roomNumber}">Confirm Booking</button>    
        </section>
    `);

}

const confirmBooking = (dateAndRoomNumber) => {
    const booking = hotel.makeBookingObj({id: customer.id, date: dateAndRoomNumber.date, roomNumber: dateAndRoomNumber.roomNumber});
    postBooking(booking)
        .then(data => {
            refreshCustomerAndHotel(bookedMessege)
        })
        .catch(error => {
            hideOff([document.getElementById('bookingError')])
            setError(document.getElementById('bookingError'))
            document.getElementById('bookingError').innerHTML = `<i class="fa-solid fa-x"></i> ${error}`;
        });

}

const loginAsManager = () => {
    Promise.all([getFetch('customers'), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            manager = new Manager({customers: data[0].customers, allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
            hideOff([dashboardSectionManager]);
            hideOn([loginSection]);
            displayManagerDash();
        })
        .catch(error => {
            setError(document.getElementById('loginDescription'));
            document.getElementById('loginDescription').innerHTML = `<i class="fa-solid fa-x"></i> Looks like something went wrong. Error: ${error}`
        });

}

const loginAsCustomer = (loginNum) => {
    hideOff([dashboardSectionCustomer]);
    hideOn([loginSection]);
    Promise.all([getFetch(`customers/${loginNum}`), getFetch('rooms'), getFetch('bookings')])
        .then(data => {
            customer = new Customer({customer: data[0], allBookings: data[2].bookings});
            hotel = new Hotel({allRooms: data[1].rooms, allBookings: data[2].bookings});
            displayCustomerDash();  
        })
        .catch(error => {
            setError(document.getElementById('loginDescription'));
            document.getElementById('loginDescription').innerHTML = `<i class="fa-solid fa-x"></i> Looks like something went wrong. Error: ${error}`
        });

}

/* EVENT LISTENERS */

window.addEventListener('load', () => {
    hideOff([loginSection]);
    loginSection.innerHTML = (` 
        <div class="login-wrapper" id="loginWrapper">
            <h1 class="heading login-heading">Welcome to Overlook</h1>
            <p class="login-description" id="loginDescription">Please sign in.</p>
            <form class="login-form">
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
        </div>
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
        confirmCancelCustomer(event.target.getAttribute('data-selectedBookingID'));
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
        displayAvailibleRooms({ date: document.getElementById('datePicker').value.split('-').join('/'), element: bookRoomSectionCustomer});
    } else if (event.target.id === 'roomFilterBtn') {
        event.preventDefault();
        displayFilteredRoomDetails({roomType: document.getElementById('filterRoomChoice').value, date: event.target.getAttribute('data-date')});
    } else if (event.target.id === 'dashBtn') {
        hideOff([dashboardSectionCustomer]);
        hideOn([loginSection, bookRoomSectionCustomer]);
        displayCustomerDash();
    } else if (event.target.id === 'backToSelectDate') {
        bookRoomCustomer();
    } else if (event.target.id.includes('selectRoomBtn')) {
        displayConfirmBooking({date: event.target.getAttribute('data-date'), roomNumber: event.target.getAttribute('data-roomNumber')})
    } else if (event.target.id === 'backToSelectRoom') {
        displayAvailibleRooms({date: event.target.getAttribute('data-date'), element: bookRoomSectionCustomer});
    } else if (event.target.id === 'confirmBookingBtn') {
        confirmBooking({date: event.target.getAttribute('data-date'), roomNumber: event.target.getAttribute('data-roomNumber')});
    }

});

dashboardSectionManager.addEventListener('click', (event) => {
    if (event.target.id === 'managerFindCustomerBtn') {
        displayCustomerSearch()
    } else if (event.target.id === 'managerDashBtn') {
        displayManagerDash();
    } else if (event.target.id === 'customerSearchBtn') {
        const customerName = document.getElementById('customerSearchInput').value
        if (!customerName || !/^[a-zA-Z\s]+$/g.test(customerName)) {
            hideOff([document.getElementById('invalidName')]);
            setError(document.getElementById('invalidName'))
            return false;
        }
        displayCustomer(manager.findACustomer(makeUpperCase(customerName)));
    } else if (event.target.getAttribute('data-confirmCancel')) {
        const bookingID = event.target.getAttribute('data-bookingID');
        cancelBooking(bookingID)
            .then(response => {
                if (!response.ok) {
                    throw 'Looks like something went wrong. The booking wasnt canceled'
                } else {
                    refreshManagerHoterAndCustomers('canceled');
                }
            })
            .catch(error => {
                document.getElementById(`a${bookin.id}`).innerHTML += `<p>Looks like something went wrong. Error: ${error}</p>`;
                setError(document.getElementById(`a${bookin.id}`));
            })
    } else if (event.target.getAttribute('data-bookingID')) {
        confirmCancelManager(event.target.getAttribute('data-bookingID'))
    } else if (event.target.id === 'makeBookingBtnManager') {
        makeBookingDashManager();
    }

});

bookRoomSectionManager.addEventListener('click', (event) => {
    if (event.target.id === 'managerDashBtn') {
        displayManagerDash();
    } else if (event.target.id === 'managerFindCustomerBtn') {
        displayCustomerSearch()
    } else if (event.target.id === 'roomPickerBtnManager') {
        event.preventDefault();
        displayAvailibleRoomsManager(document.getElementById('datePickerManager').value.split('-').join('/'));
    } else if (event.target.id === 'roomFilterBtn') {
        event.preventDefault();
        displayFilteredRoomDetails({date: event.target.getAttribute('data-date'), roomType: document.getElementById('filterRoomChoice').value});
    } else if (event.target.getAttribute('data-confirmBooking')) {
        event.preventDefault();
        const booking = hotel.makeBookingObj({id: customer.id, date: event.target.getAttribute('data-date'), roomNumber: parseInt(event.target.getAttribute('data-roomNumber'))});
        postBooking(booking)
            .then(data => {
                refreshManagerHoterAndCustomers('confirmed');
            })
            .catch(error => {
                document.getElementById(`room${booking.roomNumber}`).innerHTML += `<p>Looks like something went wrong. Error: ${error}</p>`;
                setError(document.getElementById(`room${booking.roomNumber}`));
            });
    } else if (event.target.id.includes('selectRoomBtn')) {
        event.preventDefault();
        confirmBookingManager(event.target.id);
    } 

});