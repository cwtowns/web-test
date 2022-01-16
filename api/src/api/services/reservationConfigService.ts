//import * as restaurantDal from '../../db/dal/restaurant'
//import { RestaurantCreationAttributes, RestaurantOutput } from '../../db/models'
import dayjs from "dayjs";

import { CreateReservationConfigDTO, GetReservationConfigDTO } from '../dto/reservationConfig.dto'
import { ReservationConfig, ReservationConfigCreationAttributes, ReservationConfigOutput } from '../../db/models'
import * as reservationConfigDal from '../../db/dal/reservationConfig'
import { ValidationErrorItemType } from "sequelize/dist";

const verifyCreateInput = (payload: CreateReservationConfigDTO) => {
    let error: string = "";

    if (payload.startTime.getUTCMinutes() % 15 !== 0) {
        error = error + "startTime minutes must be 00, 15, 30 or 45.  ";
    }

    if (payload.endTime.getUTCMinutes() % 15 !== 0) {
        error = error + "endTime minutes must be 00, 15, 30 or 45.  ";
    }

    if (payload.reservationPartySize <= 0)
        error = error + "reservationPartySize must be >= 0.  ";

    if (payload.numberOfTables < 0)
        error = error + "numberOfTables must be > 0.";

    if (payload.startTime > payload.endTime) {
        error = error + "startTime must be before endTime.  ";
    }

    if (error.length > 0)
        throw new Error(error);
}

export const create = (payload: CreateReservationConfigDTO): Promise<ReservationConfigOutput[]> => {

    //we need to create all config DTOs for the data we want to create.  We can assume it's on the 15 minute mark
    verifyCreateInput(payload);


    let createPayload: ReservationConfigCreationAttributes[] = [];
    let currentStartTime: dayjs.Dayjs = dayjs(payload.startTime)

    const getCreatePayload = (startTime: dayjs.Dayjs): ReservationConfigCreationAttributes => {
        return {
            restaurantId: payload.restaurantId,
            reservationSize: payload.reservationPartySize,
            startTime: startTime.toDate(),
            maxTables: payload.numberOfTables
        };
    }

    createPayload.push(getCreatePayload(currentStartTime));
    currentStartTime = currentStartTime.add(15, "minutes");

    while (currentStartTime.toDate() <= payload.endTime) {
        createPayload.push(getCreatePayload(currentStartTime));
        currentStartTime = currentStartTime.add(15, "minutes");
    }

    return reservationConfigDal.create(createPayload);
}

export const get = (payload: GetReservationConfigDTO): Promise<ReservationConfigOutput[]> => {
    let error: string = "";
    if (!dayjs(payload.startTime).isValid())
        error = error + "invalid startTime.  ";

    if (!dayjs(payload.endTime).isValid())
        error = error + "invalid endTime.  ";

    if (error.length > 0)
        throw new Error(error);

    return reservationConfigDal.get(payload);
}

