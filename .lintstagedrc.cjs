module.exports = {
  "*.ts": "eslint --fix",
  "*.(js|json|md)": "prettier --write",
  "src/lang/*.json": (fileNames) =>
    getAjvCommand(fileNames, "src/schemas/lang.json"),
  "src/compendiums/item/weapon/*.json": (fileNames) =>
    getAjvCommand(fileNames, "src/schemas/item/weapon.json")
};

/**
 * Get the ajv command for the provided file names and schema.
 * @param {string[]} fileNames - the file names
 * @param {string} schema - the schema file name
 */
function getAjvCommand(fileNames, schema) {
  const fileOptions = fileNames.map((fileName) => `-d ${fileName}`).join(" ");

  return `ajv validate --strict true --errors text -s ${schema} ${fileOptions}`;
}
