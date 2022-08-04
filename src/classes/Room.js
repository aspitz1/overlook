class Room {
    constructor(roomData) {
        this.bedSize = roomData.bedSize;
        this.bidet = roomData.bidet;
        this.costPerNight = roomData.costPerNight;
        this.numBeds = roomData.numBeds;
        this.number = roomData.number;
        this.roomType = roomData.roomType;
    }
}

export default Room;