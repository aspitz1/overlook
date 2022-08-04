import { bookings } from '../../test/test-data/booking-data';

class Customer {
    constructor(customerData) {
        this.id = customerData.id;
        this.name = customerData.name;
        this.loginName = `customer${this.id}`;
        this.password = 'overlook2021';
        this.futureBookings = this.findFutureBookings(bookings);
        this.pastBookings = this.findPastBookings(bookings);
    }

    findFutureBookings(allBookings) {
        const todaysDate = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;
        return allBookings.filter(booking => booking.date >= todaysDate && booking.userID === this.id);
    }

    findPastBookings(allBookings) {
        const todaysDate = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;
        return allBookings.filter(booking => booking.date < todaysDate && booking.userID === this.id);
    }

    returnTotalSpent(allRooms) {
        const roomNumbers = this.pastBookings.map(booking => booking.roomNumber);
        const total = allRooms.filter(room => roomNumbers.includes(room.number))
            .reduce((total, room) => {
                total += room.costPerNight;
                return total;
            }, 0)
        
        return Number(total.toFixed(2));
    }
    
}

export default Customer;