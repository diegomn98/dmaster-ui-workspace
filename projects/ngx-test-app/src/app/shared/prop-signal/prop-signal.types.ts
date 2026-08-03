/** Opción de un control tipo select. */
export interface PropControlOption {
  label: string;
  value: string;
}

/** Descripción de un control interactivo del playground. */
export interface PropControl {
  /** Clave del input del componente que controla. */
  key: string;
  /** Etiqueta visible. */
  label: string;
  /** Tipo de control renderizado. */
  type: 'select' | 'number' | 'text' | 'boolean';
  /** Opciones, solo para `select`. */
  options?: PropControlOption[];
  /** Límites, solo para `number`. */
  min?: number;
  max?: number;
  step?: number;
  /** Placeholder, solo para `text`. */
  placeholder?: string;
}

/** Estado actual del playground: clave de input → valor. */
export type PropValues = Record<string, string | number | boolean>;
