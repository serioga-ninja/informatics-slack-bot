export class ApiStatusCodes {

  //#regionSuccess
  public static OK = 200;
  public static NoContent = 204;
  //#endregionSuccess

  //#regionRedirectionMessages
  public static MovedPermanently = 301;
  public static Found = 302;

  //#endregionRedirectionMessages

  //#regionBadRequest
  public static BadRequest = 400;
  public static Unauthorized = 401;
  public static Forbidden = 403;
  public static NotFound = 404;
  public static Conflict = 409;
  public static ConnectionClosedWithoutResponse = 444;

  //#endregionBadRequest

  //#regionServerErrors
  public static InternalServerError = 500;
  //#endregionServerErrors
}
