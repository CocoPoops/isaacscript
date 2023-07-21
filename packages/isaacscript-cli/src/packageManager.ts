import commandExists from "command-exists";
import path from "node:path";
import { CWD } from "./constants.js";
import { PackageManager } from "./enums/PackageManager.js";
import { fileExists } from "./file.js";
import { error, getEnumValues } from "./isaacScriptCommonTS.js";
import { Args } from "./parseArgs.js";

const PACKAGE_MANAGER_LOCK_FILE_NAMES = {
  [PackageManager.NPM]: "package-lock.json",
  [PackageManager.YARN]: "yarn.lock",
  [PackageManager.PNPM]: "pnpm-lock.yaml",
} as const satisfies Record<PackageManager, string>;

const PACKAGE_MANAGER_EXEC_COMMANDS = {
  [PackageManager.NPM]: "npx",
  [PackageManager.YARN]: "npx",
  [PackageManager.PNPM]: "pnpm exec",
} as const satisfies Record<PackageManager, string>;

export const PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT = PackageManager.YARN;

export function getPackageManagerLockFileName(
  packageManager: PackageManager,
): string {
  return PACKAGE_MANAGER_LOCK_FILE_NAMES[packageManager];
}

export function getAllPackageManagerLockFileNames(): readonly string[] {
  return Object.values(PACKAGE_MANAGER_LOCK_FILE_NAMES);
}

export function getPackageManagerExecCommand(
  packageManager: PackageManager,
): string {
  return PACKAGE_MANAGER_EXEC_COMMANDS[packageManager];
}

export function getPackageManagerAddCommand(
  packageManager: PackageManager,
  dependency: string,
): string {
  switch (packageManager) {
    case PackageManager.NPM: {
      return `npm install ${dependency} --save`;
    }

    case PackageManager.YARN: {
      return `yarn add ${dependency}`;
    }

    case PackageManager.PNPM: {
      return `pnpm add ${dependency}`;
    }
  }
}

export function getPackageManagerInstallCommand(
  packageManager: PackageManager,
): string {
  return `${packageManager} install`;
}

export function getPackageManagerInstallCICommand(
  packageManager: PackageManager,
): string {
  switch (packageManager) {
    case PackageManager.NPM: {
      return "npm ci";
    }

    case PackageManager.YARN: {
      return "yarn install --frozen-lockfile";
    }

    case PackageManager.PNPM: {
      return "pnpm install --frozen-lockfile";
    }
  }
}

export function getPackageManagerUsedForNewProject(args: Args): PackageManager {
  const packageManagerFromArgs = getPackageManagerFromArgs(args);
  if (packageManagerFromArgs !== undefined) {
    return packageManagerFromArgs;
  }

  if (commandExists.sync("yarn")) {
    return PackageManager.YARN;
  }

  if (commandExists.sync("pnpm")) {
    return PackageManager.PNPM;
  }

  return PackageManager.NPM;
}

export function getPackageManagerUsedForExistingProject(
  args: Args,
  verbose: boolean,
): PackageManager {
  const packageManagerSet = new Set<PackageManager>();

  for (const packageManager of getEnumValues(PackageManager)) {
    const lockFileName = getPackageManagerLockFileName(packageManager);
    const lockFilePath = path.join(CWD, lockFileName);
    if (fileExists(lockFilePath, verbose)) {
      packageManagerSet.add(packageManager);
    }
  }

  const packageManagers = [...packageManagerSet.values()];
  if (packageManagers.length > 1) {
    const packageManagerLockFileNames = packageManagers
      .map((packageManager) => getPackageManagerLockFileName(packageManager))
      .map((packageManagerLockFileName) => `"${packageManagerLockFileName}"`)
      .join(" & ");
    error(
      `Multiple different kinds of package manager lock files were found (${packageManagerLockFileNames}). You should delete the ones that you are not using so that this program can correctly detect your package manager.`,
    );
  }

  const packageManager = packageManagers[0];
  if (packageManager !== undefined) {
    return packageManager;
  }

  return getPackageManagerUsedForNewProject(args);
}

function getPackageManagerFromArgs(args: Args) {
  const dev = args.dev === true;
  if (dev) {
    const packageManagerCommandExists = commandExists.sync(
      PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT,
    );
    if (!packageManagerCommandExists) {
      error(
        `You specified the "dev" flag, but "${PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT}" does not seem to be a valid command. The IsaacScript monorepo uses ${PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT}, so in order to initiate a linked development mod, you must also have ${PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT} installed. Try running "corepack enable" to install it.`,
      );
    }

    return PACKAGE_MANAGER_USED_FOR_ISAACSCRIPT;
  }

  const npm = args.npm === true;
  if (npm) {
    const npmExists = commandExists.sync("npm");
    if (!npmExists) {
      error(
        'You specified the "npm" flag, but "npm" does not seem to be a valid command.',
      );
    }

    return PackageManager.NPM;
  }

  const yarn = args.yarn === true;
  if (yarn) {
    const yarnExists = commandExists.sync("yarn");
    if (!yarnExists) {
      error(
        'You specified the "yarn" flag, but "yarn" does not seem to be a valid command.',
      );
    }

    return PackageManager.YARN;
  }

  const pnpm = args.pnpm === true;
  if (pnpm) {
    const pnpmExists = commandExists.sync("pnpm");
    if (!pnpmExists) {
      error(
        'You specified the "pnpm" flag, but "pnpm" does not seem to be a valid command.',
      );
    }

    return PackageManager.PNPM;
  }

  return undefined;
}
