import { Reservation, ReservationConfig, ReservationConfigCreationAttributes, ReservationConfigOutput, ReservationCreationAttributes, ReservationOutput, ReservationRetrieveByRestaurantAttributes, ReservationRetrieveByTimeAttributes, Restaurant } from '../../src/db/models'
import * as reservationDal from '../../src/db/dal/reservation'
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

describe('reservation DAL', () => {
    let dbConnection: Sequelize;

    beforeAll(async () => {
        dbConnection = await createDbConnection();
        dbConnection.addModels([Reservation, ReservationConfig, Restaurant]);
        await dbTearDown();
    });

    afterAll(async () => {
        await dbTearDown();
        await Reservation.sequelize?.query("alter table \"Reservations\" enable trigger all")
        await ReservationConfig.sequelize?.query("alter table \"ReservationConfigs\" enable trigger all")
        await Restaurant.sequelize?.query("alter table \"Restaurants\" enable trigger all")        
        dbConnection.close();
    });

    describe("create method", () => {

        it("should create a reservation when there are no conflicts", async () => {
            const reservationTime: Date = new Date(2020, 0, 1, 11, 0);
            const partySize: number = 2;

            const reservationConfig: ReservationConfigCreationAttributes = {
                restaurantId: 1,
                startTime: reservationTime,
                reservationSize: partySize,
                maxTables: 1
            }

            const testSetup: ReservationConfigOutput[] = await reservationConfigDal.create([reservationConfig]);

            expect(testSetup).not.toBeNull();
            expect(testSetup).toHaveLength(1);

            const reservation: ReservationCreationAttributes = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: partySize
            };

            const result: ReservationOutput = await reservationDal.create(reservation);

            expect(result).not.toBeNull();
            expect(result.id).toBeGreaterThan(0);
            expect(result.restaurantId).toBe(result.restaurantId);
            expect(result.customerId).toBe(result.customerId);
            expect(result.reservationTime).toBe(result.reservationTime);
            expect(result.partySize).toBe(result.partySize);
        });

        it('should reject a reservation when there are no available tables but party size matches', async () => {
            const reservationTime: Date = new Date(2020, 0, 1, 11, 0);
            const partySize: number = 2;

            const reservationConfig: ReservationConfigCreationAttributes = {
                restaurantId: 1,
                startTime: reservationTime,
                reservationSize: partySize,
                maxTables: 0
            }

            const testSetup: ReservationConfigOutput[] = await reservationConfigDal.create([reservationConfig]);

            expect(testSetup).not.toBeNull();
            expect(testSetup).toHaveLength(1);

            const reservation: ReservationCreationAttributes = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: partySize
            };

            let hasCaught: boolean = false;

            /*  This approach smells but I'm not sure what I'm doing wrong.  The following commented out approach doesn't work ehre

                expect(() => {
                    reservationDal.create(reservation);
                }).toThrow();
            */
            const result = await reservationDal.create(reservation).catch(err => {
                hasCaught = true;
            });

            expect(result).toBeUndefined();
            expect(hasCaught).toBe(true);
        });


        it('should reject a reservation when there are available tables but party size matches', async () => {
            const reservationTime: Date = new Date(2020, 0, 1, 11, 0);
            const partySize: number = 2;

            const reservationConfig: ReservationConfigCreationAttributes = {
                restaurantId: 1,
                startTime: reservationTime,
                reservationSize: partySize + 1,
                maxTables: 1
            }

            const testSetup: ReservationConfigOutput[] = await reservationConfigDal.create([reservationConfig]);

            expect(testSetup).not.toBeNull();
            expect(testSetup).toHaveLength(1);

            const reservation: ReservationCreationAttributes = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: partySize
            };

            let hasCaught: boolean = false;

            /*  This approach smells but I'm not sure what I'm doing wrong.  The following commented out approach doesn't work ehre

                expect(() => {
                    reservationDal.create(reservation);
                }).toThrow();
            */
            const result = await reservationDal.create(reservation).catch(err => {
                hasCaught = true;
            });

            expect(result).toBeUndefined();
            expect(hasCaught).toBe(true);
        });
    });

    describe("retrieve methods", () => {
        it("should retrieve by restaurant id", async () => {
            await Reservation.truncate({ force: true })
            await ReservationConfig.truncate({ force: true });

            const reservationTime = new Date();

            let setupResult: ReservationConfigOutput = await ReservationConfig.create({
                restaurantId: 1,
                startTime: reservationTime,
                reservationSize: 1,
                maxTables: 10
            });
            expect(setupResult).not.toBeNull();

            setupResult = await ReservationConfig.create({
                restaurantId: 2,
                startTime: reservationTime,
                reservationSize: 1,
                maxTables: 10
            });
            expect(setupResult).not.toBeNull();


            const mainReservation: ReservationCreationAttributes = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: 1
            };

            const otherReservation: ReservationCreationAttributes = {
                restaurantId: 2,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: 1
            };

            let testSetupResult: ReservationOutput = await reservationDal.create(mainReservation);
            expect(testSetupResult).not.toBeNull();
            expect(testSetupResult.id).toBeGreaterThan(0);
            testSetupResult = await reservationDal.create(otherReservation);
            expect(testSetupResult).not.toBeNull();
            expect(testSetupResult.id).toBeGreaterThan(0);

            const searchCriteria: ReservationRetrieveByRestaurantAttributes = {
                restaurantId: 1
            }

            const result: ReservationOutput[] = await reservationDal.getByRestaurant(searchCriteria);

            expect(result).not.toBeNull();
            expect(result).toHaveLength(1);
            expect(result[0].restaurantId).toBe(mainReservation.restaurantId);
            expect(result[0].customerId).toBe(mainReservation.customerId);
            expect(result[0].reservationTime).toStrictEqual(mainReservation.reservationTime);
            expect(result[0].partySize).toBe(mainReservation.partySize);
        });

        it("should retrieve by timeslot", async () => {
            await Reservation.truncate({ force: true })
            await ReservationConfig.truncate({ force: true });

            const reservationTime = new Date(2020, 0, 1, 11, 0);

            let setupResult: ReservationConfigOutput = await ReservationConfig.create({
                restaurantId: 1,
                startTime: reservationTime,
                reservationSize: 1,
                maxTables: 10
            });
            expect(setupResult).not.toBeNull();

            setupResult = await ReservationConfig.create({
                restaurantId: 2,
                startTime: reservationTime,
                reservationSize: 1,
                maxTables: 10
            });
            expect(setupResult).not.toBeNull();

            const mainReservation: ReservationCreationAttributes = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: 1
            };

            const otherReservation: ReservationCreationAttributes = {
                restaurantId: 2,
                customerId: 1,
                reservationTime: reservationTime,
                partySize: 1
            };

            let testSetupResult: ReservationOutput = await reservationDal.create(mainReservation);
            expect(testSetupResult).not.toBeNull();
            expect(testSetupResult.id).toBeGreaterThan(0);
            testSetupResult = await reservationDal.create(otherReservation);
            expect(testSetupResult).not.toBeNull();
            expect(testSetupResult.id).toBeGreaterThan(0);

            const searchCriteria: ReservationRetrieveByTimeAttributes = {
                restaurantId: 1,
                reservationTime: new Date(2020, 0, 1, 11, 0)
            }

            const result: ReservationOutput[] = await reservationDal.getByTimeSlot(searchCriteria);

            expect(result).not.toBeNull();
            expect(result).toHaveLength(1);
            expect(result[0].restaurantId).toBe(mainReservation.restaurantId);
            expect(result[0].customerId).toBe(mainReservation.customerId);
            expect(result[0].reservationTime).toStrictEqual(mainReservation.reservationTime);
            expect(result[0].partySize).toBe(mainReservation.partySize);
        });
    });
})