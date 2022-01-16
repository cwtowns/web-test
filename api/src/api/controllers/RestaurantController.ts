import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import Logger from '../../logger'

import * as restaurantService from '../services/restaurantService'
import { CreateRestaurantDTO } from '../dto/resturant.dto'


@Controller('restaurant')
export class RestaurantController {
    @Get(':id')
    public async getById(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).send("id is not a number");
        }

        try {
            const result = await restaurantService.getById(id); 

            if (!result) {
                res.status(404).send();
                return;
            }
    
            return res.status(200).send(result);    
        }
        catch(error) {
            return res.status(400).send(error ? error.toString() : "");
        }        
    }

    @Get('/')
    public async getAll(req: Request, res: Response) {
        try {
            const result = await restaurantService.getAll();

            if (!result)
                return res.status(404).send();
    
            return res.status(200).send(result);    
        }
        catch(error) {
            return res.status(400).send(error ? error.toString() : "");
        }                
    }

    @Post('')
    public async post(req: Request, res: Response) {
        const payload: CreateRestaurantDTO = req.body;

        //TODO in general input validation can be better across the project
        if (req.body.hasOwnProperty('id')) {
            return res.status(400).send('do not send id');
        }

        try {
            const result = await restaurantService.create(payload);

            return res.status(200).send(result);
        }
        catch(error) {
            return res.status(400).send(error ? error.toString() : "");
        }    
    }
}
