import dayjs from "dayjs";

import { CreateReservationDTO, GetReservationDTO } from '../dto/reservation.dto'
import { Reservation, ReservationCreationAttributes, ReservationOutput, ReservationRetrieveByTimeAttributes, Restaurant } from '../../db/models'
import * as reservation from '../../db/dal/reservation'

export const create = async (payload: CreateReservationDTO): Promise<ReservationOutput> => {
    let error: string = "";

    if (Number.isNaN(payload.restaurantId) || payload.restaurantId <= 0)
        error = error + "restaurantId is invalid.  ";

    if (Number.isNaN(payload.customerId) || payload.customerId <= 0)
        error = error + "customerId is invalid.  ";

    if (Number.isNaN(payload.partySize) || payload.partySize <= 0)
        error = error + "partySize is invalid.  ";

    if (dayjs(payload.reservationTime).isValid() == false)
        error = error + "reservationTime is invalid.  ";

    if (payload.reservationTime.getUTCMinutes() % 15 !== 0)
        error = error + "reservationTime minutes must be 00, 15, 30 or 45.  ";

    if (error.length > 0) {
        console.log("throwing in create");
        throw new Error(error);
    }

    return reservation.create(payload);
}

export const get = (payload: GetReservationDTO): Promise<ReservationOutput[]> => {
    let error: string = "";

    if (Number.isNaN(payload.restaurantId) || payload.restaurantId <= 0)
        error = error + "restaurantId is invalid.  ";

    if (payload.reservationTime && dayjs(payload.reservationTime).isValid() === false)
        error = error + "reservationTime is invalid.  ";

    if (payload.reservationTime && payload.reservationTime.getUTCMinutes() % 15 !== 0)
        error = error + "reservationTime minutes must be 00, 15, 30 or 45.  ";

    if (error.length > 0) {
        console.log("throwing");
        throw new Error(error);
    }

    if (payload.reservationTime) {
        const transformedPayload: ReservationRetrieveByTimeAttributes = {
            restaurantId: payload.restaurantId,
            reservationTime: payload.reservationTime
        }        
        
        return reservation.getByTimeSlot(transformedPayload);
    }

    return reservation.getByRestaurant(payload);
}