import { Sequelize } from 'sequelize-typescript';

export const createDbConnection = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize("postgres://postgres:password@db/wisely_test", {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
  })

  await sequelize.sync({
    alter: true
  });
  return sequelize;
}