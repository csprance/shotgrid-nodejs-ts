import retry from 'async-retry';
import fetch from 'isomorphic-unfetch';
import qs from 'qs';
import util from 'util';

import { entityBatch } from './client/entity-batch';
import { entityCreate } from './client/entity-create';
import { entityDelete } from './client/entity-delete';
import { entityItemUpload } from './client/entity-item-upload';
import { entityRead } from './client/entity-read';
import { entityReadAll } from './client/entity-read-all';
import { entityRevive } from './client/entity-revive';
import { entitySearch } from './client/entity-search';
import { entityUpdate } from './client/entity-update';
import { preferencesGet } from './client/preferences-get';
import { schemaFieldCreate } from './client/schema-field-create';
import { schemaFieldDelete } from './client/schema-field-delete';
import { schemaFieldRevive } from './client/schema-field-revive';
import { schemaFieldUpdate } from './client/schema-field-update';
import { schemaGet } from './client/schema-get';
import { RequestError } from './error';

const DEFAULT_API_BASE_PATH = '/api/v1';
const REFRESH_EXPIRATION_WINDOW = 1000 * 60 * 3;
const RETRY_COUNT = 2;

export interface ShotgunApiClientConfig {
  siteUrl: string;
  credentials: any;
  debug?: boolean;
  apiBasePath?: string;
}
export default class ShotgunApiClient {
  public apiBasePath: string;
  public siteUrl: string;
  private _token: null | any;
  public credentials: any;
  public tokenExpirationTimestamp: null | number;
  public debug: boolean;

  constructor({
    siteUrl,
    credentials,
    debug = false,
    apiBasePath = DEFAULT_API_BASE_PATH,
  }: ShotgunApiClientConfig) {
    this.siteUrl = siteUrl;
    this.credentials = credentials;
    this._token = null;
    this.tokenExpirationTimestamp = null;
    this.debug = debug;

    if (apiBasePath && !apiBasePath.startsWith('/'))
      apiBasePath = '/' + apiBasePath;

    this.apiBasePath = apiBasePath;
  }

  get token() {
    return this._token;
  }

  set token(val) {
    this._token = val;
    this.tokenExpirationTimestamp = val.expires_in * 1000 + Date.now();
  }

  async connect(credentials = this.credentials) {
    let { siteUrl, apiBasePath } = this;

    let url = new URL(`${siteUrl}${apiBasePath}/auth/access_token`);
    // @NOTE Should they be cleared from memory at this time?
    url.search = qs.stringify(credentials);

    let resp = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!resp.ok) {
      let respBody = await resp.text();
      let errorResp = new RequestError({ respBody });
      throw new Error(`Error getting connect response: ${errorResp}`);
    }

    let body;
    try {
      body = await resp.json();
    } catch (err) {
      throw new Error(
        `Error parsing connect response: ${(err as any).message}`,
      );
    }

    this.token = body;
    return body;
  }

  async refreshToken() {
    let { siteUrl, apiBasePath, token } = this;

    if (!token) return await this.connect();

    let url = new URL(`${siteUrl}${apiBasePath}/auth/access_token`);
    url.search = qs.stringify({
      refresh_token: token.refresh_token,
      grant_type: 'refresh',
    });

    let resp = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!resp.ok) {
      let respBody = await resp.text();
      let errorResp = new RequestError({ respBody });
      throw new Error(`Error getting refresh token response: ${errorResp}`);
    }

    let body;
    try {
      body = await resp.json();
    } catch (err) {
      throw new Error(
        `Error parsing refresh token response: ${(err as any).message}`,
      );
    }

    this.token = body;
    return body;
  }

  async getAuthorizationHeader() {
    let { token, tokenExpirationTimestamp } = this;

    if (!token) token = await this.connect();
    else if (Date.now() + REFRESH_EXPIRATION_WINDOW > tokenExpirationTimestamp!)
      token = await this.refreshToken();

    return `${token.token_type} ${token.access_token}`;
  }

  async requestRaw({
    method = 'GET',
    path,
    headers,
    query,
    body,
    requestId,
    skipBasePathPrepend,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'UPDATE';
    path?: string;
    headers?: any;
    query?: any;
    body?: any;
    requestId: any;
    skipBasePathPrepend?: boolean;
  }) {
    let { siteUrl, apiBasePath, debug } = this;

    if (!path) path = '/';

    if (!path.startsWith('/')) path = '/' + path;

    if (apiBasePath && !skipBasePathPrepend) path = `${apiBasePath}${path}`;

    if (!headers) headers = {};

    let inHeaders = headers;
    headers = Object.assign(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: await this.getAuthorizationHeader(),
      },
      inHeaders,
    );

    let url = new URL(path, siteUrl);
    if (query) url.search = qs.stringify(query);

    if (body) body = JSON.stringify(body);

    if (debug)
      console.log(
        'Sending request',
        requestId,
        url.href,
        util.inspect({ method, headers, body }, false, Infinity, true),
      );

    let resp = await this.fetchWithRetry(url, { method, headers, body });
    return resp;
  }

  async request(params: any) {
    let { debug } = this;
    let { method, path } = params;

    let requestId = Math.random().toString(36).substr(2);
    let resp = await this.requestRaw({ ...params, requestId });

    let respBody;
    try {
      respBody = await resp.json();
    } catch (err) {
      // Do nothing
    }

    if (debug)
      console.log(
        'Response received',
        requestId,
        util.inspect(respBody, false, Infinity, true),
      );

    if (!resp.ok) throw new RequestError({ method, path, respBody, resp });

    return respBody;
  }

  async fetchWithRetry(...args: [any, any]) {
    let { debug } = this;

    return retry(
      async (_, attemptNumber) => {
        if (debug) console.log(`Request attempt #${attemptNumber}`);
        let resp = await fetch(...args);
        if (
          attemptNumber <= RETRY_COUNT &&
          (resp.status >= 500 || resp.status === 0)
        ) {
          throw new Error('Force-trigger retry');
        }
        return resp;
      },
      {
        retries: RETRY_COUNT,
      },
    );
  }

  // Public Functions
  // All these functions are defined in ./src/client
  public entityBatch = entityBatch;
  public entityCreate = entityCreate;
  public entityDelete = entityDelete;
  public entityItemUpload = entityItemUpload;
  public entityRead = entityRead;
  public entityReadAll = entityReadAll;
  public entityRevive = entityRevive;
  public entitySearch = entitySearch;
  public entityUpdate = entityUpdate;
  public preferencesGet = preferencesGet;
  public schemaFieldCreate = schemaFieldCreate;
  public schemaFieldDelete = schemaFieldDelete;
  public schemaFieldRevive = schemaFieldRevive;
  public schemaFieldUpdate = schemaFieldUpdate;
  public schemaGet = schemaGet;
}
