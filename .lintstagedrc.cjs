module.exports = {
  "*.ts": "eslint --fix",
  "*.(js|json|md)": "prettier --write",
  "src/main/lang/*.json": (fileNames) =>
    getAjvCommand(fileNames, "src/main/schemas/lang.json"),
  "src/main/compendiums/item/weapon/*.json": (fileNames) =>
    getAjvCommand(fileNames, "src/main/schemas/item/weapon.json")
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
