import {
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Restaurant } from '.'


export interface ReservationRetrieveByRestaurantAttributes {
  restaurantId: number,
}

export interface ReservationRetrieveByTimeAttributes extends ReservationRetrieveByRestaurantAttributes {
  reservationTime: Date
}


export interface ReservationCreationAttributes {
  restaurantId: number,
  customerId: number,
  reservationTime: Date,
  partySize: number
}

export interface ReservationAttributes extends ReservationCreationAttributes {
  id: number
  created_at: Date
  updated_at: Date
}

export interface ReservationOutput extends Required<ReservationAttributes> { }

@Table
export class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> {

  @PrimaryKey
  @Column({ autoIncrement: true })
  public id!: number

  @ForeignKey(() => Restaurant)
  @Column
  public restaurantId!: number

  @Column
  public customerId!: number 

  @Column
  public reservationTime!: Date

  @Column
  public partySize!: number

  @CreatedAt
  public readonly created_at!: Date

  @UpdatedAt
  public readonly updated_at!: Date
}