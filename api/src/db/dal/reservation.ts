import { Op } from 'sequelize'
import { Reservation, ReservationRetrieveByRestaurantAttributes, ReservationRetrieveByTimeAttributes } from '../models'
import { ReservationOutput, ReservationCreationAttributes } from '../models'
import { ReservationConfig, ReservationConfigRetrieveAttributes, ReservationConfigOutput } from '../models'
import { Transaction } from "sequelize";
import Logger from '../../logger'


export const create = async (payload: ReservationCreationAttributes): Promise<ReservationOutput> => {
    return ReservationConfig.sequelize?.transaction(async (t) => {
        const config = await ReservationConfig.findOne({
            where: {
                [Op.and]: [
                    { restaurantId: payload.restaurantId },
                    { startTime: payload.reservationTime },
                    { reservationSize: payload.partySize }
                ]
            },
            transaction: t
        });

        if (!config) {
            throw new Error('Invalid configuration.  No data found that matches the parameters.');
        }

        const limit: number = config.maxTables;
        const configId: number = config.id;

        payload.reservationConfigId = configId;

        const currentCount: number = await Reservation.count({
            where: {
                [Op.and]: [
                    { restaurantId: payload.restaurantId },
                    { reservationTime: payload.reservationTime },
                    { partySize: payload.partySize }
                ]
            },
            transaction: t
        });

        if (currentCount >= limit) {
            throw new Error('No available reservations:  the limit is ' + limit + ' and the current reservation count is ' + currentCount);
        }

        return await Reservation.create(payload, { transaction: t });
    });

}

export const getByRestaurant = async (payload: ReservationRetrieveByRestaurantAttributes): Promise<ReservationOutput[]> => {
    const result: Reservation[] = await Reservation.findAll({
        where: { restaurantId: payload.restaurantId }
    });

    return result;
}

export const getByTimeSlot = async (payload: ReservationRetrieveByTimeAttributes): Promise<ReservationOutput[]> => {
    const result: Reservation[] = await Reservation.findAll({
        where: {
            [Op.and]: [
                { restaurantId: payload.restaurantId },
                { reservationTime: payload.reservationTime }
            ]
        }
    });

    return result;
}