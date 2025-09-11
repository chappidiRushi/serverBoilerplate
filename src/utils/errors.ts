// Base HttpError class
export class HttpError extends Error {
  status: number;

  constructor(status: number, message?: any) {
    super(message || `HTTP ${status}`);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
HttpError
// Hardcoded errors with numbers at the end
export const err = {
  // 4xx Client Errors
  BAD_REQUEST_400: (msg?: any) => new HttpError(400, msg || "Bad Request"),
  UNAUTHORIZED_401: (msg?: any) => new HttpError(401, msg || "Unauthorized"),
  PAYMENT_REQUIRED_402: (msg?: any) => new HttpError(402, msg || "Payment Required"),
  FORBIDDEN_403: (msg?: any) => new HttpError(403, msg || "Forbidden"),
  NOT_FOUND_404: (msg?: any) => new HttpError(404, msg || "Not Found"),
  METHOD_NOT_ALLOWED_405: (msg?: any) => new HttpError(405, msg || "Method Not Allowed"),
  NOT_ACCEPTABLE_406: (msg?: any) => new HttpError(406, msg || "Not Acceptable"),
  PROXY_AUTHENTICATION_REQUIRED_407: (msg?: any) => new HttpError(407, msg || "Proxy Authentication Required"),
  REQUEST_TIMEOUT_408: (msg?: any) => new HttpError(408, msg || "Request Timeout"),
  CONFLICT_409: (msg?: any) => new HttpError(409, msg || "Conflict"),
  GONE_410: (msg?: any) => new HttpError(410, msg || "Gone"),
  LENGTH_REQUIRED_411: (msg?: any) => new HttpError(411, msg || "Length Required"),
  PRECONDITION_FAILED_412: (msg?: any) => new HttpError(412, msg || "Precondition Failed"),
  PAYLOAD_TOO_LARGE_413: (msg?: any) => new HttpError(413, msg || "Payload Too Large"),
  URI_TOO_LONG_414: (msg?: any) => new HttpError(414, msg || "URI Too Long"),
  UNSUPPORTED_MEDIA_TYPE_415: (msg?: any) => new HttpError(415, msg || "Unsupported Media Type"),
  RANGE_NOT_SATISFIABLE_416: (msg?: any) => new HttpError(416, msg || "Range Not Satisfiable"),
  EXPECTATION_FAILED_417: (msg?: any) => new HttpError(417, msg || "Expectation Failed"),
  IM_A_TEAPOT_418: (msg?: any) => new HttpError(418, msg || "I'm a teapot"),
  MISDIRECTED_REQUEST_421: (msg?: any) => new HttpError(421, msg || "Misdirected Request"),
  UNPROCESSABLE_ENTITY_422: (msg?: any) => new HttpError(422, msg || "Unprocessable Entity"),
  LOCKED_423: (msg?: any) => new HttpError(423, msg || "Locked"),
  FAILED_DEPENDENCY_424: (msg?: any) => new HttpError(424, msg || "Failed Dependency"),
  TOO_EARLY_425: (msg?: any) => new HttpError(425, msg || "Too Early"),
  UPGRADE_REQUIRED_426: (msg?: any) => new HttpError(426, msg || "Upgrade Required"),
  PRECONDITION_REQUIRED_428: (msg?: any) => new HttpError(428, msg || "Precondition Required"),
  TOO_MANY_REQUESTS_429: (msg?: any) => new HttpError(429, msg || "Too Many Requests"),
  REQUEST_HEADER_FIELDS_TOO_LARGE_431: (msg?: any) => new HttpError(431, msg || "Request Header Fields Too Large"),
  UNAVAILABLE_FOR_LEGAL_REASONS_451: (msg?: any) => new HttpError(451, msg || "Unavailable For Legal Reasons"),

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR_500: (msg?: any) => new HttpError(500, msg || "Internal Server Error"),
  NOT_IMPLEMENTED_501: (msg?: any) => new HttpError(501, msg || "Not Implemented"),
  BAD_GATEWAY_502: (msg?: any) => new HttpError(502, msg || "Bad Gateway"),
  SERVICE_UNAVAILABLE_503: (msg?: any) => new HttpError(503, msg || "Service Unavailable"),
  GATEWAY_TIMEOUT_504: (msg?: any) => new HttpError(504, msg || "Gateway Timeout"),
  HTTP_VERSION_NOT_SUPPORTED_505: (msg?: any) => new HttpError(505, msg || "HTTP Version Not Supported"),
  VARIANT_ALSO_NEGOTIATES_506: (msg?: any) => new HttpError(506, msg || "Variant Also Negotiates"),
  INSUFFICIENT_STORAGE_507: (msg?: any) => new HttpError(507, msg || "Insufficient Storage"),
  LOOP_DETECTED_508: (msg?: any) => new HttpError(508, msg || "Loop Detected"),
  NOT_EXTENDED_510: (msg?: any) => new HttpError(510, msg || "Not Extended"),
  NETWORK_AUTHENTICATION_REQUIRED_511: (msg?: any) => new HttpError(511, msg || "Network Authentication Required"),
};

// Usage
// throw err.NOT_FOUND_404("Resource not found");
// throw err.BAD_REQUEST_400(); // default message
