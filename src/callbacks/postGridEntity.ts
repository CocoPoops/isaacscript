import { saveDataManager } from "../features/saveDataManager/exports";
import { getGridEntities } from "../functions/gridEntity";
import * as postGridEntityInit from "./subscriptions/postGridEntityInit";
import * as postGridEntityRemove from "./subscriptions/postGridEntityRemove";
import * as postGridEntityUpdate from "./subscriptions/postGridEntityUpdate";

// This provides the logic for PostGridEntityInit, PostGridEntityUpdate, and PostGridEntityRemove

const v = {
  room: {
    initializedGridEntities: new Map<int, GridEntityType>(),
  },
};

export function postGridEntityCallbacksInit(mod: Mod): void {
  saveDataManager("postGridEntity", v, hasSubscriptions);

  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate); // 1
  mod.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom); // 9
}

function hasSubscriptions() {
  return (
    postGridEntityInit.hasSubscriptions() ||
    postGridEntityUpdate.hasSubscriptions() ||
    postGridEntityRemove.hasSubscriptions()
  );
}

// ModCallbacks.MC_POST_UPDATE (1)
function postUpdate() {
  if (!hasSubscriptions()) {
    return;
  }

  for (const gridEntity of getGridEntities()) {
    checkNewGridEntity(gridEntity);
    postGridEntityUpdate.fire(gridEntity);
  }

  checkGridEntityRemoved();
}

function checkGridEntityRemoved() {
  const game = Game();
  const room = game.GetRoom();

  for (const [
    gridIndex,
    gridEntityType,
  ] of v.room.initializedGridEntities.entries()) {
    const gridEntity = room.GetGridEntity(gridIndex);
    if (gridEntity === undefined || gridEntity.GetType() !== gridEntityType) {
      v.room.initializedGridEntities.delete(gridIndex);
      postGridEntityRemove.fire(gridIndex, gridEntityType);
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (9)
function postNewRoom() {
  if (!hasSubscriptions()) {
    return;
  }

  for (const gridEntity of getGridEntities()) {
    checkNewGridEntity(gridEntity);
  }
}

function checkNewGridEntity(gridEntity: GridEntity) {
  const gridIndex = gridEntity.GetGridIndex();
  const gridEntityType = gridEntity.GetType();
  const storedGridEntityType = v.room.initializedGridEntities.get(gridIndex);
  if (storedGridEntityType !== gridEntityType) {
    v.room.initializedGridEntities.set(gridIndex, gridEntityType);
    postGridEntityInit.fire(gridEntity);
  }
}
