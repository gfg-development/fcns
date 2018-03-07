export type Signals = { [id: string]: number }

export function getSignalCount(name: string, signals: Signals): number {
  if (name in signals) {
    return signals[name]
  } else {
    return 0
  }
}

export function mergeSignals(s1: Signals, s2: Signals): Signals {
  let merged: Signals = Object.assign({}, s1)
  for (const name in s2) {
    if (name in merged) {
      merged[name] += getSignalCount(name, s2)
    } else {
      merged[name] = getSignalCount(name, s2)
    }
  }
  return merged
}

export enum SpecialSignals {
  EVERYTHING,
  ANYTHING,
  EACH
}
