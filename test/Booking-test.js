import chai from 'chai';
const expect = chai.expect;
import { bookings } from './test-data/booking-data';
import Booking from '../src/classes/Booking'

describe('Booking', () => {
    it('Should be a function', () => {
        expect(Booking).to.be.a('function');
    });

    it('Should be an instance of Booking', () => {
        const booking = new Booking(bookings[0]);
        expect(booking).to.be.a.instanceOf(Booking);
    });

    it('Should have an ID', () => {
        const booking = new Booking(bookings[2]);
        expect(booking.id).to.equal('5fwrgu4i7k55hl6wo');
    });

    it('Should have a user ID', () => {
        const booking = new Booking(bookings[1]);
        expect(booking.userID).to.equal(9);
    });

    it('Should have the date made', () => {
        const booking = new Booking(bookings[4]);
        expect(booking.date).to.equal('2022/01/15');
    })

    it('Should have the room number', () => {
        const booking = new Booking(bookings[6]);
        expect(booking.roomNumber).to.equal(3);
    });

});