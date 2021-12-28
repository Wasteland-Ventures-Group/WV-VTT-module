/** This represents an object that can be serialized to the `template.json`. */
export interface TemplateDocumentType {
  /**
   * Get the name of the Document, which should be used in the `template.json`.
   */
  getTypeName(): string;
}
