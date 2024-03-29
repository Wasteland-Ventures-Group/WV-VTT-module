import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ActorDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import type { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import BaseSetup from "../applications/actor/character/baseSetup.js";
import {
  ApparelSlot,
  CONSTANTS,
  getPainThreshold,
  SkillName,
  SpecialName,
  TYPES
} from "../constants.js";
import { CharacterDataPropertiesData } from "../data/actor/character/properties.js";
import type {
  ComponentSource,
  CompositeResource,
  SerializedCompositeNumber
} from "../data/common.js";
import { RaceDataSourceData } from "../data/item/race/source.js";
import Formulator, { RollOptions } from "../formulator.js";
import { getGame } from "../foundryHelpers.js";
import {
  createDefaultMessageData,
  isRollBlindedForCurrUser
} from "../foundryHelpers.js";
import type { CheckFlags } from "../hooks/renderChatMessage/decorateSystemMessage/decorateCheck.js";
import type { PainThresholdFlags } from "../hooks/renderChatMessage/decorateSystemMessage/decoratePTMessage.js";
import diceSoNice from "../integrations/diceSoNice/diceSoNice.js";
import Apparel from "../item/apparel.js";
import Race from "../item/race.js";
import Weapon from "../item/weapon.js";
import WvItem from "../item/wvItem.js";
import { getGroundMoveRange, getGroundSprintMoveRange } from "../movement.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import { ruleElementSort } from "../ruleEngine/ruleElement.js";
import type {
  RuleElementCondition,
  RuleElementHook
} from "../ruleEngine/ruleElementSource.js";
import SystemRulesError from "../systemRulesError.js";
import validateSystemData from "../validation/validateSystemData.js";
import WvI18n from "../wvI18n.js";

/** The basic Wasteland Ventures Actor. */
export default class WvActor extends Actor {
  /** The cached base setup application for this actor */
  protected baseSetupApp: BaseSetup | null = null;

  /** Lazily obtain the base setup application for this actor. */
  get baseSetup(): BaseSetup {
    if (this.baseSetupApp) return this.baseSetupApp;

    return (this.baseSetupApp = new BaseSetup(this));
  }

  /** Get an identifying string for this Actor. */
  get ident(): string {
    return `[${this.id}] "${this.name}"`;
  }

  /** Get the Actor's hit points. */
  get hitPoints(): CompositeResource {
    return this.data.data.vitals.hitPoints;
  }

  /** Get the Actor's action points. */
  get actionPoints(): CompositeResource {
    return this.data.data.vitals.actionPoints;
  }

  /** Get the Actor's strain. */
  get strain(): CompositeResource {
    return this.data.data.vitals.strain;
  }

  /** Get the Actor's quick slots. */
  get quickSlots(): CompositeResource {
    return this.data.data.equipment.quickSlots;
  }

  /** Get the race of the Actor. */
  get race(): Race {
    return (
      this.items.find(
        (item): item is Race => item.data.type === TYPES.ITEM.RACE
      ) ??
      new Race(
        {
          type: TYPES.ITEM.RACE,
          name: getGame().i18n.localize("wv.system.races.noRace"),
          img: "icons/svg/mystery-man.svg",
          data: new RaceDataSourceData()
        },
        { parent: this }
      )
    );
  }

  /** Get the amount of crippled legs of the character. */
  get crippledLegs(): number {
    return this.data.data.vitals.crippledLegs;
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
    return this.data.data.equipment.damageThreshold.total;
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

  /** Get the slots that are blocked by apparel items. */
  get blockedApparelSlots(): ApparelSlot[] {
    const slots: Set<ApparelSlot> = new Set();

    this.equippedApparel.forEach((apparel) => {
      apparel.blockedApparelSlots.forEach(slots.add, slots);
    });

    return [...slots];
  }

  /** Get the equipped armor of the actor. */
  get armorApparel(): Apparel | null {
    const armorId = this.data.data.equipment.armorSlotId;
    if (armorId === null) return null;

    const armor = this.items.get(armorId);
    if (!(armor instanceof Apparel)) return null;

    return armor;
  }

  /** Get the equipped clothing of the actor. */
  get clothingApparel(): Apparel | null {
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
      this.armorApparel,
      this.clothingApparel,
      this.eyesApparel,
      this.mouthApparel,
      this.beltApparel
    ].filter((apparel): apparel is Apparel => apparel instanceof Apparel);
  }

  /**
   * Get all equipped items. This includes the readied item, weapon slot
   * weapons and equipped apparel.
   */
  get equippedItems(): WvItem[] {
    return [
      this.readiedItem,
      ...this.weaponSlotWeapons,
      ...this.equippedApparel
    ].filter((item): item is WvItem => item instanceof WvItem);
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
   * @returns a promise that resolves once the update is done, and rejects if
   *   the actor is in combat without sufficient AP
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

    let apCostComposite = this.data.data.equipment.equipActionCosts.readyDirect;
    let quickSlots = this.quickSlots.value;
    if (item.type === "weapon") {
      if (this.data.data.equipment.weaponSlotIds.includes(id)) {
        apCostComposite =
          this.data.data.equipment.equipActionCosts.readyFromSlot;
      }
    } else if (useQuickSlot) {
      if (quickSlots < 1)
        throw new SystemRulesError(
          "Not enough quick slots.",
          "wv.system.messages.notEnoughQuickSlots"
        );

      apCostComposite = this.data.data.equipment.equipActionCosts.readyFromSlot;
      quickSlots -= 1;
    }
    const apCost = apCostComposite.total;

    if (this.actionPoints.value < apCost)
      throw new SystemRulesError(
        "Not enough action points.",
        "wv.system.messages.notEnoughAp"
      );

    await this.update({
      data: {
        equipment: { readiedItemId: id, quickSlots: { value: quickSlots } },
        vitals: { actionPoints: { value: this.actionPoints.value - apCost } }
      }
    });
  }

  /**
   * Unready the readied item or weapon. No update is made in the following
   * cases:
   * - the readied slot is already empty
   *
   * @returns a promise that resolves once the update is done, and rejects if
   *   the actor is in combat without sufficient AP
   */
  async unreadyItem() {
    if (!this.data.data.equipment.readiedItemId === null) return;

    if (!this.inCombat) {
      await this.update({ data: { equipment: { readiedItemId: null } } });
      return;
    }

    const apCost = this.data.data.equipment.equipActionCosts.unready.total;
    if (this.actionPoints.value < apCost)
      throw new SystemRulesError(
        "Not enough action points.",
        "wv.system.messages.notEnoughAp"
      );

    await this.update({
      data: {
        equipment: { readiedItemId: null },
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
        "Can not slot a weapon in combat.",
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
   * Unslot a weapon from a weapon slot. No update is made in the following
   * cases:
   * - the given weapon slot is already empty
   *
   * @param slot - the number of the weapon slot
   * @returns a promise that resolves once the update is done, rejects if this
   *   is attempted in combat
   */
  async unslotWeapon(slot: 1 | 2): Promise<void> {
    if (this.inCombat)
      throw new SystemRulesError(
        "Can not slot a weapon in combat.",
        "wv.system.messages.canNotDoInCombat"
      );

    const index = slot - 1;
    const slots = this.data.data.equipment.weaponSlotIds;
    if (slots[index] === null) return;

    slots[index] = null;
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
   *   is attempted in combat or there is a blocked slot collission
   */
  async equipApparel(id: string | null): Promise<void> {
    if (this.inCombat)
      throw new SystemRulesError(
        "Can not equip an apparel in combat.",
        "wv.system.messages.canNotDoInCombat"
      );

    if (id === null) return;

    const item = this.items.get(id);
    if (!(item instanceof Apparel)) return;

    const slot = item.data.data.slot;
    if (this.blockedApparelSlots.includes(slot))
      throw new SystemRulesError(
        "The apparel's slot is blocked by another apparel.",
        "wv.system.messages.blockedByAnotherApparel"
      );

    let blockedSlotCollision = false;
    item.blockedApparelSlots.forEach((slot) => {
      if (blockedSlotCollision) return;

      blockedSlotCollision ||= !!this[`${slot}Apparel`];
    });
    if (blockedSlotCollision)
      throw new SystemRulesError(
        "The apparel's blocked slots include an occupied slot.",
        "wv.system.messages.blockedApparelSlotIsOccupied"
      );

    if (this.data.data.equipment[`${slot}SlotId`] === id) return;
    await this.update({ data: { equipment: { [`${slot}SlotId`]: id } } });
  }

  /**
   * Unequip an apparel from the designated slot.
   *
   * @param slot - the slot to unequip from
   * @returns a promise that resolves once the update is done, rejects if this
   *   is attempted in combat
   */
  async unequipApparel(slot: ApparelSlot): Promise<void> {
    if (this.inCombat)
      throw new SystemRulesError(
        "Can not equip an apparel in combat.",
        "wv.system.messages.canNotDoInCombat"
      );

    await this.update({ data: { equipment: { [`${slot}SlotId`]: null } } });
  }

  /** Update the hit points of the Actor. */
  async updateHitPoints(value: number) {
    await this.update({ data: { vitals: { hitPoints: { value } } } });
  }

  /** Update the action points of the Actor. */
  async updateActionPoints(value: number) {
    await this.update({ data: { vitals: { actionPoints: { value } } } });
  }

  /** Update the strain of the Actor. */
  async updateStrain(value: number) {
    await this.update({ data: { vitals: { strain: { value } } } });
  }

  /** Restore the action points of the actor to the maximum. */
  async restoreActionPoints() {
    await this.updateActionPoints(this.actionPoints.max);
  }

  /** Restore the quick slots of the actor to the maximum. */
  async restoreQuickSlots() {
    await this.update({
      data: { equipment: { quickSlots: { value: this.quickSlots.max } } }
    });
  }

  /**
   * Roll a skill or SPECIAL check and post the result
   * @param flavor - flavour text
   * @param baseFormula - the base target formula. This is determined differently
   *                      for skill and SPECIAL checks
   * @param target - the target number. This is needed in order to display
   *                 details for the roll.
   * @param options - roll options
   */
  async rollAndCreateMessage(
    flavor: string,
    baseFormula: Formulator,
    target: SerializedCompositeNumber,
    options: RollOptions | undefined
  ): Promise<void> {
    const criticals = this.data.data.secondary.criticals;
    const fullFormula = baseFormula.modify(options?.modifier).criticals({
      success: criticals.success.total,
      failure: criticals.failure.total
    });
    const checkRoll = new Roll(fullFormula.toString()).roll({ async: false });

    const msgOptions = createDefaultMessageData(
      ChatMessage.getSpeaker({ actor: this }),
      options?.rollMode ?? getGame().settings.get("core", "rollMode")
    );

    msgOptions.flavor = flavor;

    let successChance: SerializedCompositeNumber;
    if (options?.modifier) {
      const modifierComponent: ComponentSource = {
        value: options.modifier,
        labelComponents: [{ key: "wv.system.misc.modifier" }]
      };
      successChance = {
        ...target,
        components: [...target.components, modifierComponent]
      };
    } else {
      successChance = target;
    }

    const result = checkRoll.dice[0]?.results[0]?.result ?? 0;
    const flags: CheckFlags = {
      type: "roll",
      details: {
        criticals: {
          success: criticals.success.toObject(false),
          failure: criticals.failure.toObject(false)
        },
        successChance
      },
      roll: {
        formula: checkRoll.formula,
        critical: checkRoll.dice[0]?.results[0]?.critical,
        result,
        degreesOfSuccess: fullFormula.d100Target - result,
        total: checkRoll.total ?? 0
      },
      blind: msgOptions.blind ?? false
    };

    await diceSoNice(
      checkRoll,
      msgOptions.whisper,
      isRollBlindedForCurrUser(flags.blind),
      { actor: this.id }
    );

    ChatMessage.create({
      ...msgOptions,
      flags: { [CONSTANTS.systemId]: flags }
    });
  }

  /**
   * Roll a SPECIAL for this Actor.
   * @param name - the name of the SPECIAL to roll
   */
  rollSpecial(name: SpecialName, options?: RollOptions): void {
    const special = this.data.data.specials[name];
    const components = [
      ...special.tempComponents,
      ...special.permComponents
    ].map((comp) => {
      const result = comp.toObject(false);
      result.value *= 10;
      return result;
    });
    const specialCompNum: SerializedCompositeNumber = {
      source: special.points * 10,
      components
    };
    this.rollAndCreateMessage(
      WvI18n.getSpecialRollFlavor(name),
      Formulator.special(special.tempTotal),
      specialCompNum,
      options
    );
  }

  /**
   * Roll a Skill for this Actor.
   * @param name - the name of the Skill to roll
   */
  rollSkill(name: SkillName, options?: RollOptions): void {
    const skill = this.data.data.skills[name];
    this.rollAndCreateMessage(
      WvI18n.getSkillRollFlavor(name),
      Formulator.skill(skill.total),
      skill.toObject(false),
      options
    );
  }

  /** Remove all race items from this actor. */
  async removeAllRaces() {
    // This deletes all persisted races
    await this.deleteEmbeddedDocuments(
      "Item",
      this.itemTypes.race
        .filter((item): item is StoredDocument<WvItem> => item.id !== null)
        .map((item) => item.id)
    );

    // This deletes all stragglers that might still be there in memory
    for (const race of this.itemTypes.race) {
      await race.delete();
    }
  }

  override prepareBaseData(): void {
    this.data.data = new CharacterDataPropertiesData(this.data.data);

    this.data.data.specials.applyRadiationSickness(
      this.data.data.vitals.radiationSicknessLevel
    );
  }

  override prepareEmbeddedDocuments(): void {
    super.prepareEmbeddedDocuments();
    this.applyRuleElementsForHook("afterSpecial");
  }

  override prepareDerivedData(): void {
    this.data.data.vitals.applySpecials(this.data.data.specials);
    this.data.data.vitals.applyLevel(this.data.data.leveling.level);

    this.data.data.secondary.applySpecials(this.data.data.specials);

    this.data.data.skills.setBaseValues(
      this.data.data.specials,
      this.data.data.magic.thaumSpecial,
      this.data.data.leveling
    );

    this.applyRuleElementsForHook("afterSkills");

    this.data.data.equipment.applyEquippedApparel(this.equippedApparel);

    // TODO: hit chance, combat trick mods
    this.data.data.secondary.applySizeCategory(
      this.data.data.background.size.total
    );
    this.data.data.vitals.applySizeCategory(
      this.data.data.background.size.total
    );

    this.applyRuleElementsForHook("afterComputation");
    this.items.forEach((item) => {
      item.finalizeData();
      item.apps && item.render();
    });
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
    await this.checkPT(changed);
    this.validateSystemData(
      foundry.utils.mergeObject(this.data._source.data, changed.data ?? {}, {
        recursive: options.recursive,
        inplace: false
      })
    );
  }

  /** Validate passed source system data. */
  protected validateSystemData(data: unknown): void {
    validateSystemData(data, getGame().wv.validators.actor[this.data.type]);
  }

  /** Apply the RuleElements of this Actor's Items to itself and its Items. */
  protected applyRuleElementsForHook(hook: RuleElementHook): void {
    const equippedItemIds = this.equippedItems
      .map((item) => item.id)
      .filter((id): id is string => typeof id === "string");

    this.items
      .map((item) => item.getRuleElementsForHook(hook))
      .deepFlatten()
      .sort(ruleElementSort)
      .forEach((rule) => {
        if (equippedItemIds.includes(rule.item.id ?? ""))
          this.applyRuleElement(rule, { metConditions: ["whenEquipped"] });
        else this.applyRuleElement(rule);
      });
  }

  /** A function to apply a RuleElement to this actor and its items */
  protected applyRuleElement(
    rule: RuleElement,
    options: { metConditions: RuleElementCondition[] } = { metConditions: [] }
  ): void {
    rule.apply([this, ...this.items], options);
  }

  private async checkPT(changed: DeepPartial<ActorDataConstructorData>) {
    const hitPoints = changed.data?.vitals?.hitPoints?.value;
    if (hitPoints) {
      const newPT = getPainThreshold(hitPoints);
      const oldPT = this.data.data.vitals.painThreshold;
      if (newPT !== oldPT && newPT > 0) {
        ui.notifications?.info("Pain threshold reached");

        // Create chat message to post the pain threshold
        const flags: Required<PainThresholdFlags> = {
          type: "painThreshold",
          newPainThreshold: newPT,
          oldPainThreshold: oldPT
        };
        const allUsers: User[] = getGame().users?.contents ?? [];
        const authorisedUsers: string[] = allUsers.flatMap((user) => {
          const id = user.data._id;
          if (id !== null) {
            const userLevel = this.getUserLevel(user);
            if (
              (userLevel !== null &&
                userLevel >= CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER) ||
              user.isGM
            ) {
              return [id];
            }
          }
          return [];
        });
        const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
          speaker: ChatMessage.getSpeaker({ actor: this }),
          flags: { [CONSTANTS.systemId]: flags },
          whisper: authorisedUsers
        };
        await ChatMessage.create(msgOptions);
      }
    }
  }
}
