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

    getAvailableAndUnavailableRooms(date) {
        const unavailableRoomNums = this.allBookings.filter(booking => booking.date === date)
            .map(booking => booking.roomNumber);
       
        return {availableRooms: this.allRooms.filter(room => !unavailableRoomNums.includes(room.number)),
            unavailableRooms: this.allRooms.filter(room => unavailableRoomNums.includes(room.number))};
    }

    makeBookingObj(bookingData) {
        return {
            "userID": bookingData.id,
            "date": bookingData.date,
            "roomNumber": parseInt(bookingData.roomNumber)
        }
    }

    filterRoomsByType(roomsAndRoomType) {
        return roomsAndRoomType.rooms.filter(room => room.roomType === roomsAndRoomType.roomType);
    }

    findRoom(roomNum) {
        return this.allRooms.find(room => room.number === roomNum);
    }

    findBooking(bookingID) {
        return this.allBookings.find(booking => booking.id === bookingID);
    }
    
}

export default Hotel;