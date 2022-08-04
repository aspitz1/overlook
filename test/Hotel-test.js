import chai from 'chai';
const expect = chai.expect;
import { rooms } from './test-data/room-data';
import { bookings } from './test-data/booking-data';
import { customers } from './test-data/customer-data';
import Hotel from '../src/classes/Hotel';

describe('Hotel', () => {
    let hotel;

    beforeEach(() => {
        hotel = new Hotel({allRooms: rooms, allBookings: bookings, allCustomers: customers});
    });

    it('Should be a function', () => {
        expect(Hotel).to.be.a('function');
    });

    it('Should be an instance of Hotel', () => {
        expect(hotel).to.be.a.instanceOf(Hotel);
    });

    it('Should have all the bookings', () => {
        expect(hotel.allBookings).to.deep.equal(bookings);
    });

    it('Should have all the rooms', () => {
        expect(hotel.allRooms).to.deep.equal(rooms);
    });

    it('Should have all the customers', () => {
        expect(hotel.allCustomers).to.deep.equal(customers);
    });

    it.skip('Should make bookings', () => {
        hotel.makeBooking({room: rooms[1], customer: customers[1]});
        const availibleRooms = hotel.getAvailibleRooms();
        const bookedRooms = hotel.getBookedRooms();
        expect(availibleRooms).to.deep.equal([rooms[0], rooms[2], rooms[3], rooms[5]]);
        expect(bookedRooms).to.deep.equal([rooms[4], rooms[6], rooms[1]]);
    });

    it.skip('Should cancel bookings', () => {
        hotel.cancelBooking({room: rooms[4], customer: customers[2]})
        const availibleRooms = hotel.getAvailibleRooms();
        const bookedRooms = hotel.getBookedRooms();
        expect(availibleRooms).to.deep.equal([rooms[0], rooms[2], rooms[3], rooms[4], rooms[5]]);
        expect(bookedRooms).to.deep.equal([rooms[6], rooms[1]]);
        
    });

});