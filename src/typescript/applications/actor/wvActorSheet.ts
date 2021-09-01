import RollModifierDialog from "../rollModifierDialog.js";
import {
  CONSTANTS,
  SkillNames,
  SpecialNames,
  ThaumaturgySpecials,
  TYPES
} from "../../constants.js";
import { getGame } from "../../foundryHelpers.js";
import { isSkillName, isSpecialName } from "../../helpers.js";
import { boundsSettingNames } from "../../settings.js";
import WvI18n, { I18nSpecial } from "../../wvI18n.js";
import { LOG } from "../../systemLogger.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet<
  ActorSheet.Options,
  SheetData
> {
  static override get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "actor-sheet"],
      height: 1000,
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`,
      width: 700
    } as typeof ActorSheet["defaultOptions"]);
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("change submit", (event) => event.target.reportValidity());

    // stat rolls
    html
      .find("button[data-special]")
      .on("click", this.onClickRollSpecial.bind(this));
    html
      .find("button[data-skill]")
      .on("click", this.onClickRollSkill.bind(this));

    // item handling
    html
      .find(".effect-control[data-action=create]")
      .on("click", this.onClickCreateItem.bind(this));
    html
      .find(".effect-control[data-action=edit]")
      .on("click", this.onClickEditItem.bind(this));
    html
      .find(".effect-control[data-action=delete]")
      .on("click", this.onClickDeleteItem.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    const actorProps = data.actor.data.data;
    data.sheet = {};

    data.sheet.bounds = CONSTANTS.bounds;
    const skillMin = getGame().settings.get(
      CONSTANTS.systemId,
      boundsSettingNames.skills.points.min
    );
    if (typeof skillMin === "number") {
      data.sheet.bounds.skills.points.min = skillMin;
    }
    const specialMin = getGame().settings.get(
      CONSTANTS.systemId,
      boundsSettingNames.special.points.min
    );
    if (typeof specialMin === "number") {
      data.sheet.bounds.special.points.min = specialMin;
    }

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

    data.sheet.effects = [];
    for (const item of this.actor.items) {
      if (!item.id) continue;

      if (TYPES.ITEM.EFFECT === item.data.type) {
        data.sheet.effects.push({
          id: item.id,
          name: item.name
        });
      }
    }

    return data;
  }

  /**
   * Handle a click event on the SPECIAL roll buttons.
   */
  protected onClickRollSpecial(event: ClickEvent): void {
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
          {
            description: WvI18n.getSpecialModifierDescription(special),
            min: -100,
            max: 100
          }
        ).render(true);
      } else {
        this.actor.rollSpecial(special, { whisperToGms: event.ctrlKey });
      }
    } else {
      LOG.warn(`Could not get the SPECIAL name for a roll.`);
    }
  }

  /**
   * Handle a click event on the Skill roll buttons.
   */
  protected onClickRollSkill(event: ClickEvent): void {
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
          {
            description: WvI18n.getSkillModifierDescription(skill),
            min: -100,
            max: 100
          }
        ).render(true);
      } else {
        this.actor.rollSkill(skill, { whisperToGms: event.ctrlKey });
      }
    } else {
      LOG.warn("Could not get the Skill name for a Skill roll.");
    }
  }

  /**
   * Handle a click event on a create item button.
   */
  protected onClickCreateItem(event: ClickEvent): void {
    if (event.target.dataset.type !== TYPES.ITEM.EFFECT) return;

    const data: ConstructorParameters<typeof Item>[0] = {
      name: getGame().i18n.format("wv.fvttItems.newName", {
        what: getGame().i18n.localize("wv.fvttItems.types.effects.name")
      }),
      type: event.target.dataset.type
    };
    Item.create(data, { parent: this.actor });
  }

  /**
   * Handle a click event on an edit item button.
   */
  protected onClickEditItem(event: ClickEvent): void {
    const id = $(event.target).parents(".fvtt-item").data("id");
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item && item.sheet) {
      item.sheet.render(true);
    }
  }

  /**
   * Handle a click event on a delete item button.
   */
  protected onClickDeleteItem(event: ClickEvent): void {
    const id = $(event.target).parents(".fvtt-item").data("id");
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item) {
      item.delete();
      this.render(false);
    }
  }
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

interface SheetEffect {
  id: string;
  name: string | null;
}

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
  total?: number | undefined;
}

interface SheetData extends ActorSheet.Data {
  sheet?: {
    bounds?: typeof CONSTANTS["bounds"];
    effects?: SheetEffect[];
    magic?: SheetMagic;
    skills?: Partial<Record<SkillNames, SheetSkill>>;
    specials?: Partial<Record<SpecialNames, SheetSpecial>>;
  };
}
