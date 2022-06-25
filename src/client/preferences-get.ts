import ShotgunApiClient from '../client';

interface Options {
  names: string | string[];
}

/**
 * Fetch preferences.
 *
 * @param  {string} names - List of preference names.
 * @return {Object} Hash table of preferences.
 */
export async function preferencesGet(
  this: ShotgunApiClient,
  { names }: Options,
) {
  if (!Array.isArray(names)) names = [names];
  names = names.filter(Boolean).join(',');

  let query = {
    prefs: names,
  };

  let respBody = await this.request({
    method: 'GET',
    path: '/preferences',
    query,
  });
  return respBody.data;
}
