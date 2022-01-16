import * as restaurantDal from '../../db/dal/restaurant'
import { RestaurantCreationAttributes, RestaurantOutput } from '../../db/models'

export const create = (payload: RestaurantCreationAttributes): Promise<RestaurantOutput> => {
    return restaurantDal.create(payload);
}

export const getById = (id: number): Promise<RestaurantOutput> => {
    return restaurantDal.getById(id);
}

export const getAll = (): Promise<RestaurantOutput[]> => {
    return restaurantDal.getAll();
}
