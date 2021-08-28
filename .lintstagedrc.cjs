module.exports = {
  "*.ts": "eslint --fix",
  "*.(js|json)": "prettier --write",
  "src/schemas/lang.json": "ajv compile --strict true -s",
  "src/lang/*.json": (fileNames) =>
    getAjvCommands(fileNames, "src/schemas/lang.json"),
  "src/compendiums/item/weapon/*.json": (fileNames) =>
    getAjvCommands(fileNames, "src/schemas/item/weapon.json")
};

/**
 * Get the ajv commends for the provided file names and schema.
 * @param {string[]} fileNames - the file names
 * @param {string} schema - the schema file name
 */
function getAjvCommands(fileNames, schema) {
  return fileNames.map(
    (fileName) =>
      `ajv validate --strict true --errors text -s ${schema} -d ${fileName}`
  );
}
