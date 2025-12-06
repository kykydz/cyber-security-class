// load-test.js
const autocannon = require('autocannon');

(async function run() {
  const result = await autocannon({
    url: 'http://localhost:80/',
    connections: 100, // concurrent users
    duration: 10, // seconds
    method: 'GET',
  });

  autocannon.printResult(result);
})();
