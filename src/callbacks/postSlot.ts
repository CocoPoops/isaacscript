import { saveDataManager } from "../features/saveDataManager/exports";
import * as postSlotInit from "./subscriptions/postSlotInit";
import * as postSlotUpdate from "./subscriptions/postSlotUpdate";

// This provides the logic for PostSlotInit and PostSlotUpdate

const v = {
  room: {
    initializedSlots: new Set<PtrHash>(),
  },
};

export function postSlotCallbacksInit(mod: Mod): void {
  saveDataManager("postSlot", v, hasSubscriptions);

  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate); // 1
  mod.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom); // 9
}

function hasSubscriptions() {
  return postSlotInit.hasSubscriptions() || postSlotUpdate.hasSubscriptions();
}

// ModCallbacks.MC_POST_UPDATE (1)
function postUpdate() {
  if (!hasSubscriptions()) {
    return;
  }

  const slots = Isaac.FindByType(EntityType.ENTITY_SLOT);
  for (const slot of slots) {
    checkNewEntity(slot);
    postSlotUpdate.fire(slot);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (9)
function postNewRoom() {
  if (!hasSubscriptions()) {
    return;
  }

  const slots = Isaac.FindByType(EntityType.ENTITY_SLOT);
  for (const slot of slots) {
    checkNewEntity(slot);
  }
}

function checkNewEntity(slot: Entity) {
  const ptrHash = GetPtrHash(slot);
  if (!v.room.initializedSlots.has(ptrHash)) {
    v.room.initializedSlots.add(ptrHash);
    postSlotInit.fire(slot);
  }
}
