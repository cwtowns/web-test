let getErrors: boolean = false;
let postErrors: boolean = false;

jest.mock('../../src/api/services/reservationService', () => ({
    get: jest.fn(() => getErrors ? Promise.reject() : Promise.resolve()),
    create: jest.fn(() => postErrors ? Promise.reject() : Promise.resolve()),
}));

import { ReservationController } from '../../src/api/controllers/index'
import * as reservationService from '../../src/api/services/reservationService'
import { CreateReservationDTO } from '../../src/api/dto/reservation.dto'
import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('Reservation Controller', () => {
    const req: Partial<Request> = {};

    describe('GetById', () => {
        it('should 400 on error', async () => {
            getErrors = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationController = new ReservationController();
            await controller.get(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should 200 when data exists', async () => {
            getErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationController = new ReservationController();
            await controller.get(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('Create', () => {
        it('should 400 on error', async () => {
            postErrors = true;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationController = new ReservationController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should 400 if id is given', async () => {
            postErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({ body: { id: 1 } });
            const controller: ReservationController = new ReservationController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });


        it('should 200 when creation is successful', async () => {
            postErrors = false;
            const { res, next } = getMockRes({});
            const req = getMockReq({});
            const controller: ReservationController = new ReservationController();
            await controller.post(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

    });
});