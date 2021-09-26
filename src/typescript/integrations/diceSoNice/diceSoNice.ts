import { getGame } from "../../foundryHelpers.js";

/**
 * A wrapper for calling `game.dice3d.showForRoll`, if it is available. If it
 * is not available, this does nothing.
 * @see Game.dice3d.showForRoll
 * @see https://gitlab.com/riccisi/foundryvtt-dice-so-nice/-/blob/master/module/Dice3D.js
 */
export default async function diceSoNice(
  roll: ShowForRollParams[0],
  whisper: ShowForRollParams[3],
  speaker: ShowForRollParams[6]
): Promise<boolean | undefined> {
  const dice3d = getGame().dice3d;
  if (dice3d) {
    return dice3d.showForRoll(
      roll,
      getGame().user ?? undefined,
      true,
      whisper,
      false,
      null,
      speaker
    );
  }
}

type ShowForRollParams = Parameters<NonNullable<Game["dice3d"]>["showForRoll"]>;

declare global {
  interface Game {
    dice3d?: {
      /**
       * Show the 3D Dice animation for the Roll made by the User.
       *
       * @param roll - an instance of Roll class to show 3D dice animation.
       * @param user - the user who made the roll (game.user by default).
       * @param synchronize - if the animation needs to be shown to other players. Default: false
       * @param whisper - list of users or userId who can see the roll, set it to null if everyone can see. Default: null
       * @param blind - if the roll is blind for the current user. Default: false
       * @param chatMessageID - A chatMessage ID to reveal when the roll ends. Default: null
       * @param speaker - An object using the same data schema than ChatSpeakerData.
       *        Needed to hide NPCs roll when the GM enables this setting.
       * @returns when resolved true if the animation was displayed, false if not.
       */
      showForRoll(
        roll: Roll,
        user?: User,
        synchronize?: boolean,
        whisper?: Array<{ id: string } | string> | null,
        blind?: boolean,
        chatMessageID?: string | null,
        speaker?: { actor?: string | null } | null
      ): Promise<boolean>;
    };
  }
}
