class Room {
    constructor(roomData) {
        this.number = roomData.number;
        this.roomType = roomData.roomType;
        this.bidet = roomData.bidet;
        this.numBeds = roomData.numBeds;
        this.costPerNight = roomData.costPerNight;
    }
}

export default Room;