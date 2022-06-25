export class ErrorResponse {
  private errors: ErrorObject[];
  constructor({ errors } = { errors: [] }) {
    if (!errors) errors = [];
    this.errors = errors.map((err) => new ErrorObject(err));
  }

  toString() {
    return this.errors
      .map((err) => `${err.title} (Code ${err.code})`)
      .join('; ');
  }
}
export interface ErrorData {
  id?: any;
  status?: any;
  code?: any;
  title?: any;
  detail?: any;
  source?: any;
  meta?: any;
}
export class ErrorObject {
  public id: number;
  public status: string;
  public code: number;
  public title: string;
  public detail: any;
  public source: any;
  public meta: any;
  constructor({
    id,
    status,
    code,
    title,
    detail,
    source,
    meta,
  }: ErrorData = {}) {
    this.id = id;
    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.source = source;
    this.meta = meta;
  }
}

export interface RequestErrorData {
  message?: string;
  method?: string;
  path?: string;
  respBody?: any;
  resp?: any;
}

export class RequestError extends Error {
  public simpleMessage: string;
  public body: any;
  public resp: any;

  constructor({ message, method, path, respBody, resp }: RequestErrorData) {
    let simpleMessage = 'Error performing request';
    if (method) simpleMessage += ' ' + method;
    if (path) simpleMessage += ' ' + path;

    if (!message) {
      message = simpleMessage;
      if (respBody) message += ': ' + JSON.stringify(respBody);
    }
    super(message);

    this.simpleMessage = simpleMessage;
    this.body = respBody;
    this.resp = resp;
  }
}
