class Customer {
    constructor(customerDataAndAllBookings) {
        this.id = customerDataAndAllBookings.customer.id;
        this.name = customerDataAndAllBookings.customer.name;
        this.futureBookings = this.findFutureAndPastBookings(customerDataAndAllBookings.allBookings).futureBookings;
        this.pastBookings = this.findFutureAndPastBookings(customerDataAndAllBookings.allBookings).pastBookings;
    }

    findFutureAndPastBookings(allBookings) {
        const getTodaysDate = () => {
            let year = new Date().getFullYear().toString();
            let month = (new Date().getMonth() + 1).toString();
            let date = new Date().getDate().toString();
            month = month.length === 1 ? 0 + month : month;
            date = date.length === 1 ? 0 + date : date;

            return `${year}/${month}/${date}`;
        }
        
        return {
            futureBookings: allBookings.filter(booking => booking.date >= getTodaysDate() && booking.userID === this.id)
                .reverse(),
            pastBookings: allBookings.filter(booking => booking.date < getTodaysDate() && booking.userID === this.id)
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