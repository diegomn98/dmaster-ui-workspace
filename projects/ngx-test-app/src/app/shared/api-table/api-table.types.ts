/** Fila de la tabla de API de un componente. */
export interface ApiTableRow {
  /** Nombre del input/output. */
  name: string;
  /** Tipo TypeScript, mostrado como código. */
  type: string;
  /** Valor por defecto (vacío para outputs). */
  default?: string;
  /** Descripción breve. */
  description: string;
}
