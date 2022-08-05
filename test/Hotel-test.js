import chai from 'chai';
const expect = chai.expect;
import { rooms } from './test-data/room-data';
import { bookings } from './test-data/booking-data';
import Hotel from '../src/classes/Hotel';
import { customers } from './test-data/customer-data';

describe('Hotel', () => {
    let hotel;

    beforeEach(() => {
        hotel = new Hotel({allRooms: rooms, allBookings: bookings});
    });

    it('Should be a function', () => {
        expect(Hotel).to.be.a('function');
    });

    it('Should be an instance of Hotel', () => {
        expect(hotel).to.be.a.instanceOf(Hotel);
    }); 

    it('Should have all the rooms', () => {
        expect(hotel.allRooms).to.deep.equal(rooms);
    });

    it('Should have all the bookings', () => {
        expect(hotel.allBookings).to.deep.equal(bookings);
    });

    it('Should return all availible rooms', () => {
        const availibleRooms = hotel.getAvailibleAndUnavailibleRooms('2023/10/23').availibleRooms;
        expect(availibleRooms).to.deep.equal([rooms[0], rooms[1], rooms[2], rooms[3], rooms[4], rooms[5]]);
    });

    it('Should return all booked rooms', () => {
        const bookedRooms = hotel.getAvailibleAndUnavailibleRooms('2023/02/23').unavailibleRooms;
        expect(bookedRooms).to.deep.equal([rooms[4]]);
    });

    it('Should make a Booking', () => {
        const newBooking = hotel.makeBookingObj({room: rooms[1], customer: customers[1], date: '2023/02/23'});
        expect(newBooking).to.deep.equal({
            userID: 12,
            date: '2023/02/23',
            roomNumber: 23
        });
    });

    it('Should filter availible rooms by their room type', () => {
        const filteredRooms = hotel.filterRoomsByType({rooms: [rooms[0], rooms[1], rooms[2], rooms[3], rooms[4], rooms[5]], roomType: 'single room'});
        expect(filteredRooms).to.deep.equal([rooms[2], rooms[3], rooms[4]]);
    });

});