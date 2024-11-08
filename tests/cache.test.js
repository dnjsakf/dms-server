import { client } from "../src/config/redisConfig";

describe('Redis', () => {
  beforeAll(async () => {
    await client.connect();
    console.log('Redis Connected');
  });
  
  test('Redis session clear', async () => {
    const pattern = `SESSION:TOKEN:*`;
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`All data under ${pattern} and its subkeys have been deleted.`);
    } else {
      console.log(`No keys found under ${pattern}.`);
    }
  });
});