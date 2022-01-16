import { Op } from 'sequelize'
import { Restaurant } from '../models'
import { RestaurantOutput, RestaurantCreationAttributes } from '../models'

export const create = async (payload: RestaurantCreationAttributes): Promise<RestaurantOutput> => {
    const restaurant = await Restaurant.create(payload);
    return restaurant;
}

export const getById = async (id: number): Promise<RestaurantOutput> => {
    const restaurant = await Restaurant.findByPk(id);
    return restaurant;
}

export const getAll = async (): Promise<RestaurantOutput[]> => {
    return Restaurant.findAll({});
}