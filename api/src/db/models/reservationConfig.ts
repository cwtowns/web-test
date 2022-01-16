import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'
import { HasOneGetAssociationMixin } from 'sequelize/dist'

import { Restaurant } from '.'

export interface ReservationConfigRetrieveAttributes {
  restaurantId: number,
  startTime: Date,
  endTime: Date
}

export interface ReservationConfigCreationAttributes {
  restaurantId: number
  startTime: Date,
  reservationSize: number,
  maxTables: number
}

export interface ReservationConfigAttributes extends ReservationConfigCreationAttributes {
  id: number
  created_at: Date
  updated_at: Date
}

export interface ReservationConfigOutput extends Required<ReservationConfigAttributes> { }

@Table
export class ReservationConfig extends Model<ReservationConfigAttributes, ReservationConfigCreationAttributes> {

  @PrimaryKey
  @Column({ autoIncrement: true })
  public id!: number

  @Column
  @ForeignKey(() => Restaurant)
  public restaurantId!: number

  @Column
  public startTime!: Date

  @Column
  public reservationSize!: number

  @Column
  public maxTables!: number

  @CreatedAt
  public readonly created_at!: Date

  @UpdatedAt
  public readonly updated_at!: Date
}
