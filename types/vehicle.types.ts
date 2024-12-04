export interface VehicleType {
    deviceId: string;
    vehicleRegNumber: string;
    // vehicleRegNumber: string;
    // kilometersCovered: string;
    totalDistanceCovered: string;
    coordinates: {
        lat: string;
        lng: string;
    },
    dailyDistances: {
        distance: string;
        date: string;
    }[];
}