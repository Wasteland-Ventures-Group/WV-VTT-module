import type WvActor from "../../../actor/wvActor.js";
import { CONSTANTS, SpecialName, SpecialNames } from "../../../constants.js";
import type CharacterDataProperties from "../../../data/actor/character/properties.js";
import { getGame } from "../../../foundryHelpers.js";
import WvI18n, { I18nSpecial } from "../../../wvI18n.js";

export default class BaseSetup extends FormApplication<
  FormApplicationOptions,
  TemplateData,
  WvActor
> {
  static override get defaultOptions(): FormApplicationOptions {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push(CONSTANTS.systemId);
    defaultOptions.title = getGame().i18n.localize(
      "wv.system.initialCharacterSetup.openButton"
    );
    defaultOptions.template = `${CONSTANTS.systemPath}/handlebars/actors/character/baseSetup.hbs`;
    return defaultOptions;
  }

  constructor(
    public character: WvActor,
    options: Partial<FormApplicationOptions> = {}
  ) {
    if (!options?.title)
      options.title = getGame().i18n.format(
        "wv.system.initialCharacterSetup.title",
        { name: character.name }
      );

    if (!options.id) options.id = `actor-${character.id}-base-setup`;

    super(character, options);
  }

  #specialPointsInputs: HTMLInputElement[] = [];

  #specialPointsTotalElement: HTMLElement | null = null;

  override getData(): TemplateData {
    const i18nSpecials = WvI18n.specials;

    return {
      data: this.character.data,
      sheet: {
        bounds: CONSTANTS.bounds,
        specials: SpecialNames.reduce((specials, specialName) => {
          const points = this.character.data.data.specials[specialName].points;
          specials[specialName] = {
            points,
            long: i18nSpecials[specialName].long,
            short: i18nSpecials[specialName].short
          };
          return specials;
        }, {} as Record<SpecialName, TemplateSpecial>)
      }
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element.");

    this.getHtmlElements(sheetForm);

    sheetForm.addEventListener("submit", () => sheetForm.reportValidity());

    this.#specialPointsInputs.forEach((element) =>
      element.addEventListener("change", this.onChangeSpecialPoints.bind(this))
    );
    this.onChangeSpecialPoints();
  }

  protected override async _updateObject(
    _event: Event,
    formData?: AppFormData | undefined
  ): Promise<void> {
    const specialPoints: Partial<Record<SpecialName, number>> = {};

    for (const specialName of SpecialNames) {
      const points = parseInt(formData?.[`special.${specialName}`] ?? "");
      if (isNaN(points)) continue;

      specialPoints[specialName] = points;
    }

    this.character.update({ data: { leveling: { specialPoints } } });
  }

  private getHtmlElements(innerHtml: HTMLElement) {
    this.#specialPointsInputs = [];
    innerHtml.querySelectorAll("[data-special-points]").forEach((input) => {
      if (input instanceof HTMLInputElement)
        this.#specialPointsInputs.push(input);
    });

    this.#specialPointsTotalElement = null;
    const totalPoints = innerHtml.querySelector("[data-special-points-total]");
    if (totalPoints instanceof HTMLElement)
      this.#specialPointsTotalElement = totalPoints;
  }

  private onChangeSpecialPoints() {
    if (!this.#specialPointsTotalElement) return;

    this.#specialPointsInputs.forEach((input) => input.setCustomValidity(""));

    const total = this.getTotalSpecialPoints();

    this.setSpecialPointsTotal(total);

    if (total > CONSTANTS.bounds.special.points.total) {
      this.#specialPointsInputs.forEach((input) =>
        input.setCustomValidity(
          getGame().i18n.localize(
            "wv.system.initialCharacterSetup.messages.tooManySpecialPointsSpent"
          )
        )
      );
    } else if (total < CONSTANTS.bounds.special.points.total) {
      this.#specialPointsInputs.forEach((input) =>
        input.setCustomValidity(
          getGame().i18n.localize(
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

type SpecialPointsFormData = Partial<Record<`special.${SpecialName}`, string>>;

type AppFormData = SpecialPointsFormData;

interface TemplateData {
  data: CharacterDataProperties;
  sheet: {
    bounds: typeof CONSTANTS["bounds"];
    specials: Record<SpecialName, TemplateSpecial>;
  };
}

interface TemplateSpecial extends I18nSpecial {
  points: number;
}
