export type CreateReservationConfigDTO = {
    restaurantId: number,
    startTime: Date,
    endTime: Date,
    reservationPartySize: number,
    numberOfTables: number,
}

export type GetReservationConfigDTO = {
    restaurantId: number,
    startTime: Date,
    endTime: Date
}