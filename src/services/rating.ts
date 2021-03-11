import { ForecastPoint } from '@src/clients/stormGlass';
import { Beach, GoPosition } from '@src/models/beach';

// meters
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    waveDirection: GoPosition,
    windDirection: GoPosition
  ): number {
    // if wind is onshore, low rating
    if (waveDirection === windDirection) {
      return 1;
    } else if (this.isWindOffShore(waveDirection, windDirection)) {
      return 5;
    }
    // cross winds gets 3
    return 3;
  }

  private isWindOffShore(
    waveDirection: string,
    windDirection: string
  ): boolean {
    return (
      (waveDirection === GoPosition.N &&
        windDirection === GoPosition.S &&
        this.beach.position === GoPosition.N) ||
      (waveDirection === GoPosition.S &&
        windDirection === GoPosition.N &&
        this.beach.position === GoPosition.S) ||
      (waveDirection === GoPosition.E &&
        windDirection === GoPosition.W &&
        this.beach.position === GoPosition.E) ||
      (waveDirection === GoPosition.W &&
        windDirection === GoPosition.E &&
        this.beach.position === GoPosition.W)
    );
  }

  /**
   * Rate will start from 1 given there will be always some wave period
   */
  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }

    if (period >= 10 && period < 14) {
      return 4;
    }
    if (period >= 14) {
      return 5;
    }

    return 1;
  }

  /**
   * Rate will start from 1 given there will always some wave height
   */
  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    ) {
      return 2;
    }
    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    ) {
      return 3;
    }
    if (height >= waveHeights.headHigh.min) {
      return 5;
    }

    return 1;
  }

  public getPositionFromLocation(coordinates: number): GoPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return GoPosition.N;
    }
    if (coordinates >= 50 && coordinates < 120) {
      return GoPosition.E;
    }
    if (coordinates >= 120 && coordinates < 220) {
      return GoPosition.S;
    }
    if (coordinates >= 220 && coordinates < 310) {
      return GoPosition.W;
    }
    return GoPosition.E;
  }

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;
    return Math.round(finalRating);
  }
}
