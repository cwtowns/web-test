const mockCreate = jest.fn();
const mockGet = jest.fn();
jest.mock('../../src/db/dal/reservationConfig', () => ({
    create: mockCreate,
    get: mockGet,
}));

import { create as createService, get as getService } from '../../src/api/services/reservationConfigService'
import { create as createDal, get as getDal } from '../../src/db/dal/reservationConfig'
import { ReservationConfigCreationAttributes, ReservationConfigRetrieveAttributes } from '../../src/db/models'
import { CreateReservationConfigDTO, GetReservationConfigDTO } from '../../src/api/dto/reservationConfig.dto'

describe('Restaurant Service', () => {
    describe('Create', () => {
        it('should reject bad config data', async () => {
            const newConfig: CreateReservationConfigDTO = {
                restaurantId: -1,
                startTime: new Date(2020, 1, 1, 11, 2),
                endTime: new Date(2020, 0, 1, 11, 3),
                reservationPartySize: 0,
                numberOfTables: -1,
            };

            mockCreate.mockReset();
            expect(() => {
                createService(newConfig);
            }).toThrow();


            expect(createDal).toBeCalledTimes(0)
        });

        it('should accept a valid payload for 1 slot', async () => {
            const newConfig: CreateReservationConfigDTO = {
                restaurantId: 1,
                startTime: new Date(2020, 0, 1, 11, 0),
                endTime: new Date(2020, 0, 1, 11, 0),
                reservationPartySize: 1,
                numberOfTables: 1,
            };

            mockCreate.mockReset();
            await createService(newConfig);

            const expectedData: ReservationConfigCreationAttributes[] = [{
                restaurantId: newConfig.restaurantId,
                startTime: newConfig.startTime,
                reservationSize: newConfig.reservationPartySize,
                maxTables: newConfig.numberOfTables
            }];

            expect(createDal).toBeCalledTimes(1)
            expect(createDal).toHaveBeenCalledWith(expectedData);
        })

        it('should accept a valid payload for multiple slots', async () => {
            const newConfig: CreateReservationConfigDTO = {
                restaurantId: 1,
                startTime: new Date(2020, 0, 1, 11, 0),
                endTime: new Date(2020, 0, 1, 11, 30),
                reservationPartySize: 1,
                numberOfTables: 1,
            };

            mockCreate.mockReset();
            await createService(newConfig);

            const expectedData: ReservationConfigCreationAttributes[] = [{
                restaurantId: newConfig.restaurantId,
                startTime: new Date(2020, 0, 1, 11, 0),
                reservationSize: newConfig.reservationPartySize,
                maxTables: newConfig.numberOfTables
            },
            {
                restaurantId: newConfig.restaurantId,
                startTime: new Date(2020, 0, 1, 11, 15),
                reservationSize: newConfig.reservationPartySize,
                maxTables: newConfig.numberOfTables
            },
            {
                restaurantId: newConfig.restaurantId,
                startTime: new Date(2020, 0, 1, 11, 30),
                reservationSize: newConfig.reservationPartySize,
                maxTables: newConfig.numberOfTables
            }];

            expect(createDal).toBeCalledTimes(1)
            expect(mockCreate.mock.calls[0][0]).toHaveLength(3);
            //expect(createDal).toHaveBeenCalledWith(expectedData);
            expect(mockCreate.mock.calls[0][0]).toStrictEqual(expectedData);
        })
    });


    describe('Get', () => {
        it('should retrieve a valid request', async () => {
            const payload: GetReservationConfigDTO = {
                restaurantId: 1,
                startTime: new Date(),
                endTime: new Date()
            };

            mockGet.mockReset();
            await getService(payload);

            expect(getDal).toBeCalledTimes(1)
        })

        it('should reject garbage dates', async () => {
            const payload: GetReservationConfigDTO = {
                restaurantId: 1,
                startTime: new Date("fdas"),
                endTime: new Date("fdasfdsa")
            };

            mockGet.mockReset();
            expect(() => {
                getService(payload);
            }).toThrow();


            expect(getDal).toBeCalledTimes(0);
        })
    });

});