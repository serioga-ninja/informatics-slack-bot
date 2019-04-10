import * as moment from 'moment';
import {DurationInputArg2, Moment, unitOfTime} from 'moment';

export type TDateTime = string | number | Date | Moment;

export enum EDateCompare {
  isSame = 0,
  isBefore,
  isAfter,
}

const searchForRightFormat = (date: TDateTime): string => {
  if (typeof date !== 'string' || moment(date).isValid()) {
    return null;
  }

  const knownFormats = ['DD/MM/YYYY'];
  let validFormat;

  for (const format of knownFormats) {
    if (moment(date, format).isValid()) {
      validFormat = format;
      break;
    }
  }

  return validFormat;
};

export class DateTimeHelper {

  //#regionPrivatePropertie
  private momentDate: Moment;
  //#endregionPrivatePropertie

  //#regionConstructor
  constructor(date: TDateTime = new Date(), format?: string, utc: boolean = false) {
    this.momentDate = DateTimeHelper.toMoment(date, utc, format);
  }

  //#regionStaticMethods
  static now(): Moment;

  static now(format: string): string;

  static now(format?: string): Moment | string {
    if (format) {
      return DateTimeHelper.toString(moment(), format);
    }

    return moment();
  }

  static toMoment(date: TDateTime, utc: boolean = false, format: string = searchForRightFormat(date)): Moment {
    if (utc) {
      return moment.parseZone(date, format).utc();
    }

    return moment.parseZone(date, format);
  }

  static toString(date: TDateTime, format: string, utc: boolean = false): string {
    return DateTimeHelper
      .toMoment(date, utc)
      .format(format);
  }

  static toUnix(date: TDateTime, utc: boolean = false): number {
    return DateTimeHelper
      .toMoment(date, utc)
      .valueOf();
  }

  static toJsDate(date: TDateTime, utc: boolean = false): Date {
    return DateTimeHelper
      .toMoment(date, utc)
      .toDate();
  }

  static addMonths(date: TDateTime, months: number, format: string, utc: boolean = false): string {
    return DateTimeHelper
      .toMoment(date, utc)
      .add(months, 'month')
      .format(format);
  }

  static addDays(date: TDateTime, days: number, format: string, utc: boolean = false): string {
    return DateTimeHelper
      .toMoment(date, utc)
      .add(days, 'day')
      .format(format);
  }

  static compareDates(firstDate: TDateTime, secondDate: TDateTime, compare: EDateCompare): boolean {
    const _firstDate = DateTimeHelper.toMoment(firstDate);
    const _secondDate = DateTimeHelper.toMoment(secondDate);

    switch (compare) {
      case EDateCompare.isAfter :
        return _firstDate.isAfter(_secondDate);
      case EDateCompare.isBefore :
        return _firstDate.isBefore(_secondDate);
      case EDateCompare.isSame :
        return _firstDate.isSame(_secondDate);
    }
  }

  /**
   * dif days (firstDate - secondDate)
   *
   * @example
   * DateTimeHelper.diffDays('2000-12-20', '2000-12-10') returned 10
   * DateTimeHelper.diffDays('2000-12-10', '2000-12-20') returned -10
   */
  static diffDays(firstDate: TDateTime, secondDate: TDateTime): number {
    const _firstDate = DateTimeHelper.toMoment(firstDate);
    const _secondDate = DateTimeHelper.toMoment(secondDate);

    return _firstDate.diff(_secondDate, 'day');
  }

  /**
   * dif Months (firstDate - secondDate)
   *
   * @example
   * DateTimeHelper.diffDays('2000-02-20', '2000-12-20') returned 10
   * DateTimeHelper.diffDays('2000-12-10', '2000-02-20') returned -10
   */
  static diffMonths(firstDate: TDateTime, secondDate: TDateTime): number {
    const _firstDate = DateTimeHelper.toMoment(firstDate);
    const _secondDate = DateTimeHelper.toMoment(secondDate);

    return _firstDate.diff(_secondDate, 'month');
  }

  //#endregionStaticMethods

  static startOf(date: TDateTime, unitOfTime: unitOfTime.StartOf) {
    if (!moment.isMoment(date)) {
      date = DateTimeHelper.toMoment(date);
    }

    return date.startOf(unitOfTime);
  }

  //#endregionConstructor

  //#regionPublicMethods
  add(amount: number, unit: DurationInputArg2): DateTimeHelper {
    this.momentDate
      .add(amount, unit);

    return this;
  }

  startOf(unitOfTime: unitOfTime.StartOf) {
    DateTimeHelper
      .startOf(this.momentDate, unitOfTime);

    return this;
  }

  toString(format: string): string {
    return this.momentDate
      .format(format);
  }

  diffDays(secondDate: TDateTime): number {
    const _secondDate = DateTimeHelper.toMoment(secondDate);

    return this.momentDate.diff(_secondDate, 'day');
  }

  //#endregionPublicMethods
}
