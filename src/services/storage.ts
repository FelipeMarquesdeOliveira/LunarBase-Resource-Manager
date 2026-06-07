import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@lunarbase:';

export const StorageKeys = {
  theme: `${PREFIX}theme`,
  resources: `${PREFIX}resources`,
  simulation: `${PREFIX}simulation`,
  history: `${PREFIX}history`,
  crew: `${PREFIX}crew`,
  onboarded: `${PREFIX}onboarded`,
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function readJson<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] read failed for ${key}`, err);
    return fallback;
  }
}

export async function writeJson<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] write failed for ${key}`, err);
  }
}

export async function removeKey(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`[storage] remove failed for ${key}`, err);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
  } catch (err) {
    console.warn('[storage] clear failed', err);
  }
}
