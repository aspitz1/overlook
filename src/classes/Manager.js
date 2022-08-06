import Customer from './Customer';

class Manager {
    constructor(customersAndBookings) {
        this.allCustomers = this.getAllCustomers(customersAndBookings)
    }

    getAllCustomers(allCustomersAndAllBookings) {
        return allCustomersAndAllBookings.customers
            .map(customer => new Customer({customer: customer, allBookings: allCustomersAndAllBookings.allBookings}))
    }

    getPercentAvailibleRooms(allRoomsAllBookingsAndDate) {
        const unavailibleRoomNumbers = allRoomsAllBookingsAndDate.allBookings.filter(booking => booking.date === allRoomsAllBookingsAndDate.date)
            .map(booking => booking.roomNumber);
        return `${Math.floor((unavailibleRoomNumbers.length / allRoomsAllBookingsAndDate.allRooms.length) * 100)}%`
    }

}

export default Manager;