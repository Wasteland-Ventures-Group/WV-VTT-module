import RollModifierDialog from "../applications/rollModifierDialog.js";
import {
  CONSTANTS,
  SkillNames,
  SpecialNames,
  ThaumaturgySpecials
} from "../constants.js";
import { isSkillName, isSpecialName } from "../helpers.js";
import WvI18n, { I18nSpecial } from "../wvI18n.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet<
  ActorSheet.Options,
  SheetData
> {
  static override get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "entity-sheet", "actor-sheet"],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    html
      .find("button[data-special]")
      .on("click", this.onClickRollSpecial.bind(this));
    html
      .find("button[data-skill]")
      .on("click", this.onClickRollSkill.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    const actorProps = data.actor.data.data;
    data.sheet = {};

    const specialI18ns = WvI18n.specials;
    data.sheet.specials = {};
    for (const special of SpecialNames) {
      data.sheet.specials[special] = {
        long: specialI18ns[special].long,
        short: specialI18ns[special].short,
        value: actorProps.specials[special]
      };
    }

    const skillI18ns = WvI18n.skills;
    data.sheet.skills = {};
    for (const skill of SkillNames) {
      const special: SpecialNames =
        skill === "thaumaturgy"
          ? actorProps.magic.thaumSpecial
          : CONSTANTS.skillSpecials[skill];
      data.sheet.skills[skill] = {
        name: skillI18ns[skill],
        ranks: actorProps.leveling.skillRanks[skill],
        special: specialI18ns[special].short,
        total: actorProps.skills[skill]?.total
      };
    }

    data.sheet.magic = {};
    data.sheet.magic.thaumSpecials = {};
    for (const thaumSpecial of ThaumaturgySpecials) {
      data.sheet.magic.thaumSpecials[thaumSpecial] = {
        name: specialI18ns[thaumSpecial].long,
        selected: thaumSpecial === actorProps.magic.thaumSpecial
      };
    }

    return data;
  }

  /**
   * Handle a click event on the SPECIAL roll buttons.
   */
  protected onClickRollSpecial(event: RollEvent): void {
    event.preventDefault();

    const special = event.target.dataset.special;
    if (special && isSpecialName(special)) {
      if (event.shiftKey) {
        new RollModifierDialog(
          (modifier) => {
            this.actor.rollSpecial(special, {
              modifier: modifier,
              whisperToGms: event.ctrlKey
            });
          },
          { description: WvI18n.getSpecialModifierDescription(special) }
        ).render(true);
      } else {
        this.actor.rollSpecial(special, { whisperToGms: event.ctrlKey });
      }
    } else {
      console.warn("Could not get the SPECIAL name for a roll.");
    }
  }

  /**
   * Handle a click event on the Skill roll buttons.
   */
  protected onClickRollSkill(event: RollEvent): void {
    event.preventDefault();

    const skill = event.target.dataset.skill;
    if (skill && isSkillName(skill)) {
      if (event.shiftKey) {
        new RollModifierDialog(
          (modifier) => {
            this.actor.rollSkill(skill, {
              modifier: modifier,
              whisperToGms: event.ctrlKey
            });
          },
          { description: WvI18n.getSkillModifierDescription(skill) }
        ).render(true);
      } else {
        this.actor.rollSkill(skill, { whisperToGms: event.ctrlKey });
      }
    } else {
      console.warn("Could not get the Skill name for a Skill roll.");
    }
  }
}

type RollEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

interface SheetThaumSpecial {
  name?: string;
  selected?: boolean;
}

type SheetThaumSpecials = Partial<
  Record<ThaumaturgySpecials, SheetThaumSpecial>
>;

interface SheetMagic {
  thaumSpecials?: SheetThaumSpecials;
}

interface SheetSpecial extends I18nSpecial {
  value?: number;
}

interface SheetSkill {
  name?: string;
  ranks?: number;
  special?: string;
  total?: number;
}

interface SheetData extends ActorSheet.Data {
  sheet?: {
    magic?: SheetMagic;
    skills?: Partial<Record<SkillNames, SheetSkill>>;
    specials?: Partial<Record<SpecialNames, SheetSpecial>>;
  };
}
