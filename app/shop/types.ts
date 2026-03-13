export type GemType = 'managerial' | 'weCare' | 'betterTogether' | 'gameChanger';

export type GemBalance = Record<GemType, number>;

export type SpecificPlusAnyPricingRule = {
  type: 'specific_plus_any';
  specificGemType: GemType;
  specificAmount: number;
  anyAmount: number;
};

export type AnyOnlyPricingRule = {
  type: 'any_only';
  anyAmount: number;
};

export type MultiSpecificPricingRule = {
  type: 'multi_specific';
  requirements: Array<{ gemType: GemType; amount: number }>;
};

export type PricingRule = SpecificPlusAnyPricingRule | AnyOnlyPricingRule | MultiSpecificPricingRule;

export type RewardItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  pricingRule: PricingRule;
};

export type PricePart =
  | { kind: 'specific'; gemType: GemType; amount: number }
  | { kind: 'any'; amount: number };

export type SelectionState = Record<GemType, number>;

export type ValidationResult = {
  isComplete: boolean;
  canAfford: boolean;
  missingTotal: number;
  missingByType: Partial<Record<GemType, number>>;
  requiredAny: number;
  selectedAny: number;
};
