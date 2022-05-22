import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ActorDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import type { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import {
  ApparelSlot,
  CONSTANTS,
  SkillName,
  SpecialName,
  SpecialNames
} from "../constants.js";
import {
  Criticals,
  SecondaryStatistics
} from "../data/actor/character/properties.js";
import Skills from "../data/actor/character/skills/properties.js";
import type CharacterDataSource from "../data/actor/character/source.js";
import Specials, {
  Special
} from "../data/actor/character/specials/properties.js";
import { getTotal, ModifiableNumber } from "../data/common.js";
import type { Resource } from "../data/foundryCommon.js";
import Formulator from "../formulator.js";
import { getGame } from "../foundryHelpers.js";
import Apparel from "../item/apparel.js";
import Weapon from "../item/weapon.js";
import type WvItem from "../item/wvItem.js";
import { getGroundMoveRange, getGroundSprintMoveRange } from "../movement.js";
import { applyRadiationSickness } from "../radiation.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import SystemRulesError from "../systemRulesError.js";
import validateSystemData from "../validation/validateSystemData.js";
import WvI18n from "../wvI18n.js";

/** The basic Wasteland Ventures Actor. */
export default class WvActor extends Actor {
  /** A convenience getter for the Actor's hit points. */
  get hitPoints(): Resource {
    return this.data.data.vitals.hitPoints;
  }

  /** A convenience getter for the Actor's action points. */
  get actionPoints(): Resource {
    return this.data.data.vitals.actionPoints;
  }

  /** A convenience getter for the Actor's strain. */
  get strain(): Resource {
    return this.data.data.vitals.strain;
  }

  /** Get the ground movement range of the actor. */
  get groundMoveRange(): number {
    return getGroundMoveRange(this);
  }

  /** Get the ground sprint movement range of the actor. */
  get groundSprintMoveRange(): number {
    return getGroundSprintMoveRange(this);
  }

  /**
   * Check whether the actor is in combat in the active scene or in any
   * unlinked combat.
   */
  get inCombat(): boolean {
    const combats = getGame().combats;
    if (!combats) return false;

    return combats.some(
      (combat) =>
        combat.isGloballyActive &&
        combat.combatants.some((combatant) =>
          combatant.actor ? combatant.actor.id === this.id : false
        )
    );
  }

  /** Get the damage threshold of the actor. */
  get damageThreshold(): number {
    return this.data.data.equipment.damageThreshold ?? 0;
  }

  /** Get the readied Item of this actor, if it exists. */
  get readiedItem(): WvItem | null {
    const itemId = this.data.data.equipment.readiedItemId;
    if (itemId === null) return null;

    return this.items.get(itemId) ?? null;
  }

  /** Get the weapon slot weapons. */
  get weaponSlotWeapons(): [Weapon | null, Weapon | null] {
    return [this.getWeaponSlotWeapon(1), this.getWeaponSlotWeapon(2)];
  }

  /** Get the slots that are blocked by other apparel items. */
  get blockedApparelSlots(): ApparelSlot[] {
    const slots: Set<ApparelSlot> = new Set();

    this.equippedApparel.forEach((apparel) => {
      apparel.systemData.blockedSlots?.forEach((slot) => slots.add(slot));
    });

    return [...slots];
  }

  /** Get the equipped armor of the actor. */
  get armor(): Apparel | null {
    const armorId = this.data.data.equipment.armorSlotId;
    if (armorId === null) return null;

    const armor = this.items.get(armorId);
    if (!(armor instanceof Apparel)) return null;

    return armor;
  }

  /** Get the equipped clothing of the actor. */
  get clothing(): Apparel | null {
    const clothingId = this.data.data.equipment.clothingSlotId;
    if (clothingId === null) return null;

    const clothing = this.items.get(clothingId);
    if (!(clothing instanceof Apparel)) return null;

    return clothing;
  }

  /** Get the equipped eyes apparel of the actor. */
  get eyesApparel(): Apparel | null {
    const eyesId = this.data.data.equipment.eyesSlotId;
    if (eyesId === null) return null;

    const eyes = this.items.get(eyesId);
    if (!(eyes instanceof Apparel)) return null;

    return eyes;
  }

  /** Get the equipped mouth apparel of the actor. */
  get mouthApparel(): Apparel | null {
    const mouthId = this.data.data.equipment.mouthSlotId;
    if (mouthId === null) return null;

    const mouth = this.items.get(mouthId);
    if (!(mouth instanceof Apparel)) return null;

    return mouth;
  }

  /** Get the equipped belt apparel of the actor. */
  get beltApparel(): Apparel | null {
    const beltId = this.data.data.equipment.beltSlotId;
    if (beltId === null) return null;

    const belt = this.items.get(beltId);
    if (!(belt instanceof Apparel)) return null;

    return belt;
  }

  /** Get all equipped apparel items of the actor.  */
  get equippedApparel(): Apparel[] {
    return [
      this.armor,
      this.clothing,
      this.eyesApparel,
      this.mouthApparel,
      this.beltApparel
    ].filter((apparel): apparel is Apparel => apparel instanceof Apparel);
  }

  /**
   * Get a SPECIAL from this actor.
   * @throws If the SPECIALS have not been calculated yet.
   */
  getSpecial(name: SpecialName): Special {
    const special = this.data.data.specials[name];
    if (special === undefined)
      throw new Error("The SPECIALs have not been calculated yet!");

    return special;
  }

  /**
   * Get a Skill from this actor.
   * @throws If the Skills have not been calculated yet.
   */
  getSkill(name: SkillName): ModifiableNumber {
    const skill = this.data.data.skills[name];
    if (skill === undefined)
      throw new Error("The Skills have not been calculated yet!");

    return skill;
  }

  /** Get the weapon of the given weapon slot. */
  getWeaponSlotWeapon(slot: 1 | 2): Weapon | null {
    const itemId = this.data.data.equipment.weaponSlotIds[slot - 1];
    if (typeof itemId !== "string") return null;

    const item = this.items.get(itemId);
    if (!(item instanceof Weapon)) return null;

    return item;
  }

  /**
   * Ready a weapon on the actor. No update is made in the following cases:
   * - the given ID is null
   * - the actor has no item with the given ID
   * - the designated item is not an item that can be readied
   * - the readied slot already has the given ID
   *
   * @param id - the ID of the actor owned item to ready
   * @param useQuickSlot - whether to use a quick slot charge when in combat and
   *   it applies to the item
   * @returns a promise that resolves once the update is done
   */
  async readyItem(
    id: string | null,
    { useQuickSlot } = { useQuickSlot: false }
  ): Promise<void> {
    if (id === null) return;

    const item = this.items.get(id);
    if (item?.type !== "weapon" && item?.type !== "misc") return;

    if (this.data.data.equipment.readiedItemId === id) return;

    if (!this.inCombat) {
      await this.update({ data: { equipment: { readiedItemId: id } } });
      return;
    }

    let apCost = CONSTANTS.rules.equipment.readyItemCost.direct;
    if (item.type === "weapon") {
      if (this.data.data.equipment.weaponSlotIds.includes(id)) {
        apCost = CONSTANTS.rules.equipment.readyItemCost.fromSlot;
      }
    } else if (useQuickSlot) {
      apCost = CONSTANTS.rules.equipment.readyItemCost.fromSlot;
    }

    if (this.actionPoints.value < apCost) {
      throw new SystemRulesError(
        "Not enough action points!",
        "wv.system.messages.notEnoughAp"
      );
    }

    await this.update({
      data: {
        equipment: { readiedItemId: id },
        vitals: { actionPoints: { value: this.actionPoints.value - apCost } }
      }
    });
  }

  /**
   * Slot a weapon into a weapon slot. No update is made in the following cases:
   * - the given ID is null
   * - the actor has no item with the given ID
   * - the designated item is not a weapon
   * - the given weapon slot already has the given ID
   *
   * @param id - the ID of the actor owned weapon to slot
   * @param slot - the number of the weapon slot
   * @returns a promise that resolves once the update is done, rejects if this
   *   is attempted in combat
   */
  async slotWeapon(id: string | null, slot: 1 | 2): Promise<void> {
    if (this.inCombat)
      throw new SystemRulesError(
        "Can not slot a weapon in combat!",
        "wv.system.messages.canNotDoInCombat"
      );

    if (id === null) return;

    const item = this.items.get(id);
    if (!(item instanceof Weapon)) return;

    const index = slot - 1;
    const slots = this.data.data.equipment.weaponSlotIds;
    if (slots[index] === id) return;

    slots[index] = id;
    await this.update({ data: { equipment: { weaponSlotIds: slots } } });
  }

  /**
   * Equip an apparel into its slot. No update is made in the following cases:
   * - the given ID is null
   * - the actor has no item with the given ID
   * - the designated item is not an apparel
   * - the apparel's slot already has the given ID
   *
   * @param id - the ID of the actor owned apparel to equip
   * @returns a promise that resolves once the update is done, rejects if this
   *   is attempted in combat or the apparel slot is blocked
   */
  async equipApparel(id: string | null): Promise<void> {
    if (this.inCombat)
      throw new SystemRulesError(
        "Can not slot a weapon in combat!",
        "wv.system.messages.canNotDoInCombat"
      );

    if (id === null) return;

    const item = this.items.get(id);
    if (!(item instanceof Apparel)) return;

    const slot = item.systemData.slot;
    if (this.blockedApparelSlots.includes(slot))
      throw new SystemRulesError(
        "The apparel's slot is blocked by another apparel!",
        "wv.system.messages.blockedByAnotherApparel"
      );

    let updateData: Partial<ActorDataConstructorData>;
    switch (slot) {
      case "armor":
        if (this.data.data.equipment.armorSlotId === id) return;
        updateData = { data: { equipment: { armorSlotId: id } } };
        break;
      case "clothing":
        if (this.data.data.equipment.clothingSlotId === id) return;
        updateData = { data: { equipment: { clothingSlotId: id } } };
        break;
      case "eyes":
        if (this.data.data.equipment.eyesSlotId === id) return;
        updateData = { data: { equipment: { eyesSlotId: id } } };
        break;
      case "mouth":
        if (this.data.data.equipment.mouthSlotId === id) return;
        updateData = { data: { equipment: { mouthSlotId: id } } };
        break;
      case "belt":
        if (this.data.data.equipment.beltSlotId === id) return;
        updateData = { data: { equipment: { beltSlotId: id } } };
    }

    await this.update(updateData);
  }

  /**
   * Create update data for updating the hit points and optionally update the
   * Actor.
   * @param hitPoints - the new hit points value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateHitPoints(hitPoints: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { hitPoints: { value: hitPoints } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Create update data for updating the action points and optionally update the
   * Actor.
   * @param actionPoints - the new action points value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateActionPoints(actionPoints: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { actionPoints: { value: actionPoints } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Create update data for updating the strain and optionally update the Actor.
   * @param strain - the new strain value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateStrain(strain: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { strain: { value: strain } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Roll a SPECIAL for this Actor.
   * @param name - the name of the SPECIAL to roll
   */
  rollSpecial(name: SpecialName, options?: RollOptions): void {
    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSpecialRollFlavor(name),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };

    new Roll(
      Formulator.special(this.getSpecial(name).tempTotal)
        .modify(options?.modifier)
        .criticals({
          success: getTotal(this.data.data.secondary.criticals.success),
          failure: getTotal(this.data.data.secondary.criticals.failure)
        })
        .toString()
    )
      .roll({ async: true })
      .then((r) =>
        r.toMessage(msgOptions, {
          rollMode: options?.whisperToGms ? "gmroll" : "publicroll"
        })
      );
  }

  /**
   * Roll a Skill for this Actor.
   * @param name - the name of the Skill to roll
   */
  rollSkill(name: SkillName, options?: RollOptions): void {
    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSkillRollFlavor(name),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };

    new Roll(
      Formulator.skill(getTotal(this.getSkill(name)))
        .modify(options?.modifier)
        .criticals({
          success: getTotal(this.data.data.secondary.criticals.success),
          failure: getTotal(this.data.data.secondary.criticals.failure)
        })
        .toString()
    )
      .roll({ async: true })
      .then((r) =>
        r.toMessage(msgOptions, {
          rollMode: options?.whisperToGms ? "gmroll" : "publicroll"
        })
      );
  }

  override prepareBaseData(): void {
    const data = this.data.data;

    // Compute the level -------------------------------------------------------
    const level = Math.floor(
      (1 + Math.sqrt(data.leveling.experience / 12.5 + 1)) / 2
    );
    data.leveling.level = level;

    // Compute the XP needed for the next level --------------------------------
    data.leveling.xpForNextLevel = 50 * (level + 1) * level;

    // Compute the maximum skill points to spend -------------------------------
    data.leveling.maxSkillPoints = data.leveling.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );

    // Compute the SPECIALs ----------------------------------------------------
    data.specials = new Specials();
    for (const special of SpecialNames) {
      const points = data.leveling.specialPoints[special];
      data.specials[special] = new Special(points, points, points);
    }

    // Modify SPECIALS from Radiation sickness ---------------------------------
    applyRadiationSickness(this);
  }

  override prepareEmbeddedDocuments(): void {
    super.prepareEmbeddedDocuments();
    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onAfterSpecial());
  }

  override prepareDerivedData(): void {
    const data = this.data.data;

    // Compute the maximum hit points ------------------------------------------
    data.vitals.hitPoints.max = this.getSpecial("endurance").permTotal + 10;

    // Compute the maximum healing rate ----------------------------------------
    const endurance = this.getSpecial("endurance");
    if (endurance.tempTotal >= 8) {
      data.vitals.healingRate = 3;
    } else if (endurance.tempTotal >= 4) {
      data.vitals.healingRate = 2;
    } else {
      data.vitals.healingRate = 1;
    }

    // Compute the maximum action points ---------------------------------------
    data.vitals.actionPoints.max =
      Math.floor(this.getSpecial("agility").tempTotal / 2) + 10;

    // Compute the maximum strain ----------------------------------------------
    const level = data.leveling.level;
    if (level === undefined)
      throw new Error("The level should be computed before computing strain.");
    data.vitals.strain.max = 20 + Math.floor(level / 5) * 5;

    // Compute the maximum insanity --------------------------------------------
    data.vitals.insanity.max =
      Math.floor(this.getSpecial("intelligence").tempTotal / 2) + 5;

    // Init the secondary statistics -------------------------------------------
    data.secondary = new SecondaryStatistics();

    // Compute the critical values ---------------------------------------------
    const luck = this.getSpecial("luck").tempTotal;
    data.secondary.criticals = new Criticals(
      Math.max(1, luck),
      Math.min(100, 90 + luck)
    );

    // Compute the maximum carry weight ----------------------------------------
    data.secondary.maxCarryWeight =
      this.getSpecial("strength").tempTotal * 5 + 10;

    // Compute the skills ------------------------------------------------------
    data.skills = new Skills();
    let skill: SkillName;
    for (skill in CONSTANTS.skillSpecials) {
      data.skills[skill] = this.computeBaseSkill(skill);
    }
    data.skills["thaumaturgy"] = this.computeBaseSkill("thaumaturgy");

    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onAfterSkills());

    // Calculate data derived from equipment -----------------------------------
    data.equipment.damageThreshold = this.equippedApparel.reduce(
      (dt, apparel) => {
        if (apparel.systemData.damageThreshold)
          dt += getTotal(apparel.systemData.damageThreshold);
        return dt;
      },
      0
    );

    data.equipment.quickSlots.max = this.equippedApparel.reduce(
      (qs, apparel) => {
        if (apparel.systemData.quickSlots)
          qs += getTotal(apparel.systemData.quickSlots);
        return qs;
      },
      0
    );

    // Modify values based on the size -----------------------------------------
    // TODO: hit chance, reach, combat trick mods
    switch (getTotal(data.background.size)) {
      case 4:
        data.vitals.hitPoints.max += 4;
        data.secondary.maxCarryWeight += 60;
        break;
      case 3:
        data.vitals.hitPoints.max += 2;
        data.secondary.maxCarryWeight += 40;
        break;
      case 2:
        data.vitals.hitPoints.max += 1;
        data.secondary.maxCarryWeight += 10;
        break;
      case 1:
        data.secondary.maxCarryWeight += 5;
        break;
      case -1:
        data.secondary.maxCarryWeight -= 5;
        break;
      case -2:
        data.vitals.hitPoints.max -= 1;
        data.secondary.maxCarryWeight -= 10;
        break;
      case -3:
        data.vitals.hitPoints.max -= 2;
        data.secondary.maxCarryWeight -= 40;
        break;
      case -4:
        data.vitals.hitPoints.max -= 4;
        data.secondary.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }

    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onAfterComputation());
  }

  protected override async _preCreate(
    data: ActorDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preCreate(data, options, user);
    this.validateSystemData(this.data._source.data);
  }

  protected override async _preUpdate(
    changed: DeepPartial<ActorDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preUpdate(changed, options, user);
    this.validateSystemData(
      foundry.utils.mergeObject(this.data._source.data, changed.data ?? {}, {
        recursive: options.recursive,
        inplace: false
      })
    );
  }

  /** Get RuleElements that apply to this Actor. */
  protected get applicableRuleElements(): RuleElement[] {
    const rules: RuleElement[] = [];

    this.itemTypes.effect.forEach((effect) => {
      effect.data.data.rules.elements.forEach((rule) => {
        if (rule.target === "actor") rules.push(rule);
      });
    });

    this.equippedApparel.forEach((apparel) => {
      apparel.data.data.rules.elements.forEach((rule) => {
        if (rule.target === "actor") rules.push(rule);
      });
    });

    return rules;
  }

  /**
   * Compute the initial Skill for the given skill name. This includes the
   * SPECIAL derived starting value and the final value only increased by skill
   * point ranks.
   * @param skill - the name of the skill
   */
  protected computeBaseSkill(skill: SkillName): ModifiableNumber {
    const baseSkill =
      this.getSpecial(
        skill === "thaumaturgy"
          ? this.data.data.magic.thaumSpecial
          : CONSTANTS.skillSpecials[skill]
      ).permTotal *
        2 +
      Math.floor(this.getSpecial("luck").permTotal / 2);
    return new ModifiableNumber(
      baseSkill,
      baseSkill + this.data.data.leveling.skillRanks[skill]
    );
  }

  /** Validate passed source system data. */
  protected validateSystemData(data: unknown): void {
    validateSystemData(data, getGame().wv.validators.actor[this.data.type]);
  }
}

/**
 * Options for modifying actor rolls.
 */
interface RollOptions {
  /**
   * An ad-hoc modifier to roll with. When undefined, no modifier is applied.
   * @defaultValue `undefined`
   */
  modifier?: number;

  /**
   * Whether to whisper the roll to GMs.
   * @defaultValue `false`
   */
  whisperToGms?: boolean;
}

/** The type of the update data for WvActors. */
export type UpdateData = DeepPartial<CharacterDataSource> & {
  _id: string | null;
};
