import { ShotgunApiClient } from './index';

interface PaginatedRecordResponseOptions {
  data: any;
  links: any;
  _pageSize: any;
}

export class PaginatedRecordResponse {
  public data: any;
  public links: any;
  public pageSize: any;

  constructor({ data, links, _pageSize }: PaginatedRecordResponseOptions) {
    this.data = data;
    this.links = links || {};
    this.pageSize = _pageSize;
  }

  reachedEnd() {
    return this.data.length !== this.pageSize;
  }

  async getNext({ client }: { client: ShotgunApiClient }) {
    let path = this.links.next;
    return this._get({ path, client });
  }

  async getPrev({ client }: { client: ShotgunApiClient }) {
    let path = this.links.prev;
    return this._get({ path, client });
  }

  async _get({ path, client }: { path: string; client: ShotgunApiClient }) {
    if (!path) return;

    // @ts-ignore
    let out = new this.constructor(
      await client.request({
        path,
        skipBasePathPrepend: true,
      }),
    );

    // Inherit page size
    out.pageSize = this.pageSize;

    if (!out.data.length) return;

    return out;
  }
}

export default PaginatedRecordResponse;
