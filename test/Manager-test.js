import chai from 'chai';
const expect = chai.expect;
import { rooms } from './test-data/room-data';
import { customers } from './test-data/customer-data';
import { bookings } from './test-data/booking-data';
import Manager from '../src/classes/Manager'; 
import Customer from '../src/classes/Customer';

describe('Manager', () => {
    let manager;
    
    beforeEach(() => {
        manager = new Manager();
    });

    it('Should be a function', () => {
        expect(Manager).to.be.a('function');
    });
    
    it('Should be an instance of Manager', () => {
        expect(manager).to.be.a.instanceOf(Manager);
    });

    it('Should have a login name', () => {
        expect(manager.loginName).to.equal('manager');
    });

    it('Should have a password', () => {
        expect(manager.password).to.equal('overlook2021');
    });

    it.skip('Should return all availible rooms', () => {
        const availibleRooms = hotel.getAvailibleRooms({allRooms: rooms, allBookings: bookings});
        expect(availibleRooms).to.deep.equal([rooms[0], rooms[1], rooms[2], rooms[3], rooms[5]]);
    });

    it.skip('Should return all booked rooms', () => {
        const bookedRooms = hotel.getBookedRooms({allRooms: rooms, allBookings: bookings});
        expect(bookedRooms).to.deep.equal([rooms[4], rooms[6]]);
    });

    it.skip('Should give percentage of availible rooms rounded down to nearest whole', () => {
        const percentAvailibleRooms = hotel.getPercentAvailibleRooms({allRooms: rooms, allBookings: bookings});
        expect(percentAvailibleRooms).to.equal('71%');
    });
    
    
    it.skip('Should be able to make a customer', () => {
        const customer = manager.makeCustomer({customer: customers[0], allBookings: bookings});  
        expect(customer).to.be.a.instanceOf(Customer);
    });

});

