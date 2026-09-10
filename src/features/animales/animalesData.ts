import { Animal } from '../../types/animal';

export const BASE_ANIMALS: Animal[] = [
  { practico: "0001", unico: "0001", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "15/10/2008", edad: "17,7 Años", lote: "01", descripcion: "Lote 01", composicion: "RN19TI14", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
  { practico: "0002", unico: "0002", categoria: "Vaca", estatus: "Activo", fechaNacimiento: "16/10/2009", edad: "16,7 Años", lote: "01", descripcion: "Lote 01", composicion: "JR28AB09BG03", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
  { practico: "EM01", unico: "EM01", categoria: "Embrión", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "BZ45CN13", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
  { practico: "SM01", unico: "SM01", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "AN38RM28", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
  { practico: "SM02", unico: "SM02", categoria: "Semen", estatus: "Activo", fechaNacimiento: "", edad: "", lote: "TERM1", descripcion: "Termo 1", composicion: "LL20NM19CU16SS14", racial: "", etiquetas: "", activos: "", padre: "", madre: "" },
  { practico: "BCA01", unico: "BCA01", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "18/1/2017", edad: "113,5 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "PS22GU02GY02CA01", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW012" },
  { practico: "BCA02", unico: "BCA02", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "18/1/2017", edad: "113,5 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "PM48BD03", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW012" },
  { practico: "BCA03", unico: "BCA03", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "15/9/2017", edad: "105,6 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "WR20CQ17BX09HR09", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW013" },
  { practico: "BCA04", unico: "BCA04", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "15/9/2017", edad: "105,6 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "SL12CR1INE09SI03", racial: "", etiquetas: "", activos: "", padre: "", madre: "CW013" },
  { practico: "BCA05", unico: "BCA05", categoria: "Becerra", estatus: "Activo", fechaNacimiento: "13/2/2016", edad: "124,7 Meses", lote: "POT1", descripcion: "Potrero 1", composicion: "TU26", racial: "", etiquetas: "", activos: "", padre: "", madre: "" }
];

export const generateAnimals = (count = 49): Animal[] => {
  const generated: Animal[] = [];
  const padZero = (num: number) => (num < 10 ? `000${num}` : num < 100 ? `00${num}` : `0${num}`);

  for (let i = 1; i <= count; i++) {
    if (i <= 10) {
      generated.push({ ...BASE_ANIMALS[i - 1] });
    } else {
      const base = BASE_ANIMALS[(i - 1) % 10];
      const indexStr = i < 10 ? `0${i}` : `${i}`;
      let practico = "";
      let unico = "";

      if (base.categoria === "Vaca") {
        practico = padZero(i);
        unico = padZero(i);
      } else if (base.categoria === "Embrión") {
        practico = `EM${indexStr}`;
        unico = `EM${indexStr}`;
      } else if (base.categoria === "Semen") {
        practico = `SM${indexStr}`;
        unico = `SM${indexStr}`;
      } else {
        practico = `BCA${indexStr}`;
        unico = `BCA${indexStr}`;
      }

      generated.push({
        ...base,
        practico,
        unico,
        composicion: `${base.composicion}_${i}`
      });
    }
  }

  return generated;
};
