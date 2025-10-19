import type WvActor from "../../../actor/wvActor.js";
import {
  CONSTANTS,
  isSpecialName,
  type SpecialName,
  SpecialNames,
  type ThaumaturgySpecial,
  ThaumaturgySpecials
} from "../../../constants.js";
import { getI18n } from "../../../foundryHelpers.js";
import type Race from "../../../item/race.js";
import WvI18n, { type I18nSpecial } from "../../../wvI18n.js";
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import type { DeepPartial } from "fvtt-types/utils";
import type { CharacterProperties } from "../../../data/actor/character/properties.js";

export default class BaseSetup extends ApplicationV2<TemplateContext> {
  static override DEFAULT_OPTIONS: ApplicationV2.DefaultOptions<BaseSetup> = {
    classes: [CONSTANTS.systemId],
    tag: "form",
    form: {
      handler: BaseSetup.#onSubmit,
      submitOnChange: true,
      closeOnSubmit: true,
    },
    window: {
      title: getI18n().localize("wv.system.initialCharacterSetup.openButton"),
    }
  };

  static PARTS = {
    baseSetup: {
      template: `${CONSTANTS.systemPath}/handlebars/actors/character/baseSetup.hbs`
    }
  };

  static character: WvActor | null;
  static async #onSubmit(_event: SubmitEvent | Event, form: HTMLFormElement, expandedFormData: FormDataExtended): Promise<void> {
    if (!form.reportValidity()) return;
    if (!this.character) return;
    const specialPoints: Partial<Record<SpecialName, number>> = {};

    const formData = foundry.utils.expandObject(expandedFormData.object) as AppFormData;

    for (const specialName of SpecialNames) {
      const points = parseInt(formData.special[specialName] ?? "");
      if (isNaN(points)) continue;

      specialPoints[specialName] = points;
    }

    const updateData: Record<string, unknown> = {
      data: { leveling: { specialPoints } }
    };
    const thaumSpecial = formData["thaumSpecial"] as string ?? "";
    if (isSpecialName(thaumSpecial))
      updateData["data.magic.thaumSpecial"] = thaumSpecial;

    await this.character.update(updateData);
  }

  constructor(
    public character: WvActor,
    options: DeepPartial<ApplicationV2.Configuration> = {}
  ) {
    if (!options.window) {
      options.window = {}
    }

    if (!options.window.title) {
      options.window.title = getI18n().format(
        "wv.system.initialCharacterSetup.title",
        { name: character.name }
      )

    }

    if (!options.id) options.id = `actor-${character.id}-base-setup`;
    super(options);

    BaseSetup.character = character;
  }

  #specialPointsInputs: HTMLInputElement[] = [];

  #specialPointsTotalElement: HTMLElement | null = null;

  protected override _prepareContext(options: DeepPartial<ApplicationV2.RenderOptions> & { isFirstRender: boolean }): Promise<TemplateContext> {
    super._prepareContext(options);
    const i18nSpecials = WvI18n.specials;
    BaseSetup.character = this.character;

    const context = {
      data: BaseSetup.character.system,
      sheet: {
        bounds: CONSTANTS.bounds,
        race: this.character.race,
        specials: SpecialNames.reduce(
          (specials, specialName) => {
            const points = this.character.system.specials[specialName].points;
            specials[specialName] = {
              points,
              long: i18nSpecials[specialName].long,
              short: i18nSpecials[specialName].short
            };
            return specials;
          },
          {} as Record<SpecialName, TemplateSpecial>
        ),
        thaumSpecials: ThaumaturgySpecials.reduce(
          (thaumSpecials, thaumSpecialName) => {
            thaumSpecials[thaumSpecialName] =
              i18nSpecials[thaumSpecialName].long;
            return thaumSpecials;
          },
          {} as Record<ThaumaturgySpecial, string>
        )
      }
    };
    return Promise.resolve(context)
  }

  override _onRender(context: DeepPartial<TemplateContext>, options: DeepPartial<ApplicationV2.RenderOptions>): Promise<void> {
    super._onRender(context, options);

    this.getHtmlElements();

    this.#specialPointsInputs.forEach((element) =>
      element.addEventListener("change", this.onChangeSpecialPoints.bind(this))
    );
    this.onChangeSpecialPoints();
    return Promise.resolve()
  }

  private getHtmlElements() {
    this.#specialPointsInputs = [];
    this.element.querySelectorAll("[data-special-points]").forEach((input) => {
      if (input instanceof HTMLInputElement)
        this.#specialPointsInputs.push(input);
    });

    this.#specialPointsTotalElement = null;
    const totalPoints = this.element.querySelector("[data-special-points-total]");
    if (totalPoints instanceof HTMLElement)
      this.#specialPointsTotalElement = totalPoints;
  }

  private onChangeSpecialPoints() {
    if (!this.#specialPointsTotalElement) return;

    this.#specialPointsInputs.forEach((input) => input.setCustomValidity(""));

    const total = this.getTotalSpecialPoints();

    this.setSpecialPointsTotal(total);

    if (total > this.character.race.creationSpecialPoints) {
      this.#specialPointsInputs.forEach((input) =>
        input.setCustomValidity(
          getI18n().localize(
            "wv.system.initialCharacterSetup.messages.tooManySpecialPointsSpent"
          )
        )
      );
    } else if (total < this.character.race.creationSpecialPoints) {
      this.#specialPointsInputs.forEach((input) =>
        input.setCustomValidity(
          getI18n().localize(
            "wv.system.initialCharacterSetup.messages.tooFewSpecialPointsSpent"
          )
        )
      );
    }
  }

  private getTotalSpecialPoints() {
    return this.#specialPointsInputs.reduce(
      (total, input) => total + input.valueAsNumber,
      0
    );
  }

  private setSpecialPointsTotal(value: number) {
    if (!this.#specialPointsTotalElement) return;

    this.#specialPointsTotalElement.textContent = value.toString();
  }
}

type AppFormData = {
  special: Partial<Record<SpecialName, string>>,
  thaumSpecial?: string
};

interface TemplateContext {
  data: CharacterProperties;
  sheet: {
    bounds: (typeof CONSTANTS)["bounds"];
    race: Race;
    specials: Record<SpecialName, TemplateSpecial>;
    thaumSpecials: Record<ThaumaturgySpecial, string>;
  };
}

interface TemplateSpecial extends I18nSpecial {
  points: number;
}
