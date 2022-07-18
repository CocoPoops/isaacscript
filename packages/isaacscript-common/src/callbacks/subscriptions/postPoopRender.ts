import { PoopGridEntityVariant } from "isaac-typescript-definitions";

export type PostPoopRenderRegisterParameters = [
  callback: (poop: GridEntityPoop) => void,
  poopVariant?: PoopGridEntityVariant,
];

const subscriptions: PostPoopRenderRegisterParameters[] = [];

/** @internal */
export function postPoopRenderHasSubscriptions(): boolean {
  return subscriptions.length > 0;
}

/** @internal */
export function postPoopRenderRegister(
  ...args: PostPoopRenderRegisterParameters
): void {
  subscriptions.push(args);
}

/** @internal */
export function postPoopRenderFire(poop: GridEntityPoop): void {
  const poopVariant = poop.GetVariant();

  for (const [callback, callbackPoopVariant] of subscriptions) {
    // Handle the optional 2nd callback argument.
    if (
      callbackPoopVariant !== undefined &&
      callbackPoopVariant !== poopVariant
    ) {
      continue;
    }

    callback(poop);
  }
}
