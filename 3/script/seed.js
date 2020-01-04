const { importDataToNeo4j } = require('../mockData.js');
const getNeo4jDriver = require("../neo4j.js");

(async () => {
  const driver = getNeo4jDriver()
  try {
    await importDataToNeo4j(driver)
    driver.close()
  } catch(error) {
    console.log(error)
  }
})()
