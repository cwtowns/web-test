import { Op } from 'sequelize'
import { ReservationConfig } from '../models'
import { ReservationConfigOutput, ReservationConfigCreationAttributes, ReservationConfigRetrieveAttributes } from '../models'

export const create = async (payload: ReservationConfigCreationAttributes[]): Promise<ReservationConfigOutput[]> => {
    const result = await ReservationConfig.bulkCreate(payload)
    return result;
}

export const get = async (payload: ReservationConfigRetrieveAttributes): Promise<ReservationConfigOutput[]> => {
    const result = await ReservationConfig.findAll({
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