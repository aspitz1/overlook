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

const cancelMessege = 'Your booking has been canceled. We are sorry you can\'t make it.';
const bookedMessege = 'Your room has been booked! We are looking forward to your stay.';

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
            <h1 class="heading">${statusMessege}</h1>
            `)      
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
                    <p class="informational-p" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">${makeDateDisplay(booking.date)}</p>
                    <p class="informational-p" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Room Number: ${booking.roomNumber}</p>
                    <p class="informational-p" data-bookingID="${booking.id}" data-roomNum="${booking.roomNumber}" data-date="${booking.date}">Cost Per Night: $${room.costPerNight}</p>
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
            <h1 class="heading">Let's get to work!</h1>
            <section class="search-customer-wrapper">
                <label class="search-label" for="customer-search">Search for customer by name: </label>
                <input class="search-input" id="customerSearchInput" type="test" name="customer-search">
                <input class="search-btn" id="customerSearchBtn" type="button" value="Find Customer">
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
            dashboardSectionManager.innerHTML += (`
                <h1 class="heading">Here is ${customerData.name}'s information.</h1>
                <p class="information">ID: ${customer.id}</p>
                <p class="information">Total Spent: ${customer.returnTotalSpent(hotel.allRooms)}</p>
                <button class="search-btn" id="makeBookingBtnManager">Make Booking</button>
                <section class="list-bookings-manager" id="futureBookingsManager">
                    <h2 class="heading">Future Bookings</h2>
                </section>
                <section class="list-bookings-manager" id="pastBookingsManager">
                    <h2 class="heading">Past Bookings</h2>
                </section>
            `);

            customerData.futureBookings.forEach(booking => {
                document.getElementById('futureBookingsManager').innerHTML += (`
                    <article class="customer-bookings-article">
                        <p class="information">ID: ${booking.id}</p>
                        <p class="information">Date: ${makeDateDisplay(booking.date)}</p>
                        <p class="information">Room Number: ${booking.roomNumber}</p>
                    </article>
                    <button class="cancel-btn" id="${booking.id}" data-bookingID="${booking.id}">Cancel Booking</button>
                `);
            });
            
            customerData.futureBookings.forEach(booking => {
                document.getElementById('pastBookingsManager').innerHTML += (`
                    <article class="customer-bookings-article">
                        <p class="information">ID: ${booking.id}</p>
                        <p class="information">Date: ${makeDateDisplay(booking.date)}</p>
                        <p class="information">Room Number: ${booking.roomNumber}</p>
                    </article>
                `);
            }); 
        } else {
            dashboardSectionManager.innerHTML += (`
                <h1 class="heading">${customerData}<h1>
            `);
        }
    }

    const confirmCancelManager = (bookingID) => {
        document.getElementById(bookingID).setAttribute('data-confirm', 'true');
        document.getElementById(bookingID).innerText = 'Confirm Cancelation';
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
                <h1 class="heading">Let's make your customers booking.</h1>
                <form class="form" id="roomPickerManager">
                    <label class="search-label" for="stay-date">Pick your stay date: </label>
                    <input class="search-intput-calander" type="date" id="datePicker" name="stay-date" value="${getTodaysDate().split('/').join('-')}" min="${getTodaysDate().split('/').join('-')}" max="2024-01-01">
                    <input class="search-button" id="roomPickerBtnManager" type="submit" value="Find Rooms">
                </form>
                <section class="manager-display-availible-rooms" id="managerDisplayAvailibleRooms"></section>
            </section>
        `)
    } 

    const displayAvailibleRoomsManager = (date) => {
        const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(date).availibleRooms
        if (!availibleRooms.length) {
            document.getElementById('managerDisplayAvailibleRooms').innerHTML = ('<h1 class="heading">We\'re so sorry. Looks like we are all booked up for this night.</h1>');
        } else {
            document.getElementById('managerDisplayAvailibleRooms').innerHTML = (`

            `);
        }
    }

    const displayManagerDash = () => {
        hideOff([dashboardSectionManager]);
        hideOn([loginSection, bookRoomSectionManager]);
        dashboardSectionManager.innerHTML = (`
            <nav class="nav">
                <button class="nav-btn" id="managerFindCustomerBtn"><i class="fa-solid fa-bell-concierge"></i> Find a Customer</button>
            </nav>
            <h1 class="heading" id="managerDashHeading">Welcome, thanks for being here!</h1>
            <section class="daily-stats-section" id="dailyStatsSection">
                <h2 class="heading-two">Here are today's stats.</h2>
                <p class="information">There are ${hotel.getAvailibleAndUnavailibleRooms(getTodaysDate()).availibleRooms.length} availible rooms.</p>
                <p class="information">There are ${hotel.getAvailibleAndUnavailibleRooms(getTodaysDate()).unavailibleRooms.length} unavailible rooms.</p>
                <p class="information">There is ${manager.getPercentAvailibleRooms({allRooms: hotel.allRooms, allBookings: hotel.allBookings, date: getTodaysDate()})} of rooms booked for tonight.</p>
            </section>
        `);
    }
        
    const displayCustomerDash = () => {
        dashboardSectionCustomer.innerHTML = (`
            <nav class="nav">
                <button class="nav-btn" id="bookRoomBtn"><i class="fa-solid fa-bell-concierge"></i> Book a Room</button>
            </nav>
            <h1 class="heading">Welcome back ${customer.name}!</h1>
            <section class="upcoming-bookings-section" id="upcomingBookingSection">
                <h2 class="heading-two">Upcoming Bookings</h2>
            </section>
            <section class="past-bookings-section" id="pastBookingSection">
                <h2 class="heading-two">Past Bookings</h2>
            </section>
            <section class="total-spent-section" id="totalSpentSection">
                <h2 class="heading-two">Total Amount Spent on Past Bookings</h2>
                <p class="information">$${customer.returnTotalSpent(hotel.allRooms)}</p>
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
        <h1 class="heading">A Beautiful ${makeUpperCase(bookingIDAndRoom.selectedRoom.roomType)}</h1>
        <p class="information">Cost Per Night: $${bookingIDAndRoom.selectedRoom.costPerNight}</p>
        <ul class="list">
            <li>${makeUpperCase(bookingIDAndRoom.selectedRoom.bedSize)} bed</li>
            <li>Has ${bookingIDAndRoom.selectedRoom.numBeds} bed(s)</li>
            <li>${hasBidet}</li>
            <li>The room number is ${bookingIDAndRoom.selectedRoom.number}</li>
        </ul>
        `);
        if (selectedBooking.date >= getTodaysDate()) {
            dashboardSectionCustomer.innerHTML += (`
            <p class="information">Your booking is for ${makeDateDisplay(selectedBooking.date)}</p>
            <button class="cancel-btn" id="cancelBtn" data-selectedBookingID="${selectedBooking.id}"><i class="fa-solid fa-rectangle-xmark"></i> Cancel Booking</button>
            `)
        }
    }
    
    const confirmCancelCustomer = (bookingID) => {
        document.getElementById('cancelBtn').remove();
        dashboardSectionCustomer.innerHTML += (`
        <form class="form">
            <lable class="search-label" for="confirm-cancel">Are you sure you want too cancel?</label>
            <input class="search-btn" id="confirmCancelBtn" type="submit" name="confirm-cancel" value="Confirm" data-selectedBookingID="${bookingID}">
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
    <h1 class="heading">Let's find your perfect room.</h1>
    <p class="information">Pick the date of your stay.</p>
    <form id="roomPicker">
        <label class="search-label" for="stay-date">Pick your stay date: </label>
        <input class="search-intput-calander" type="date" id="datePicker" name="stay-date" value="${getTodaysDate().split('/').join('-')}" min="${getTodaysDate().split('/').join('-')}" max="2024-01-01">
        <input class="search-btn" id="roomPickerBtn" type="submit" value="Find Rooms">
    </form>
    `)
}

