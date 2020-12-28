import * as common from './common'

export type PlayerCharacterData =
  SpecialTemplate & VitalsTemplate & LevelingTemplate & BackgroundTemplate

export type NonPlayerCharacterData =
  SpecialTemplate & VitalsTemplate

/**
* This is the "special" template for {@link Actor}s from the `template.json`
* file.
*/
export class SpecialTemplate implements common.Special {
  strenght = 0
  perception = 0
  endurance = 0
  charisma = 0
  intelligence = 0
  luck = 0

  constructor(special: Partial<common.Special>) {
    Object.assign(this, special)
  }
}

/**
* This is the "vitals" template for {@link Actor}s from the `template.json`
* file.
*/
export class VitalsTemplate {
  constructor(
    public hitPoints = 10,
    public actionPoints = 10,
    public insanity = 0
  ) {}
}

/**
* This is the "leveling" template for {@link Actor}s from the `template.json`
* file.
*/
export class LevelingTemplate {
  constructor(
    public experience = 0,
    public levelIntelligences: Array<number> = []
  ) {}
}

/**
* This is the "background" template for {@link Actor}s from the `template.json`
* file.
*/
export class BackgroundTemplate {
  constructor(
    public name = '',
    public background = '',
    public history = '',
    public fears = '',
    public dreams = '',
    public karma = 0
  ) {}
}
