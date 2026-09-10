export interface Animal {
  practico: string;
  unico: string;
  categoria: string;
  estatus: string;
  fechaNacimiento: string;
  edad: string;
  lote: string;
  descripcion: string;
  composicion: string;
  racial: string;
  etiquetas: string;
  activos: string;
  padre: string;
  madre: string;
}

export interface AnimalFilterOptions {
  searchQuery?: string;
  categoria?: string;
  lote?: string;
}
