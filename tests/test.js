// tests/test.js
const { handler } = require('../index');

test('basic handler run', async () => {
    const result = await handler({});
    console.log(result);
    expect(result.statusCode).toBe(200); // 假設你預期成功
});
