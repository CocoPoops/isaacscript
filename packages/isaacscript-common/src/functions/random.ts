import { ReadonlySet } from "../types/ReadonlySet";
import { getRandomSeed, isRNG, newRNG } from "./rng";

/**
 * Returns a random float between 0 and 1. It is inclusive on the low end, but exclusive on the high
 * end. (This is because the `RNG.RandomFloat` method will never return a value of exactly 1.)
 *
 * @param seedOrRNG Optional. The `Seed` or `RNG` object to use. If an `RNG` object is provided, the
 *                  `RNG.Next` method will be called. Default is `getRandomSeed()`.
 */
export function getRandom(seedOrRNG: Seed | RNG = getRandomSeed()): float {
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);
  return rng.RandomFloat();
}

/**
 * Returns a random float between min and max.
 *
 * For example:
 *
 * ```ts
 * const realNumberBetweenOneAndThree = getRandomFloat(1, 3);
 * ```
 *
 * @param min The lower bound for the random number (inclusive).
 * @param max The upper bound for the random number (exclusive).
 * @param seedOrRNG Optional. The `Seed` or `RNG` object to use. If an `RNG` object is provided, the
 *                  `RNG.Next` method will be called. Default is `getRandomSeed()`.
 */
export function getRandomFloat(
  min: int,
  max: int,
  seedOrRNG: Seed | RNG = getRandomSeed(),
): float {
  if (min > max) {
    const oldMin = min;
    const oldMax = max;
    min = oldMax;
    max = oldMin;
  }

  // From: https://stackoverflow.com/questions/40431966
  return min + getRandom(seedOrRNG) * (max - min);
}

/**
 * Returns a random integer between min and max. It is inclusive on both ends.
 *
 * Note that this function will run the `Next` method on the `RNG` object before returning the
 * random number.
 *
 * For example:
 *
 * ```ts
 * const oneTwoOrThree = getRandomInt(1, 3);
 * ```
 *
 * @param min The lower bound for the random number (inclusive).
 * @param max The upper bound for the random number (inclusive).
 * @param seedOrRNG Optional. The `Seed` or `RNG` object to use. If an `RNG` object is provided, the
 *                  `RNG.Next` method will be called. Default is `getRandomSeed()`.
 * @param exceptions Optional. An array of elements that will be skipped over when getting the
 *                   random integer. For example, a min of 1, a max of 4, and an exceptions array of
 *                   `[2]` would cause the function to return either 1, 3, or 4. Default is an empty
 *                   array.
 */
export function getRandomInt(
  min: int,
  max: int,
  seedOrRNG: Seed | RNG = getRandomSeed(),
  exceptions: int[] | readonly int[] = [],
): int {
  const rng = isRNG(seedOrRNG) ? seedOrRNG : newRNG(seedOrRNG);

  min = Math.ceil(min);
  max = Math.floor(max);

  if (min > max) {
    const oldMin = min;
    const oldMax = max;
    min = oldMax;
    max = oldMin;
  }

  const exceptionsSet = new ReadonlySet(exceptions);

  let randomInt: int;
  do {
    randomInt = rng.RandomInt(max - min + 1) + min;
  } while (exceptionsSet.has(randomInt));

  return randomInt;
}
