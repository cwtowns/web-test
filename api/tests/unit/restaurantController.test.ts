let getAllHasData: boolean = true;
let getSingleHasData: boolean = true;

jest.mock('../../src/api/services/restaurantService', () => ({
    create: jest.fn((payload: any) => Promise.resolve(payload)),
    getAll: jest.fn(() => Promise.resolve(getAllHasData ? [{}] : null)),
    getById: jest.fn(() => Promise.resolve(getSingleHasData ? {} : null))
}));

import { RestaurantController } from '../../src/api/controllers/index'
import * as restaurantService from '../../src/api/services/restaurantService'
import { CreateRestaurantDTO } from '../../src/api/dto/resturant.dto'
import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('Restaurant Controller', () => {
    const req: Partial<Request> = {};

    describe('GetAll', () => {
        it('should 404 when no data exists', async () => {
            getAllHasData = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: RestaurantController = new RestaurantController();
            await controller.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it('should 200 when data exists', async () => {
            getAllHasData = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: RestaurantController = new RestaurantController();
            await controller.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('GetById', () => {
        it('should fail if given a non positive number for id', async () => {
            const { res, next } = getMockRes({});
            const req = getMockReq({ params: { id: 0 } })
            const controller: RestaurantController = new RestaurantController();
            await controller.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should fail if given a string for id', async () => {
            const { res, next } = getMockRes({});
            const req = getMockReq({ params: { id: 'foo' } })
            const controller: RestaurantController = new RestaurantController();
            await controller.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should 404 if not found', async () => {
            getSingleHasData = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({ params: { id: 2 } })
            const controller: RestaurantController = new RestaurantController();
            await controller.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should 200 if found', async () => {
            getSingleHasData = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({ params: { id: 1 } })
            const controller: RestaurantController = new RestaurantController();
            await controller.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('Create', () => {
        it('should error when ID id is passed in', async () => {
            const { res, next } = getMockRes({});
            const req = getMockReq({ body: { id: 1 } })
            const controller: RestaurantController = new RestaurantController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should create with valid payload', async () => {
            const newRestaurant: CreateRestaurantDTO = {
                name: 'foo',
                address: 'bar'
            }
            const { res, next } = getMockRes({});
            const req = getMockReq({ body: newRestaurant })
            const controller: RestaurantController = new RestaurantController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toBeCalledWith(newRestaurant);
        });
    });
});