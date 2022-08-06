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

    it('Should be an instence of Customer', () => {
        const customer = new Customer({customer: customers[1], allBookings: bookings});
        expect(customer).to.be.an.instanceOf(Customer);
    });

    it('Should have an ID', () => {
        const customer = new Customer({customer: customers[1], allBookings: bookings});
        expect(customer.id).to.equal(12);
    });

    it('Should have a name', () => {
        const customer = new Customer({customer: customers[0], allBookings: bookings});
        expect(customer.name).to.equal('Faustino Quitzon');
    });

    it('Should have future bookings', () => {
        const customer = new Customer({customer: customers[0], allBookings: bookings});
        expect(customer.futureBookings).to.deep.equal([bookings[7]]);
    });

    it('Should have past bookings', () => {
        const customer = new Customer({customer: customers[1], allBookings: bookings});
        expect(customer.pastBookings).to.deep.equal([bookings[2], bookings[4]]);
    });

    it('Should keep track of total spent on rooms', () => {
        const customer = new Customer({customer: customers[0], allBookings: bookings});
        const totalSpent = customer.returnTotalSpent(rooms);
        expect(totalSpent).to.equal(776.77);
    });

});