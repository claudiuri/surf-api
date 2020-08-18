import './util/module-alias';
import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import { ForecastController } from './controllers/forecast';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControlers();
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
}
