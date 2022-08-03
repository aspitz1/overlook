import chai from 'chai';
const expect = chai.expect;
import { rooms } from './test-data/room-data';
import Room from '../src/classes/Room';

describe('Room', () => {
    it('Should be a function', () => {
        expect(Room).to.be.a('function');
    });

    it('Should be an instance of Room', () => {
        const room = new Room(rooms[0]);
        expect(room).to.be.an.instanceof(Room);
    });

    it('Should have a room number', () => {
        const room = new Room(rooms[0]);
        expect(room.number).to.equal(15);
    });

    it.skip('Should have a room type', () => {
        const room = new Room(rooms[2]);
        expect(room.roomType).to.equal('single room');
    });

    it.skip('Should know if it has bidet', () => {
        const room = new Room(room[1]);
        expect(room.bidet).to.equal(false);
    });

    it.skip('Should have number of beds', () => {
        const room = new Room(room[4]);
        expect(room.numBeds).to.equal(1);
    });

    it.skip('Should have cost per night', () => {
        const room = new Room(room[3]);
        expect(room.costPerNight).to.equal(207.24);
    });

});