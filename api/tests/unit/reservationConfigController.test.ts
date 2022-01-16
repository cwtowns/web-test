let getErrors: boolean = false;
let postErrors: boolean = false;

jest.mock('../../src/api/services/reservationConfigService', () => ({
    get: jest.fn(() => getErrors ? Promise.reject() : Promise.resolve()),
    create: jest.fn(() => postErrors ? Promise.reject() : Promise.resolve()),
}));

import { ReservationConfigController } from '../../src/api/controllers/index'
import * as reservationConfigService from '../../src/api/services/reservationConfigService'
import { CreateReservationConfigDTO } from '../../src/api/dto/reservationConfig.dto'
import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('Restaurant Controller', () => {
    const req: Partial<Request> = {};

    describe('GetAll', () => {
        it('should 400 on error', async () => {
            getErrors = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationConfigController = new ReservationConfigController();
            await controller.get(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should 200 when data exists', async () => {
            getErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationConfigController = new ReservationConfigController();
            await controller.get(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('Create', () => {
        it('should 400 on error', async () => {
            postErrors = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationConfigController = new ReservationConfigController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should 400 if id is given', async () => {
            postErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({ body: { id: 1 } });
            const controller: ReservationConfigController = new ReservationConfigController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });


        it('should 200 when creation is successful', async () => {
            postErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationConfigController = new ReservationConfigController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

    });
});