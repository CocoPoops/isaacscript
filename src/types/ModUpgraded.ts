import * as postCursedTeleport from "../callbacks/subscriptions/postCursedTeleport";
import * as postCustomRevive from "../callbacks/subscriptions/postCustomRevive";
import * as postEsauJr from "../callbacks/subscriptions/postEsauJr";
import * as postFirstEsauJr from "../callbacks/subscriptions/postFirstEsauJr";
import * as postFirstFlip from "../callbacks/subscriptions/postFirstFlip";
import * as postFlip from "../callbacks/subscriptions/postFlip";
import * as postGameStartedReordered from "../callbacks/subscriptions/postGameStartedReordered";
import * as postGridEntityInit from "../callbacks/subscriptions/postGridEntityInit";
import * as postGridEntityRemove from "../callbacks/subscriptions/postGridEntityRemove";
import * as postGridEntityUpdate from "../callbacks/subscriptions/postGridEntityUpdate";
import * as postItemPickup from "../callbacks/subscriptions/postItemPickup";
import * as postLaserInitLate from "../callbacks/subscriptions/postLaserInitLate";
import * as postNewLevelReordered from "../callbacks/subscriptions/postNewLevelReordered";
import * as postNewRoomReordered from "../callbacks/subscriptions/postNewRoomReordered";
import * as postPickupCollect from "../callbacks/subscriptions/postPickupCollect";
import * as postPickupInitLate from "../callbacks/subscriptions/postPickupInitLate";
import * as postPlayerChangeHealth from "../callbacks/subscriptions/postPlayerChangeHealth";
import * as postPlayerChangeType from "../callbacks/subscriptions/postPlayerChangeType";
import * as postPlayerFatalDamage from "../callbacks/subscriptions/postPlayerFatalDamage";
import * as postPlayerInitLate from "../callbacks/subscriptions/postPlayerInitLate";
import * as postPlayerInitReordered from "../callbacks/subscriptions/postPlayerInitReordered";
import * as postPlayerRenderReordered from "../callbacks/subscriptions/postPlayerRenderReordered";
import * as postPlayerUpdateReordered from "../callbacks/subscriptions/postPlayerUpdateReordered";
import * as postSacrifice from "../callbacks/subscriptions/postSacrifice";
import * as postTransformation from "../callbacks/subscriptions/postTransformation";
import * as preCustomRevive from "../callbacks/subscriptions/preCustomRevive";
import * as preItemPickup from "../callbacks/subscriptions/preItemPickup";
import { getDebugPrependString } from "../functions/log";
import { ensureAllCases } from "../functions/util";
import CallbackParametersCustom from "./CallbackParametersCustom";
import ModCallbacksCustom from "./ModCallbacksCustom";

/** `isaacscript-common` allows for custom callbacks, so it provides an upgraded Mod object. */
export default class ModUpgraded implements Mod {
  /** We store a copy of the original mod object so that we can re-implement its functions. */
  Mod: Mod;

  /** End-users can optionally enable verbose-mode, which helps troubleshoot crashes. */
  Verbose: boolean;

  // Re-implement all of the functions and attributes of Mod

  AddCallback<T extends keyof CallbackParameters>(
    callbackID: T,
    ...args: CallbackParameters[T]
  ): void {
    if (this.Verbose) {
      const callback = args[0] as any; // eslint-disable-line
      const optionalArg = args[1] as any; // eslint-disable-line

      const callbackName = getCallbackName(callbackID);
      const debugMsg = getDebugPrependString(callbackName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callbackWithLogger = (...callbackArgs: any[]) => {
        Isaac.DebugString(`${debugMsg} - START`);
        callback(...callbackArgs); // eslint-disable-line @typescript-eslint/no-unsafe-call
        Isaac.DebugString(`${debugMsg} - END`);
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.Mod.AddCallback(callbackID, callbackWithLogger, optionalArg);
    } else {
      this.Mod.AddCallback(callbackID, ...args);
    }
  }

  HasData(): boolean {
    return this.Mod.HasData();
  }

  LoadData(): string {
    return this.Mod.LoadData();
  }

  RemoveCallback(callbackID: ModCallbacks, callback: () => void): void {
    this.Mod.RemoveCallback(callbackID, callback);
  }

  RemoveData(): void {
    this.Mod.RemoveData();
  }

  SaveData(data: string): void {
    this.Mod.SaveData(data);
  }

  Name: string;

  // Define custom functionality

  // eslint-disable-next-line class-methods-use-this
  AddCallbackCustom<T extends keyof CallbackParametersCustom>(
    callbackID: T,
    ...args: CallbackParametersCustom[T]
  ): void {
    switch (callbackID) {
      case ModCallbacksCustom.MC_POST_GAME_STARTED_REORDERED: {
        postGameStartedReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_GAME_STARTED_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_NEW_LEVEL_REORDERED: {
        postNewLevelReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_NEW_LEVEL_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_NEW_ROOM_REORDERED: {
        postNewRoomReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_NEW_ROOM_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_INIT_REORDERED: {
        postPlayerInitReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_INIT_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_UPDATE_REORDERED: {
        postPlayerUpdateReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_UPDATE_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_RENDER_REORDERED: {
        postPlayerRenderReordered.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_RENDER_REORDERED]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE: {
        postPlayerInitLate.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_INIT_LATE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PICKUP_INIT_LATE: {
        postPickupInitLate.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PICKUP_INIT_LATE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_LASER_INIT_LATE: {
        postLaserInitLate.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_LASER_INIT_LATE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PICKUP_COLLECT: {
        postPickupCollect.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PICKUP_COLLECT]),
        );
        break;
      }

      case ModCallbacksCustom.MC_PRE_ITEM_PICKUP: {
        preItemPickup.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_PRE_ITEM_PICKUP]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_ITEM_PICKUP: {
        postItemPickup.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_ITEM_PICKUP]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE: {
        postPlayerChangeType.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_CHANGE_HEALTH: {
        postPlayerChangeHealth.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_CHANGE_HEALTH]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_PLAYER_FATAL_DAMAGE: {
        postPlayerFatalDamage.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_PLAYER_FATAL_DAMAGE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE: {
        preCustomRevive.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_PRE_CUSTOM_REVIVE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_CUSTOM_REVIVE: {
        postCustomRevive.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_CUSTOM_REVIVE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_FLIP: {
        postFlip.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_FLIP]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_FIRST_FLIP: {
        postFirstFlip.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_FIRST_FLIP]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_ESAU_JR: {
        postEsauJr.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_ESAU_JR]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_FIRST_ESAU_JR: {
        postFirstEsauJr.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_FIRST_ESAU_JR]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_TRANSFORMATION: {
        postTransformation.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_TRANSFORMATION]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_SACRIFICE: {
        postSacrifice.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_SACRIFICE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_CURSED_TELEPORT: {
        postCursedTeleport.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_CURSED_TELEPORT]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT: {
        postGridEntityInit.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE: {
        postGridEntityUpdate.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE]),
        );
        break;
      }

      case ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE: {
        postGridEntityRemove.register(
          ...(args as CallbackParametersCustom[ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE]),
        );
        break;
      }

      default: {
        ensureAllCases(callbackID);
        error(`The custom callback ID of "${callbackID}" is not valid.`);
      }
    }
  }

  constructor(mod: Mod, verbose: boolean) {
    this.Mod = mod;
    this.Verbose = verbose;
    this.Name = mod.Name;
  }
}

function getCallbackName(callbackID: int) {
  for (const [key, value] of Object.entries(ModCallbacks)) {
    if (value === callbackID) {
      return key;
    }
  }

  return "MC_UNKNOWN";
}
