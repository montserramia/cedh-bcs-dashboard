export const BASE_URL = import.meta.env.VITE_API_BASE || "";

export const SERIES = [
  { key: "quejas",          name: "Quejas",          color: "#5B8FF9" },
  { key: "canalizaciones",  name: "Canalizaciones",  color: "#61DDAA" },
  { key: "orientaciones",   name: "Orientaciones",   color: "#F6BD16" },
  { key: "acompanamientos", name: "Acompañamientos", color: "#9661BC" },
];

// Traduïm les etiquetes al català
export const DIM_OPTIONS = [
  { key: "sexo", label: "Sexo" },
  { key: "grupo_prioritario", label: "Grupo prioritario" },
  { key: "municipio", label: "Municipio" },
  { key: "autoridad", label: "Autoridad" },
  { key: "derechos", label: "Derechos" },
];