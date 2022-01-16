//docker-compose up
//docker exec -ti web-test_api_1 yarn test

import { Reservation, ReservationConfig, ReservationConfigCreationAttributes, ReservationConfigOutput, ReservationConfigRetrieveAttributes, Restaurant } from '../../src/db/models'
import * as reservationConfigDal from '../../src/db/dal/reservationConfig'
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

describe('reservationConfig DAL', () => {
    let dbConnection: Sequelize;

    beforeAll(async () => {
        dbConnection = await createDbConnection();
        dbConnection.addModels([ReservationConfig, Reservation, Restaurant]);
        await dbTearDown();
    });

    afterAll(async () => {
        await dbTearDown();
        await Reservation.sequelize?.query("alter table \"Reservations\" enable trigger all")
        await ReservationConfig.sequelize?.query("alter table \"ReservationConfigs\" enable trigger all")
        await Restaurant.sequelize?.query("alter table \"Restaurants\" enable trigger all")              
        dbConnection.close();
    });

    const validate = (input: ReservationConfigCreationAttributes, output: ReservationConfigOutput) => {
        expect(output.id).toBeGreaterThan(0);
        expect(output.restaurantId).toBe(input.restaurantId);
        expect(String(output.startTime)).toBe(String(input.startTime));
        expect(output.reservationSize).toBe(input.reservationSize);
        expect(output.maxTables).toBe(input.maxTables);
    }

    describe("retrieve method", () => {
        it("should retrieve configs within the timeframe", async () => {

            const configs: ReservationConfigCreationAttributes[] = [{
                restaurantId: 1,
                startTime: new Date("2020-01-01"),
                reservationSize: 1,
                maxTables: 1
            }, {
                restaurantId: 2,
                startTime: new Date("2020-01-02"),
                reservationSize: 2,
                maxTables: 2
            },
            {
                restaurantId: 3,
                startTime: new Date("2020-01-01"),
                reservationSize: 3,
                maxTables: 3
            }];

            const testSetupResult: ReservationConfigOutput[] = await reservationConfigDal.create(configs);

            expect(testSetupResult.length).toBe(3);

            const config: ReservationConfigRetrieveAttributes = {
                restaurantId: 1,
                startTime: new Date("2020-01-01"),
                endTime: new Date("2020-01-02")
            };

            const result: ReservationConfigOutput[] = await reservationConfigDal.get(config);
            const expectedResult = configs[0];

            expect(result).not.toBeNull();
            expect(result.length).toBe(1);
            expect(result[0].restaurantId).toBe(configs[0].restaurantId);
            expect(result[0].reservationSize).toBe(configs[0].reservationSize);
            expect(String(result[0].startTime)).toBe(String(configs[0].startTime));
            expect(result[0].maxTables).toBe(configs[0].maxTables);
        });
    })

    describe("create method", () => {
        it("should create a single config", async () => {

            const config: ReservationConfigCreationAttributes[] = [{
                restaurantId: 1,
                startTime: new Date(),
                reservationSize: 1,
                maxTables: 1
            }];

            const result: ReservationConfigOutput[] = await reservationConfigDal.create(config);

            expect(result).not.toBeNull();
            expect(result.length).toBe(config.length);
            validate(config[0], result[0]);
        });

        it("should create a multiple configs", async () => {

            const config: ReservationConfigCreationAttributes[] = [{
                restaurantId: 1,
                startTime: new Date(),
                reservationSize: 1,
                maxTables: 1
            },
            {
                restaurantId: 1,
                startTime: new Date(),
                reservationSize: 3,
                maxTables: 1
            }];

            const result: ReservationConfigOutput[] = await reservationConfigDal.create(config);

            expect(result).not.toBeNull();
            expect(result.length).toBe(config.length);
            validate(config[0], result[0]);
            validate(config[1], result[1]);
        });

    });
});
