import Customer from './Customer';

class Manager {
    constructor(customersAndBookings) {
        this.allCustomers = this.getAllCustomers(customersAndBookings)
    }

    getAllCustomers(allCustomersAndAllBookings) {
        return allCustomersAndAllBookings.customers
            .map(customer => new Customer({customer: customer, allBookings: allCustomersAndAllBookings.allBookings}))
    }

    findACustomer(customerName) {
        const customer = this.allCustomers.find(customer => customer.name === customerName);
        return customer ? customer : 'There was no customer found with this name.';
    }

    getPercentAvailableRooms(allRoomsAllBookingsAndDate) {
        const unavailableRoomNumbers = allRoomsAllBookingsAndDate.allBookings.filter(booking => booking.date === allRoomsAllBookingsAndDate.date)
            .map(booking => booking.roomNumber);
        return `${Math.floor((unavailableRoomNumbers.length / allRoomsAllBookingsAndDate.allRooms.length) * 100)}%`
    }

}

export default Manager;