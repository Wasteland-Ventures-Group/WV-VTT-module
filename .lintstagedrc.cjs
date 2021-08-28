module.exports = {
  "*.ts": "eslint --fix",
  "*.(js|json)": "prettier --write",
  "src/schemas/lang.json": "ajv compile --strict true -s",
  "src/lang/*.json": "ajv validate --strict true --errors text -s src/schemas/lang.json -d",
  "src/compendiums/item/weapon/*.json": "ajv validate --strict true --errors text -s src/schemas/item/weapon.json -d"
};
