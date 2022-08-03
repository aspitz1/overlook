import chai from 'chai';
const expect = chai.expect;
import { customers } from './test-data/customer-data';
import { rooms } from './test-data/room-data'; 
import { bookings } from './test-data/booking-data';
import Customer from '../src/classes/Customer';

describe('Customer', () => {
    it('Shoul be a function', () => {
        expect(Customer).to.be.a('function');
    });

    it.skip('Should be an instence of Customer', () => {
        const customer = new Customer(customers[1]);
        expect(customer).to.be.an.instenceof(Customer);
    });

    it.skip('Should have an ID', () => {
        const customer = new Customer(customers[1]);
        expect(customer.id).to.equal(12);
    });

    it.skip('Should have a name', () => {
        const customer = new Customer(customers[0]);
        expect(customer.name).to.equal('Faustino Quitzon');
    });

    it.skip('Should have a log in name', () => {
        const customer = new Customer(customers[1]);
        expect(customer.logInName).to.equal('customer12');
    });

    it.skip('Should have a password', () => {
        const customer = new Customer(customers[1]);
        expect(customer.password).to.equal('overlook2021');
    });

    it.skip('Should have future bookings', () => {
        const customer = new Customer(customers[0]);
        expect(customer.futureBookings).to.deep.equal([bookings[7]]);
    });

    it.skip('Should have past bookings', () => {
        const customer = new Customer(customers[1]);
        expect(customer.pastBookings).to.deep.equal([bookings[2], bookings[4]]);
    });

    it.skip('Should move bookings to past bookings', () => {
        const customer = new Customer(customers[0]);
        expect(customer.pastBookings).to.deep.equal([bookings[0], bookings[1], bookings[3], bookings[7]]);
    });

    it.skip('Should make new bookings', () => {
        const customer = new Customer(customers[2]);
        expect(customer.futureBookings).to.deep.equal([bookings[6]]);
        customer.bookRoom(rooms[5]);
        expect(customer.futureBookings).to.deep.equal([bookings[6], rooms[5]]);
    });

    it.skip('Should cancel bookings', () => {
        const customer = new Customer(customers[0]);
        expect(customer.futureBookings).to.deep.equal([bookings[7]]);
        customer.cancelBooking(bookings[7]);
        expect(customer.futureBookings).to.equal([]);
    });

    it.skip('Should keep track of total spent on rooms', () => {
        const customer = new Customer(customers[0]);
        const totalSpent = customer.totalSpent(rooms);
        expect(totalSpent).to.equal(776.77);
    });

});