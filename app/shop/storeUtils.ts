import type { GemBalance, GemType, PricePart, PricingRule, SelectionState, ValidationResult } from './types';

const GEM_TYPES: GemType[] = ['managerial', 'weCare', 'betterTogether', 'gameChanger'];

export function createEmptySelection(): SelectionState {
  return {
    managerial: 0,
    weCare: 0,
    betterTogether: 0,
    gameChanger: 0
  };
}

export function getPriceParts(rule: PricingRule): PricePart[] {
  if (rule.type === 'any_only') {
    return [{ kind: 'any', amount: rule.anyAmount }];
  }

  if (rule.type === 'specific_plus_any') {
    return [
      { kind: 'specific', gemType: rule.specificGemType, amount: rule.specificAmount },
      { kind: 'any', amount: rule.anyAmount }
    ];
  }

  return rule.requirements.map((requirement) => ({
    kind: 'specific' as const,
    gemType: requirement.gemType,
    amount: requirement.amount
  }));
}

export function getRequiredTotal(rule: PricingRule): number {
  if (rule.type === 'any_only') return rule.anyAmount;
  if (rule.type === 'specific_plus_any') return rule.specificAmount + rule.anyAmount;
  return rule.requirements.reduce((total, item) => total + item.amount, 0);
}

export function getFixedRequirements(rule: PricingRule): Partial<Record<GemType, number>> {
  if (rule.type === 'specific_plus_any') {
    return { [rule.specificGemType]: rule.specificAmount };
  }

  if (rule.type === 'multi_specific') {
    return rule.requirements.reduce<Partial<Record<GemType, number>>>((acc, item) => {
      acc[item.gemType] = item.amount;
      return acc;
    }, {});
  }

  return {};
}

export function getAllowedGemTypes(rule: PricingRule): Set<GemType> {
  if (rule.type === 'multi_specific') {
    return new Set(rule.requirements.map((item) => item.gemType));
  }

  return new Set(GEM_TYPES);
}

export function getDefaultSelection(rule: PricingRule): SelectionState {
  const selection = createEmptySelection();

  if (rule.type === 'specific_plus_any') {
    selection[rule.specificGemType] = rule.specificAmount;
  }

  return selection;
}

export function validateSelection(rule: PricingRule, balance: GemBalance, selection: SelectionState): ValidationResult {
  const totalSelected = sumSelection(selection);
  const fixed = getFixedRequirements(rule);
  const requiredTotal = getRequiredTotal(rule);

  const canAfford = canAffordRule(rule, balance);

  const missingByType: Partial<Record<GemType, number>> = {};

  if (rule.type === 'multi_specific') {
    for (const req of rule.requirements) {
      const selectedForType = selection[req.gemType] ?? 0;
      if (selectedForType < req.amount) {
        missingByType[req.gemType] = req.amount - selectedForType;
      }
    }

    const strictMatch = rule.requirements.every((req) => selection[req.gemType] === req.amount);
    const hasUnrelated = GEM_TYPES.some(
      (gemType) => !rule.requirements.some((req) => req.gemType === gemType) && selection[gemType] > 0
    );

    return {
      isComplete: strictMatch && !hasUnrelated,
      canAfford,
      missingTotal: Math.max(0, requiredTotal - totalSelected),
      missingByType,
      requiredAny: 0,
      selectedAny: 0
    };
  }

  if (rule.type === 'any_only') {
    return {
      isComplete: totalSelected === rule.anyAmount,
      canAfford,
      missingTotal: Math.max(0, rule.anyAmount - totalSelected),
      missingByType,
      requiredAny: rule.anyAmount,
      selectedAny: totalSelected
    };
  }

  const fixedRequired = fixed[rule.specificGemType] ?? 0;
  const selectedForSpecific = selection[rule.specificGemType] ?? 0;
  const selectedAny = totalSelected - fixedRequired;
  const anyComplete = selectedAny === rule.anyAmount;
  const specificComplete = selectedForSpecific >= fixedRequired;

  if (!specificComplete) {
    missingByType[rule.specificGemType] = fixedRequired - selectedForSpecific;
  }

  return {
    isComplete: specificComplete && anyComplete,
    canAfford,
    missingTotal: Math.max(0, rule.anyAmount - selectedAny),
    missingByType,
    requiredAny: rule.anyAmount,
    selectedAny: Math.max(0, selectedAny)
  };
}

