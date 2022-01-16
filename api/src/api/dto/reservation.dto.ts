export type GetReservationDTO = {
    restaurantId: number,
    reservationTime?: Date,
}

export type CreateReservationDTO = {
    restaurantId: number,
    customerId: number,
    reservationTime: Date,
    partySize: number
}