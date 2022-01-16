import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

import * as reservation from '../services/reservationService'
import { CreateReservationDTO, GetReservationDTO } from '../dto/reservation.dto'
import Logger from '../../logger'
import dayjs from 'dayjs'


@Controller('reservation')
export class ReservationController {
    @Get('')
    public async get(req: Request, res: Response) {
        const payload: GetReservationDTO = {
            restaurantId: Number(req.query.restaurantId),            
        };

        if(req.query?.reservationTime)
            payload.reservationTime = new Date(String(req.query?.reservationTime))

        try {
            const result = await reservation.get(payload);
            return res.status(200).send(result);
        }
        catch(error) {
            return res.status(400).send(error ? error.toString() : "");
        }
    }


    @Post('')
    public async post(req: Request, res: Response) {

        const payload: CreateReservationDTO = {
            restaurantId: Number(req.body.restaurantId),
            reservationTime: new Date(String(req.body.reservationTime)),
            customerId: Number(req.body.customerId),
            partySize: Number(req.body.partySize)
        };

        if (req.body.hasOwnProperty('id')) {
            return res.status(400).send('do not send id');
        }

        try {
            const result = await reservation.create(payload);
            return res.status(200).send(result);
        }
        catch(error) {
            return res.status(400).send(error ? error.toString() : "");
        }        
    }
}
