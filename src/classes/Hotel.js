import Room from './Room';
import Booking from './Booking';

class Hotel {
    constructor(allHotelData) {
        this.allRooms = this.makeRooms(allHotelData.allRooms);
        this.allBookings = this.makeBookings(allHotelData.allBookings);
    }

    makeRooms(rooms) {
        return rooms.map(room => new Room(room));
    }

    makeBookings(bookings) {
        return bookings.map(booking => new Booking(booking));
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