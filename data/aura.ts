import type { Localized } from "@/lib/i18n/types";

export type Roast = "light" | "medium" | "dark";

export type AuraProduct = {
  id: string;
  name: string;
  region: string;
  roast: Roast;
  altitude: string;
  notes: Localized<string[]>;
  price: number; // MXN, 340 g bag
  bag: { body: string; label: string; ink: string };
};

export const auraProducts: AuraProduct[] = [
  {
    id: "mirador",
    name: "Finca El Mirador",
    region: "Veracruz",
    roast: "medium",
    altitude: "1,350 m",
    notes: { en: ["Milk chocolate", "Orange", "Panela"], es: ["Chocolate con leche", "Naranja", "Panela"] },
    price: 320,
    bag: { body: "#c9a27e", label: "#f6efe4", ink: "#2a1d15" },
  },
  {
    id: "altos",
    name: "Altos de Chiapas",
    region: "Chiapas",
    roast: "light",
    altitude: "1,600 m",
    notes: { en: ["Jasmine", "Peach", "Honey"], es: ["Jazmín", "Durazno", "Miel"] },
    price: 360,
    bag: { body: "#dcc7a5", label: "#2a1d15", ink: "#f6efe4" },
  },
  {
    id: "mazateca",
    name: "Sierra Mazateca",
    region: "Oaxaca",
    roast: "dark",
    altitude: "1,450 m",
    notes: { en: ["Cacao", "Toasted almond", "Molasses"], es: ["Cacao", "Almendra tostada", "Melaza"] },
    price: 300,
    bag: { body: "#3b2a20", label: "#b4572e", ink: "#f6efe4" },
  },
  {
    id: "coatepec",
    name: "Coatepec Reserva",
    region: "Veracruz",
    roast: "light",
    altitude: "1,250 m",
    notes: { en: ["Red apple", "Caramel", "Black tea"], es: ["Manzana roja", "Caramelo", "Té negro"] },
    price: 390,
    bag: { body: "#b4572e", label: "#f6efe4", ink: "#2a1d15" },
  },
  {
    id: "pluma",
    name: "Pluma Hidalgo",
    region: "Oaxaca",
    roast: "medium",
    altitude: "1,400 m",
    notes: { en: ["Brown sugar", "Hazelnut", "Citrus"], es: ["Azúcar morena", "Avellana", "Cítricos"] },
    price: 340,
    bag: { body: "#7d8b6a", label: "#f6efe4", ink: "#2a1d15" },
  },
  {
    id: "decaf",
    name: "Montaña Decaf",
    region: "Chiapas",
    roast: "dark",
    altitude: "1,500 m",
    notes: { en: ["Cocoa", "Walnut", "Dried fig"], es: ["Cocoa", "Nuez", "Higo seco"] },
    price: 310,
    bag: { body: "#e9dfd0", label: "#3b2a20", ink: "#f6efe4" },
  },
];

export const auraReviews: { quote: Localized; name: string; place: Localized }[] = [
  {
    quote: {
      en: "The first coffee I've bought that tastes like the description on the bag. Mirador is now my morning.",
      es: "El primer café que compro que sabe como lo describe la bolsa. Mirador ya es parte de mis mañanas.",
    },
    name: "Valeria M.",
    place: { en: "Monterrey · Member since 2024", es: "Monterrey · Miembro desde 2024" },
  },
  {
    quote: {
      en: "Arrives three days after roasting, every single time. You can smell the difference when you open it.",
      es: "Llega tres días después del tueste, siempre. Se nota la diferencia en cuanto abres la bolsa.",
    },
    name: "Daniel R.",
    place: { en: "Guadalajara · Member since 2025", es: "Guadalajara · Miembro desde 2025" },
  },
  {
    quote: {
      en: "I love knowing which farm my coffee comes from. The Altos de Chiapas is unreal as a pour-over.",
      es: "Me encanta saber de qué finca viene mi café. El Altos de Chiapas en método de goteo es increíble.",
    },
    name: "Sofía L.",
    place: { en: "Mexico City · Member since 2023", es: "Ciudad de México · Miembro desde 2023" },
  },
];

export const auraMarquee: Localized<string[]> = {
  en: ["Veracruz", "Chiapas", "Oaxaca", "Roasted every Tuesday", "Direct trade", "Free shipping over $600"],
  es: ["Veracruz", "Chiapas", "Oaxaca", "Tostado cada martes", "Comercio directo", "Envío gratis desde $600"],
};
