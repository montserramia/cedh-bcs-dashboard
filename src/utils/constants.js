export const BASE_URL = import.meta.env.VITE_API_BASE || "";

export const SERIES = [
  { key: "quejas",          name: "Queixes",          color: "#5B8FF9" },
  { key: "canalizaciones",  name: "Canalitzacions",  color: "#61DDAA" },
  { key: "orientaciones",   name: "Orientacions",   color: "#F6BD16" },
  { key: "acompanamientos", name: "Acompanyaments", color: "#9661BC" },
];

// Traduïm les etiquetes al català
export const DIM_OPTIONS = [
  { key: "sexo", label: "Sexe" },
  { key: "grupo_prioritario", label: "Grup prioritari" },
  { key: "municipio", label: "Municipi" },
  { key: "autoridad", label: "Autoritat" },
  { key: "derechos", label: "Drets" },
];