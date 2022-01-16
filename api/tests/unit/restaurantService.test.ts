jest.mock('../../src/db/dal/restaurant', () => ({
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn()
}));

import { create as createService, getById as getByIdService, getAll as getAllService } from '../../src/api/services/restaurantService'
import { create as createDal, getAll as getAllDal, getById, getById as getByIdDal } from '../../src/db/dal/restaurant'
import { RestaurantCreationAttributes } from '../../src/db/models'

describe('Restaurant Service', () => {
    describe('Create', () => {
        it('should accept a payload and call the restaurant dal with it', async () => {
            const newRestaurant: RestaurantCreationAttributes = {
                name: "Buffas",
                address: "123 some street"
            };

            await createService(newRestaurant);

            expect(createDal).toBeCalledTimes(1)
            expect(createDal).toHaveBeenCalledWith(newRestaurant);
        })
    });

    describe('Get', () => {
        it('should retrieve the single id asked', async () => {
            const id: number = 1;

            await getByIdService(id);

            expect(getByIdDal).toBeCalledTimes(1)
            expect(getByIdDal).toHaveBeenCalledWith(id);
        })

        it('should retrieve all records', async () => {
            const id: number = 1;

            await getAllService();

            expect(getAllDal).toBeCalledTimes(1)
        })
    });
});