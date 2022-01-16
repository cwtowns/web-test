import {
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Optional } from 'sequelize'
import { ReservationConfig } from '.'


export interface RestaurantCreationAttributes {
  name: string
  address: string
}

export interface RestraurantAttributes extends RestaurantCreationAttributes {
  id: number
  created_at: Date
  updated_at: Date
}


// TODO:  neither creational attributes here restricts the id parameter from being supplied.
// export interface RestaurantCreationAttributes extends Omit<RestraurantAttributes, 'id'> {}
// this likely needs to be handled at the boundaries, but I'm curious if Omit is better than Optional here.  
//export interface RestaurantCreationAttributes extends Optional<RestraurantAttributes, 'id'>{}

export interface RestaurantOutput extends Required<RestraurantAttributes> { }

@Table
export class Restaurant extends Model<RestraurantAttributes, RestaurantCreationAttributes> {

  @PrimaryKey
  @Column({ autoIncrement: true })
  public id!: number

  @Column
  public name!: string

  @Column
  public address!: string

  @HasMany(() => ReservationConfig)
  reservationConfigs: ReservationConfig[]

  @CreatedAt
  public readonly created_at!: Date

  @UpdatedAt
  public readonly updated_at!: Date
}
