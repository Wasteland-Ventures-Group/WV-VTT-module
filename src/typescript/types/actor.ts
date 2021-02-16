import * as common from './common';

/**
 * This is an intersection of template types for player character Actors.
 */
export type PlayerCharacterData = Actor.Data<
  SpecialTemplate & VitalsTemplate & LevelingTemplate & BackgroundTemplate
>;

/**
 * This is an intersection of template types for non player character Actors.
 */
export type NonPlayerCharacterData = SpecialTemplate & VitalsTemplate;

/**
 * This is the "special" template for {@link Actor}s from the `template.json`
 * file.
 */
export class SpecialTemplate implements common.Special {
  strenght = 0;
  perception = 0;
  endurance = 0;
  charisma = 0;
  intelligence = 0;
  luck = 0;

  constructor(special: Partial<common.Special>) {
    Object.assign(this, special);
  }
}

/**
 * This is the "vitals" template for {@link Actor}s from the `template.json`
 * file.
 */
export class VitalsTemplate {
  constructor(
    /**
     * The current amount of hit points of an Actor
     */
    public hitPoints = 10,

    /**
     * The current amount of action points of an Actor
     */
    public actionPoints = 10,

    /**
     * The current insanity of an Actor
     */
    public insanity = 0
  ) {}
}

/**
 * This is the "leveling" template for {@link Actor}s from the `template.json`
 * file.
 */
export class LevelingTemplate {
  constructor(
    /**
     * The current experience of an Actor
     */
    public experience = 0,

    /**
     * The skill point relevant intelligence values at each level up of an Actor
     */
    public levelIntelligences: number[] = []
  ) {}
}

/**
 * This is the "background" template for {@link Actor}s from the `template.json`
 * file.
 */
export class BackgroundTemplate {
  constructor(
    /**
     * The name of an Actor
     */
    public name = '',

    /**
     * The background of an Actor
     */
    public background = '',

    /**
     * The history of an Actor
     */
    public history = '',

    /**
     * The fears of an Actor
     */
    public fears = '',

    /**
     * The dreams of an Actor
     */
    public dreams = '',

    /**
     * The current karma of an Actor
     */
    public karma = 0
  ) {}
}
