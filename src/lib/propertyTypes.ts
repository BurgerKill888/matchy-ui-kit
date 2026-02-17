// Centralized property type color system
export const typeColors: Record<string, string> = {
  Maison: "#8B2252",
  Immeuble: "#2E6B5A",
  Appartement: "#2C4A6E",
  "Terrain à potentiel": "#8B6914",
  "Local commercial": "#6B3A6E",
  Bureaux: "#4A6B8A",
  "Entrepôt / activité": "#5A6B7A",
  "Ensemble immobilier mixte": "#9B7340",
  // Legacy aliases
  Bureau: "#4A6B8A",
  Commerce: "#6B3A6E",
  Terrain: "#8B6914",
  Entrepôt: "#5A6B7A",
  Logistique: "#5A6B7A",
};

export function getTypeColor(type: string): string {
  return typeColors[type] || "#5A6B7A";
}