const displayAvailibleRooms = (date) => {
    bookRoomSectionCustomer.innerHTML = (`
    <nav class="nav">
        <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
        <button class="nav-btn" id="backToSelectDate">Back</button>
    </nav>
    `);
    const availibleRooms = hotel.getAvailibleAndUnavailibleRooms(date).availibleRooms;
    if (!availibleRooms.length) {
        bookRoomSectionCustomer.innerHTML += (`
        <h1 class="heading">There are no availible rooms for ${makeDateDisplay(date)}.</h1>
        <p class="information">We're so sorry! We are looking forward to having you, can you come another night?</p>
        <button class="search-btn" id="returnToPickerBtn">Pick another Date</button>
        `)
    } else {
        bookRoomSectionCustomer.innerHTML += (`
            <h1 class="heading" id="roomPickerHeading">Here are all availible rooms for ${makeDateDisplay(date)}.</h1>
            <form class="form" id="filterRooms">
                <label class="search-label" for="room-type">Filter rooms by type: </lable>
                <select class="room-type-select" id="filterRoomChoice" name="room-type">
                    <option class="room-type-option" value="">All Availible</option>
                    <option class="room-type-option" value="residential suite">Residential Suite</option>
                    <option class="room-type-option" value="suite">Suite</option>
                    <option class="room-type-option" value="single room">Single Room</option>
                    <option class="room-type-option" value="junior suite">Junior Suite</option>
                </select> 
                <input class="search-btn" id="roomFilterBtn" type="button" value="Filter" data-date="${date}">
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
            <p class="informatuon">${makeUpperCase(room.roomType)}</p>
            <ul class="list">
                <li>Room number ${room.number}</li>
                <li>${makeUpperCase(room.bedSize)} bed</li>
                <li>${room.numBeds} bed(s)</li>
                <li>${hasBidet}</li>
                <li>$${room.costPerNight} per night</li> 
            </ul>
            <button class="search-btn" id="selectRoomBtn" data-date="${roomsDateAndElementID.date}" data-roomNumber="${room.number}">Book</button>
        </article>
        `);
    })
}

