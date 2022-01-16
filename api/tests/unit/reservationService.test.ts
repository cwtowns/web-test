const mockCreate = jest.fn();
const mockGetByTimeSlot = jest.fn();
const mockGetByRestaurant = jest.fn();
jest.mock('../../src/db/dal/reservation', () => ({
    create: mockCreate,
    getByTimeSlot: mockGetByTimeSlot,
    getByRestaurant: mockGetByRestaurant
}));

import { create as createService, get as getService } from '../../src/api/services/reservationService'
import { create as createDal, getByRestaurant, getByRestaurant as getByRestaurantDal, getByTimeSlot as getByTimeSlotDal } from '../../src/db/dal/reservation'
import { ReservationCreationAttributes, ReservationRetrieveByTimeAttributes, ReservationRetrieveByRestaurantAttributes } from '../../src/db/models'
import { CreateReservationDTO, GetReservationDTO } from '../../src/api/dto/reservation.dto'

describe('Reservation Service', () => {
    describe('Create', () => {
        it('should reject bad config data', async () => {
            const reservation: CreateReservationDTO = {
                restaurantId: -1,
                customerId: -1,
                reservationTime: new Date("foobar"),
                partySize: 0
            };
            mockCreate.mockReset();
            let hasThrown : boolean = false;

            try {
                await createService(reservation);
            }
            catch {
                hasThrown = true;
            }
            expect(hasThrown).toBe(true);   
            expect(createDal).toBeCalledTimes(0) 
            
            hasThrown = false;
            reservation.reservationTime = new Date(2020, 0, 1, 11, 11);            

            try {
                await createService(reservation);
            }
            catch {
                hasThrown = true;
            }
                
            expect(hasThrown).toBe(true);        
            expect(createDal).toBeCalledTimes(0)
        });

        it('should allow valid data', async () => {
            const reservation: CreateReservationDTO = {
                restaurantId: 1,
                customerId: 1,
                reservationTime: new Date(2020, 0, 1, 11, 15),
                partySize: 1
            };
            mockCreate.mockReset();
            createService(reservation);
            expect(createDal).toBeCalledTimes(1);
        });
    });

    describe('Get', () => {
        it('should retrieve a valid request without a time', async () => {
            const payload: GetReservationDTO = {
                restaurantId: 1
            };

            mockGetByRestaurant.mockReset();
            await getService(payload);

            expect(getByRestaurantDal).toBeCalledTimes(1)
        })

        it('should retrieve a valid request with a time', async () => {
            const payload: GetReservationDTO = {
                restaurantId: 1,
                reservationTime: new Date(2020, 0, 1, 11, 15)
            };

            mockGetByTimeSlot.mockReset();
            await getService(payload);
            expect(getByTimeSlotDal).toBeCalledTimes(1)
        })

        it('should error with bad data', async () => {
            const payload: GetReservationDTO = {
                restaurantId: -1,
                reservationTime: new Date(2020, 0, 1, 11, 11)
            };

            mockGetByRestaurant.mockReset();
            mockGetByTimeSlot.mockReset();

            expect(() => {
                getService(payload)
            }).toThrow();

            expect(getByTimeSlotDal).toBeCalledTimes(0);
            expect(getByRestaurantDal).toBeCalledTimes(0);

            payload.restaurantId = 1;

            expect(() => {
                getService(payload)
            }).toThrow();

            expect(getByTimeSlotDal).toBeCalledTimes(0);
            expect(getByRestaurantDal).toBeCalledTimes(0);
        })
    });
});