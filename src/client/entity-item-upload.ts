import { fromFile } from 'file-type';

import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  entityId: number;
  fieldName?: string;
  targetFileName: string;
  uploadFileBlob: any;
  additionalUploadData: string[];
}

/**
 * Upload an entity item
 *
 * @param  {string}   entity                 - Entity type.
 * @param  {number}   entityId               - Target entity ID.
 * @param  {string}   [fieldName]            - Target entity field name (optional).
 * @param  {Object}   targetFileName         - Name of file to refer as once uploaded.
 * @param  {Object}   uploadFileBlob         - File data.
 * @param  {string[]} [additionalUploadData] - File metadata.
 * @return {Object} Request information.
 */
export async function entityItemUpload(
  this: ShotgunApiClient,
  {
    entity,
    entityId,
    fieldName,
    targetFileName,
    uploadFileBlob,
    additionalUploadData = [],
  }: Options,
) {
  let path = `/entity/${entity}/${entityId}`;
  if (fieldName) path += `/${fieldName}`;
  path += '/_upload';

  // Get upload link
  let uploadMetadata = await this.request({
    method: 'GET',
    path,
    query: { filename: targetFileName },
  });

  // Sanity: NodeJS Buffer to Blob
  if (uploadFileBlob instanceof Buffer) {
    (uploadFileBlob as any).type = (await fromFile(
      uploadFileBlob as any,
    ))!.mime;
    (uploadFileBlob as any).size = uploadFileBlob.length;
  }

  // If upload link is not AWS, then API makes guess on the host.
  // Wrong in test and private environments. Apply correction if needed.
  let uploadUrl = new URL(uploadMetadata.links.upload);
  let siteUrl = new URL(this.siteUrl);
  if (uploadUrl.hostname === siteUrl.hostname) {
    uploadUrl.protocol = siteUrl.protocol;
    uploadUrl.port = siteUrl.port;
  }

  if (this.debug) {
    console.log(
      'PUT file',
      uploadUrl.href,
      uploadFileBlob.type,
      uploadFileBlob.size,
    );
  }

  // Upload file
  let uploadResp = await fetch(uploadUrl.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': uploadFileBlob.type,
      'Content-Size': uploadFileBlob.size,
    },
    body: uploadFileBlob,
  });

  if (!uploadResp.ok) {
    let reason = await uploadResp.text();
    throw new Error(`Error uploading file: ${reason}`);
  }

  // Complete loop by persisting metadata
  await this.request({
    method: 'POST',
    path: uploadMetadata.links.complete_upload,
    // links.complete_upload already includes base path
    skipBasePathPrepend: true,
    body: {
      upload_info: uploadMetadata.data,
      upload_data: additionalUploadData,
    },
  });
}
