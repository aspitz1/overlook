class Customer {
    constructor(customerDataAndAllBookings) {
        this.id = customerDataAndAllBookings.customer.id;
        this.name = customerDataAndAllBookings.customer.name;
        this.futureBookings = this.findFutureAndPastBookings(customerDataAndAllBookings.allBookings).futureBookings;
        this.pastBookings = this.findFutureAndPastBookings(customerDataAndAllBookings.allBookings).pastBookings;
    }

    findFutureAndPastBookings(allBookings) {
        const todaysDate = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`;
        return {
            futureBookings: allBookings.filter(booking => booking.date >= todaysDate && booking.userID === this.id),
            pastBookings: allBookings.filter(booking => booking.date < todaysDate && booking.userID === this.id)
        };
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