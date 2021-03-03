import './util/module-alias';
import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';
import { BeachController } from './controllers/beaches';
import { UsersController } from './controllers/user';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControlers();
    await this.databaseSetup();
    // this.app.listen(this.port)
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControlers(): void {
    const forecastControler = new ForecastController();
    const beachControler = new BeachController();
    const userControler = new UsersController();
    this.addControllers([forecastControler, beachControler, userControler]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening of port:', this.port);
    });
  }
}
