import type { MagicSource } from "./source";

export type MagicProperties = MagicSource;
export const MagicProperties = {
  from(source: MagicSource): MagicProperties {
    return {
      ...source
    };
  }
};
