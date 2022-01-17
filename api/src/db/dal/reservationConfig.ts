import { Op,  } from 'sequelize'
import { Reservation, ReservationConfig } from '../models'
import { ReservationConfigOutput, ReservationConfigCreationAttributes, ReservationConfigRetrieveAttributes } from '../models'

export const create = async (payload: ReservationConfigCreationAttributes[]): Promise<ReservationConfigOutput[]> => {
    const result = await ReservationConfig.bulkCreate(payload);
    return result;
}

export const get = async (payload: ReservationConfigRetrieveAttributes): Promise<ReservationConfigOutput[]> => {
    const result = await ReservationConfig.findAll({
        attributes: {
            include: [
                [ReservationConfig.sequelize.literal('\"ReservationConfig\".\"maxTables\" - COUNT(\"reservations\".\"id\")'), 'availableTables']
            ]
        },
        include: [
            {
                model: Reservation,
                attributes: [] 
            }
        ],
        group: ['ReservationConfig.id'],
        where: {
            [Op.and]: [
                { restaurantId: payload.restaurantId },
                {
                    startTime: {
                        [Op.gte]: payload.startTime
                    }
                },
                {
                    startTime: {
                        [Op.lte]: payload.endTime
                    }
                },
            ]
        }
    });
    return result;
}