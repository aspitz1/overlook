class Customer {
    constructor(customerData) {
        this.id = customerData.customer.id;
        this.name = customerData.customer.name;
        this.loginName = `customer${this.id}`;
        this.password = 'overlook2021';
        this.futureBookings = this.findFutureBookings(customerData.allBookings);
        this.pastBookings = this.findPastBookings(customerData.allBookings);
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