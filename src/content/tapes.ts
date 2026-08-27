export type TapeId =
  | "gareth"
  | "iris"
  | "products"
  | "contact"
  | "pong";

export interface Tape {
  readonly id: TapeId;
  readonly label: string;
  readonly number: string;
  readonly tagline: string;
  readonly colour: string;
  readonly ink: string;
  readonly fictional?: true;
}

export const tapes = [
  { id: "gareth", label: "GARETH.AI", number: "01", tagline: "ASK HIM ANYTHING", colour: "#b9d7ba", ink: "#173828" },
  { id: "iris", label: "IRIS", number: "02", tagline: "THE CLINICAL AI HE BUILT", colour: "#efc46a", ink: "#49340c" },
  { id: "products", label: "PRODUCTS", number: "03", tagline: "WHAT HE HAS SHIPPED", colour: "#d78f75", ink: "#4d1c13" },
  { id: "contact", label: "CONTACT", number: "04", tagline: "GET IN TOUCH", colour: "#d7cedf", ink: "#392641" },
  { id: "pong", label: "PONG", number: "64", tagline: "A PLAYABLE C64 GAME", colour: "#ce93af", ink: "#42152b", fictional: true },
] as const satisfies readonly Tape[];

export const tapesById = new Map(tapes.map((tape) => [tape.id, tape] as const));
