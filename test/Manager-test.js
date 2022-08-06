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
        manager = new Manager({customers: customers, allBookings: bookings});
    });

    it('Should be a function', () => {
        expect(Manager).to.be.a('function');
    });
    
    it('Should be an instance of Manager', () => {
        expect(manager).to.be.a.instanceOf(Manager);
    });

    it('Should have all customers', () => {
        const allCustomers = customers.map(customer => new Customer({customer: customer, allBookings: bookings}))
        expect(manager.allCustomers).to.deep.equal(allCustomers);
    });

    it('Should give percentage of availible rooms rounded down to nearest whole', () => {
        const percentAvailibleRooms = manager.getPercentAvailibleRooms({allRooms: rooms, allBookings: bookings, date: "2023/02/23"});
        expect(percentAvailibleRooms).to.equal('14%');
    });

});

