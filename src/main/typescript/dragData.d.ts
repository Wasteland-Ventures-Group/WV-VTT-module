/** An interface for the common properties of system drag data */
export default interface DragData extends Record<string, unknown> {
  /** The type of the drag data */
  type: string;
}
