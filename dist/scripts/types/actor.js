/**
* This is the "special" template for {@link Actor}s from the `template.json`
* file.
*/
export class SpecialTemplate {
    constructor(special) {
        this.strenght = 0;
        this.perception = 0;
        this.endurance = 0;
        this.charisma = 0;
        this.intelligence = 0;
        this.luck = 0;
        Object.assign(this, special);
    }
}
/**
* This is the "vitals" template for {@link Actor}s from the `template.json`
* file.
*/
export class VitalsTemplate {
    constructor(hitPoints = 10, actionPoints = 10, insanity = 0) {
        this.hitPoints = hitPoints;
        this.actionPoints = actionPoints;
        this.insanity = insanity;
    }
}
/**
* This is the "leveling" template for {@link Actor}s from the `template.json`
* file.
*/
export class LevelingTemplate {
    constructor(experience = 0, levelIntelligences = []) {
        this.experience = experience;
        this.levelIntelligences = levelIntelligences;
    }
}
/**
* This is the "background" template for {@link Actor}s from the `template.json`
* file.
*/
export class BackgroundTemplate {
    constructor(name = '', background = '', history = '', fears = '', dreams = '', karma = 0) {
        this.name = name;
        this.background = background;
        this.history = history;
        this.fears = fears;
        this.dreams = dreams;
        this.karma = karma;
    }
}
