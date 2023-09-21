import type { CardType } from "isaac-typescript-definitions";
import { ItemConfigCardType, UseFlag } from "isaac-typescript-definitions";
import { itemConfig } from "../core/cachedClasses";
import {
  FIRST_CARD_TYPE,
  LAST_VANILLA_CARD_TYPE,
} from "../core/constantsFirstLast";
import {
  CARD_DESCRIPTIONS,
  DEFAULT_CARD_DESCRIPTION,
} from "../objects/cardDescriptions";
import { CARD_NAMES, DEFAULT_CARD_NAME } from "../objects/cardNames";
import { ITEM_CONFIG_CARD_TYPES_FOR_CARDS_SET } from "../sets/itemConfigCardTypesForCardsSet";
import { addFlag } from "./flag";
import { iRange } from "./utils";

/**
 * Helper function to get a card description from a Card enum value.
 *
 * For example, `getCardDescription(card)` returns "Where journey begins".
 */
export function getCardDescription(cardType: CardType): string {
  // "ItemConfigCard.Description" is bugged with vanilla cards on patch v1.7.6, so we use a
  // hard-coded map as a workaround.
  const cardDescription = CARD_DESCRIPTIONS[cardType];
  // Handle modded cards.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (cardDescription !== undefined) {
    return cardDescription;
  }

  const itemConfigCard = itemConfig.GetCard(cardType);
  if (itemConfigCard !== undefined) {
    return itemConfigCard.Description;
  }

  return DEFAULT_CARD_DESCRIPTION;
}

/**
 * Helper function to get a card name from a Card.
 *
 * For example, `getCardName(Card.FOOL)` would return "0 - The Fool".
 */
export function getCardName(cardType: CardType): string {
  // "ItemConfigCard.Name" is bugged with vanilla cards on patch v1.7.6, so we use a hard-coded map
  // as a workaround.
  const cardName = CARD_NAMES[cardType];
  // Handle modded cards.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (cardName !== undefined) {
    return cardName;
  }

  const itemConfigCard = itemConfig.GetCard(cardType);
  if (itemConfigCard !== undefined) {
    return itemConfigCard.Name;
  }

  return DEFAULT_CARD_NAME;
}

/**
 * Helper function to get the item config card type of a particular card, rune, or object. For
 * example, the item config card type of `CardType.FOOL` is equal to `ItemConfigCardType.TAROT`.
 *
 * Returns undefined if the provided card type was not valid.
 */
export function getItemConfigCardType(
  cardType: CardType,
): ItemConfigCardType | undefined {
  const itemConfigCard = itemConfig.GetCard(cardType);
  if (itemConfigCard === undefined) {
    return undefined;
  }

  return itemConfigCard.CardType;
}

/**
 * Helper function to get an array with every valid vanilla card sub-type.
 *
 * Note that unlike collectibles and trinkets, there are no gaps in the card types, so this is a
 * simple range from the first card type to the last vanilla card type.
 */
export function getVanillaCardTypes(): CardType[] {
  return iRange(FIRST_CARD_TYPE, LAST_VANILLA_CARD_TYPE);
}

/**
 * Returns true for cards that have the following card type:
 * - CardType.TAROT
 * - CardType.SUIT
 * - CardType.SPECIAL
 * - CardType.TAROT_REVERSE
 */
export function isCard(cardType: CardType): boolean {
  const itemConfigCardType = getItemConfigCardType(cardType);
  if (itemConfigCardType === undefined) {
    return false;
  }

  return ITEM_CONFIG_CARD_TYPES_FOR_CARDS_SET.has(itemConfigCardType);
}

/** Returns whether the given card type matches the specified item config card type. */
export function isCardType(
  cardType: CardType,
  itemConfigCardType: ItemConfigCardType,
): boolean {
  return itemConfigCardType === getItemConfigCardType(cardType);
}

/** Returns true for any card or rune added by a mod. */
export function isModdedCardType(cardType: CardType): boolean {
  return !isVanillaCardType(cardType);
}

/** Returns true for cards that have `ItemConfigCardType.SPECIAL_OBJECT`. */
export function isPocketItemObject(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.SPECIAL_OBJECT);
}

/** Returns true for cards that have `ItemConfigCardType.TAROT_REVERSE`. */
export function isReverseTarotCard(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.TAROT_REVERSE);
}

/** Returns true for cards that have `ItemConfigCardType.RUNE`. */
export function isRune(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.RUNE);
}

/** Returns true for cards that have `ItemConfigCardType.SPECIAL`. */
export function isSpecialCard(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.SPECIAL);
}

/** Returns true for cards that have `ItemConfigCardType.SUIT`. */
export function isSuitCard(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.SUIT);
}

/** Returns true for cards that have `ItemConfigCardType.TAROT`. */
export function isTarotCard(cardType: CardType): boolean {
  return isCardType(cardType, ItemConfigCardType.TAROT);
}

/** Returns true for any vanilla card or rune. */
export function isVanillaCardType(cardType: CardType): boolean {
  return cardType <= LAST_VANILLA_CARD_TYPE;
}

/**
 * Helper function to use a card without showing an animation and without the announcer voice
 * playing.
 */
export function useCardTemp(player: EntityPlayer, cardType: CardType): void {
  const useFlags = addFlag(UseFlag.NO_ANIMATION, UseFlag.NO_ANNOUNCER_VOICE);
  player.UseCard(cardType, useFlags);
}
