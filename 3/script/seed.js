const { importDataToNeo4j } = require('../mockData.js');

(async () => {
  try {
    await importDataToNeo4j()
  } catch(error) {
    console.log(error)
  }
})()