export function canAffordRule(rule: PricingRule, balance: GemBalance): boolean {
  if (rule.type === 'any_only') {
    const totalBalance = Object.values(balance).reduce((sum, value) => sum + value, 0);
    return totalBalance >= rule.anyAmount;
  }

  if (rule.type === 'multi_specific') {
    return rule.requirements.every((item) => balance[item.gemType] >= item.amount);
  }

  const specificBalance = balance[rule.specificGemType] ?? 0;
  const totalBalance = Object.values(balance).reduce((sum, value) => sum + value, 0);

  return specificBalance >= rule.specificAmount && totalBalance >= rule.specificAmount + rule.anyAmount;
}

export function getSelectionHelperText(rule: PricingRule, result: ValidationResult): string {
  if (!result.canAfford) {
    return 'Not enough gems for this reward yet.';
  }

  if (result.isComplete) {
    return 'Selection complete.';
  }

  if (rule.type === 'multi_specific') {
    const firstMissing = Object.entries(result.missingByType)[0] as [GemType, number] | undefined;
    if (firstMissing) {
      const [gemType, count] = firstMissing;
      return `Add ${count} more ${gemTypeLabel(gemType)} gem${count > 1 ? 's' : ''}.`;
    }
  }

  if (rule.type === 'specific_plus_any') {
    if ((result.missingByType[rule.specificGemType] ?? 0) > 0) {
      const missing = result.missingByType[rule.specificGemType] ?? 0;
      return `Add ${missing} more ${gemTypeLabel(rule.specificGemType)} gem${missing > 1 ? 's' : ''}.`;
    }

    if (result.missingTotal > 0) {
      return `Select ${result.missingTotal} more gem${result.missingTotal > 1 ? 's' : ''} for the Any portion.`;
    }
  }

  if (rule.type === 'any_only' && result.missingTotal > 0) {
    return `Select ${result.missingTotal} more gem${result.missingTotal > 1 ? 's' : ''}.`;
  }

  return 'Adjust gem selection to match the required price.';
}

export function canIncrement(
  gemType: GemType,
  rule: PricingRule,
  balance: GemBalance,
  selection: SelectionState
): boolean {
  const allowedTypes = getAllowedGemTypes(rule);
  if (!allowedTypes.has(gemType)) return false;

  if (selection[gemType] >= balance[gemType]) return false;

  const next = { ...selection, [gemType]: selection[gemType] + 1 };

  if (rule.type === 'multi_specific') {
    const required = rule.requirements.find((item) => item.gemType === gemType)?.amount ?? 0;
    return next[gemType] <= required;
  }

  const totalCap = getRequiredTotal(rule);
  return sumSelection(next) <= totalCap;
}

export function canDecrement(
  gemType: GemType,
  rule: PricingRule,
  selection: SelectionState
): boolean {
  const value = selection[gemType];
  if (value <= 0) return false;

  if (rule.type === 'specific_plus_any' && rule.specificGemType === gemType) {
    return value > rule.specificAmount;
  }

  return true;
}

export function sumSelection(selection: SelectionState): number {
  return (Object.values(selection) as number[]).reduce((sum, value) => sum + value, 0);
}

export function gemTypeLabel(gemType: GemType): string {
  const map: Record<GemType, string> = {
    managerial: 'Managerial',
    weCare: 'We Care',
    betterTogether: 'Better Together',
    gameChanger: 'Game Changer'
  };

  return map[gemType];
}
