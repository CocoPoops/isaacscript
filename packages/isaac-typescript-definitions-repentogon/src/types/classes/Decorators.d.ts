import type { CallbackPriority } from "isaac-typescript-definitions";
import type { AllButFirst, ModFeature } from "isaacscript-common";
import type { ModCallbackRepentogon } from "../../enums/ModCallbackRepentogon";

declare module "isaacscript-common" {
  /**
   * A decorator function that signifies that the decorated class method should be automatically
   * registered with `Mod.AddCallbackRepentogon`.
   *
   * @allowEmptyVariadic
   * @ignore
   * @customName Callback <<<This doesn't work with Decorators.
   */
  export function CallbackRepentogon<T extends ModCallbackRepentogon>(
    modCallback: T,
    ...optionalArgs: AllButFirst<AddCallbackParametersRepentogon[T]>
  ): <
    Class extends ModFeature,
    Fn extends AddCallbackParametersRepentogon[T][0],
  >(
    target: Class,
    propertyKey: string,
    _descriptor: TypedPropertyDescriptor<Fn>,
  ) => void;

  /**
   * A decorator function that signifies that the decorated class method should be automatically
   * registered with `Mod.AddCallbackRepentogon`.
   *
   * @allowEmptyVariadic
   * @ignore
   * @customName PriorityCallback <<<This doesn't work with Decorators.
   */
  export function PriorityCallbackRepentogon<T extends ModCallbackRepentogon>(
    modCallback: T,
    priority: CallbackPriority | int,
    ...optionalArgs: AllButFirst<AddCallbackParametersRepentogon[T]>
  ): <
    Class extends ModFeature,
    Fn extends AddCallbackParametersRepentogon[T][0],
  >(
    target: Class,
    propertyKey: string,
    _descriptor: TypedPropertyDescriptor<Fn>,
  ) => void;
}