const displayConfirmBooking = (dateAndRoomNum) => {
    const selectedRoom = hotel.findRoom(parseInt(dateAndRoomNum.roomNumber));
    bookRoomSectionCustomer.innerHTML = (`
    <nav class="nav">
        <button class="nav-btn" id="dashBtn"><i class="fa-solid fa-bed"></i> Dashboard</book>
        <button class="nav-btn" id="backToSelectRoom" data-date="${dateAndRoomNum.date}">Back</button>
    </nav>
    <h1 class="heading">Let's confirm your booking details.</h1>
    <p class="information">You have not booked this room yet, confirm below to book this room.</p>
    <ul class="list">
        <li>Booking Date: ${makeDateDisplay(dateAndRoomNum.date)}</li>
        <li>Room Type: ${selectedRoom.roomType}</li>
        <li>Room Number: ${selectedRoom.number}</li>
        <li>Bed Size: ${selectedRoom.bedSize}</li>
        <li>Number of Beds: ${selectedRoom.numBeds}</li>
        <li>Cost Per Night: $${selectedRoom.costPerNight}</li>
    </ul>
    <p class="hidden" id="bookingError"></p>
    <button class="search-btn" id="confirmBookingBtn" data-date="${dateAndRoomNum.date}" data-roomNumber="${dateAndRoomNum.roomNumber}">Confirm Booking</button>    
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
        <h1 class="heading">Welcome to Overlook</h1>
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
        displayAvailibleRooms(document.getElementById('datePicker').value.split('-').join('/'));
    } else if (event.target.id === 'roomFilterBtn') {
        event.preventDefault();
        displayFilteredRoomDetails({roomType: document.getElementById('filterRoomChoice').value, date: event.target.getAttribute('data-date')});
    } else if (event.target.id === 'dashBtn') {
        hideOff([dashboardSectionCustomer]);
        hideOn([loginSection, bookRoomSectionCustomer]);
        displayCustomerDash();
    } else if (event.target.id === 'backToSelectDate') {
        bookRoomCustomer();
    } else if (event.target.id === 'selectRoomBtn') {
        displayConfirmBooking({date: event.target.getAttribute('data-date'), roomNumber: event.target.getAttribute('data-roomNumber')})
    } else if (event.target.id === 'backToSelectRoom') {
        console.log(event.target.getAttribute('data-date'));
        displayAvailibleRooms(event.target.getAttribute('data-date'));
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
        const customerName = makeUpperCase(document.getElementById('customerSearchInput').value)
        displayCustomer(manager.findACustomer(customerName));
    } else if (event.target.getAttribute('data-confirm')) {
        const bookingID = event.target.getAttribute('data-bookingID');
        cancelBooking(bookingID);
        refreshManagerHoterAndCustomers('canceled');
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
    }
});