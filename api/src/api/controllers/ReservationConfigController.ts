import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import * as reservationConfig from '../services/reservationConfigService';
import { CreateReservationConfigDTO, GetReservationConfigDTO } from '../dto/reservationConfig.dto';

@Controller('reservationConfig')
export class ReservationConfigController {
  @Get('')
  public async get(req: Request, res: Response) {
    const payload: GetReservationConfigDTO = {
      restaurantId: Number(req.query.restaurantId),
      startTime: new Date(String(req.query.startTime)),
      endTime: new Date(String(req.query.endTime)),
    };

    try {
      const result = await reservationConfig.get(payload);  
      return res.status(200).send(result);
    }
    catch(error) {
      return res.status(400).send(error ? error.toString() : "");
    }
  }

  @Post('')
  public async post(req: Request, res: Response) {
    const payload: CreateReservationConfigDTO = req.body;

    payload.startTime = new Date(payload.startTime);
    payload.endTime = new Date(payload.endTime);

    if (req.body.hasOwnProperty('id')) {
      return res.status(400).send('do not send id');
    }

    try {
      const result = await reservationConfig.create(payload)
      return res.status(200).send(result);
    }
    catch(error) {            
      return res.status(400).send(error ? error.toString() : "");
    }
  }
}
