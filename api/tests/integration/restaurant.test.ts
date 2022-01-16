//docker-compose up
//docker exec -ti web-test_api_1 yarn test

import { Reservation, ReservationConfig, Restaurant, RestaurantCreationAttributes, RestaurantOutput } from '../../src/db/models'
import * as restaurantDal from '../../src/db/dal/restaurant'
import { Sequelize } from 'sequelize-typescript';

import { createDbConnection } from '../common'


const dbTearDown = async () => {
    await Reservation.sequelize?.query("alter table \"Reservations\" disable trigger all")
    await ReservationConfig.sequelize?.query("alter table \"ReservationConfigs\" disable trigger all")
    await Restaurant.sequelize?.query("alter table \"Restaurants\" disable trigger all")


    await Reservation.truncate({ force: true, cascade: true })
    await Restaurant.truncate({ force: true, cascade: true })
    await ReservationConfig.truncate({ force: true, cascade: true })   
}

describe('restaurant DAL', () => {
    let dbConnection: Sequelize;

    const melbasRestaurant: RestaurantCreationAttributes = {
        name: "Melba's",
        address: "1525 Elysian Fields Ave, New Orleans, LA 70117"
    };

    const buffasRestaurant: RestaurantCreationAttributes = {
        name: "Buffa's",
        address: "1001 Esplanade Ave, New Orleans, LA 70116"
    };

    let createdRestaurant: RestaurantOutput;

    beforeAll(async () => {
        dbConnection = await createDbConnection();
        dbConnection.addModels([Restaurant, Reservation, ReservationConfig]);
        await dbTearDown();

        createdRestaurant = await Restaurant.create(melbasRestaurant);
    });

    afterAll(async () => {
        await dbTearDown();
        await Reservation.sequelize?.query("alter table \"Reservations\" enable trigger all")
        await ReservationConfig.sequelize?.query("alter table \"ReservationConfigs\" enable trigger all")
        await Restaurant.sequelize?.query("alter table \"Restaurants\" enable trigger all")              
        dbConnection.close();
    });

    describe("create method", () => {
        it("should create a restaurant", async () => {
            const result: RestaurantOutput = await restaurantDal.create(melbasRestaurant);

            expect(result).not.toBeNull();
            expect(result.id).toBeGreaterThan(0);
            expect(result.address).toBe(melbasRestaurant.address);
            expect(result.name).toBe(melbasRestaurant.name);
        });
    });

    describe("getById method", () => {
        it("should find a created restaurant", async () => {
            const createResult: RestaurantOutput = await restaurantDal.create(melbasRestaurant);
            const findResult: RestaurantOutput = await restaurantDal.getById(createResult.id);

            expect(findResult).not.toBeNull();
            expect(findResult.id).toBe(createResult.id);
        });

        it("should return nothing if no restaurant", async () => {
            expect(await restaurantDal.getById(-1)).toBe(null);
        });
    });

    describe("getAll method", () => {
        it("should find all restaurants", async () => {
            const initialCount: number = await (await restaurantDal.getAll()).length;
            const createdMelbas: RestaurantOutput = await restaurantDal.create(melbasRestaurant);
            const createdBuffas: RestaurantOutput = await restaurantDal.create(buffasRestaurant);
            const findResult: RestaurantOutput[] = await restaurantDal.getAll();
            expect(findResult.length).toBe(2 + initialCount);
        });
    });
});
