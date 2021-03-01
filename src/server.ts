import './util/module-alias';
import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';
import * as database  from "@src/database";

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
    this.addControllers([forecastControler]);
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
}
