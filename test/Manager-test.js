import chai from 'chai';
const expect = chai.expect;
import { rooms } from './test-data/room-data';
import { customers } from './test-data/customer-data';
import { bookings } from './test-data/booking-data';
import Manager from '../src/classes/Manager';



/*  it.skip('Should return all availible rooms', () => {
        const availibleRooms = hotel.getAvailibleRooms();
        expect(availibleRooms).to.deep.equal([rooms[0], rooms[1], rooms[2], rooms[3], rooms[5]]);
    });

    it.skip('Should return all booked rooms', () => {
        const bookedRooms = hotel.getBookedRooms();
        expect(bookedRooms).to.deep.equal([rooms[4], rooms[6]]);
    });

    it.skip('Should give percentage of availible rooms rounded down to nearest whole', () => {
        const percentAvailibleRooms = hotel.getPercentAvailibleRooms();
        expect(percentAvailibleRooms).to.equal('71%');
    }); */