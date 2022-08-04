class Hotel {
    constructor(allHotelData) {
        this.allRooms = allHotelData.allRooms;
        this.allBookings = allHotelData.allBookings;
    }

    getAvailibleAndUnavailibleRooms(date) {
        const unavailibleRoomNums = this.allBookings.filter(booking => booking.date === date)
            .map(booking => booking.roomNumber);
       
        return {availibleRooms: this.allRooms.filter(room => !unavailibleRoomNums.includes(room.number)),
            unavailibleRooms: this.allRooms.filter(room => unavailibleRoomNums.includes(room.number))};
    }

    makeNewRoomID() {
        return this.allBookings[this.allBookings.length - 1]
    }

    makeBookingObj(bookingData) {
        return {
            userID: bookingData.customer.id,
            date: bookingData.date,
            roomNumber: bookingData.room.number
        }
    }
    
}

export default Hotel;