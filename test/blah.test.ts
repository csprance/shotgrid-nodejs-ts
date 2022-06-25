import { ShotgunApiClient } from '../src';

describe('blah', () => {
  it('works', async () => {
    let shotgun = new ShotgunApiClient({
      siteUrl: 'https://mysite.shotgunstudio.com',
      credentials: {
        grant_type: 'password',
        username: 'username',
        password: 'password',
      },
    });
    await shotgun.entityRead({
      entity: 'HumanUsers',
      entityId: 3,
    });
  });
});
