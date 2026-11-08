/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Eye, AlertTriangle, HelpCircle } from 'lucide-react';
import { ScreeningOutcomeCategory } from '../../data/sampleData';

interface OutcomeCategoryBadgesProps {
  activeOutcome?: ScreeningOutcomeCategory;
  onSelectCategory?: (category: ScreeningOutcomeCategory) => void;
}

export const OUTCOME_DEFINITIONS: Record<
  ScreeningOutcomeCategory,
  {
    label: string;
    description: string;
    badgeStyle: string;
    borderStyle: string;
    icon: React.ElementType;
    criteria: string;
  }
> = {
  NORMAL: {
    label: 'NORMAL',
    description: 'No persistent concerning pattern identified.',
    badgeStyle: 'bg-[#D9F0EA] text-[#087E75] border-[#55B6A3]/50',
    borderStyle: 'border-[#087E75]',
    icon: CheckCircle2,
    criteria: 'Leaf temperature matches energy-balance prediction within baseline tolerance. Latent evaporative cooling active.',
  },
  WATCH: {
    label: 'WATCH',
    description: 'An unusual pattern requires continued observation.',
    badgeStyle: 'bg-[#FFF8EB] text-[#C58A35] border-[#C58A35]/40',
    borderStyle: 'border-[#C58A35]',
    icon: Eye,
    criteria: 'Transient thermal elevation or minor sensor deviation detected, but temporal persistence threshold (<15 min) not yet met.',
  },
  'POSSIBLE WATER STRESS': {
    label: 'POSSIBLE WATER STRESS',
    description: 'Persistent multi-sensor patterns may indicate possible water stress.',
    badgeStyle: 'bg-[#FFF2F0] text-[#C95D58] border-[#C95D58]/40',
    borderStyle: 'border-[#C95D58]',
    icon: AlertTriangle,
    criteria: 'Sustained positive leaf temperature residual (>1.8°C for >15 min) corroborated by declining substrate moisture evidence.',
  },
  INCONCLUSIVE: {
    label: 'INCONCLUSIVE',
    description: 'Insufficient or unreliable data.',
    badgeStyle: 'bg-[#F4F4F4] text-[#78847C] border-[#D1D5DB]',
    borderStyle: 'border-[#78847C]',
    icon: HelpCircle,
    criteria: 'Missing sensor packets, stale heartbeat, or sensor hardware fault (e.g. optical obstruction or ADC out of bounds).',
  },
};

export const OutcomeCategoryBadges: React.FC<OutcomeCategoryBadgesProps> = ({
  activeOutcome,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {(Object.keys(OUTCOME_DEFINITIONS) as ScreeningOutcomeCategory[]).map((categoryKey) => {
        const item = OUTCOME_DEFINITIONS[categoryKey];
        const Icon = item.icon;
        const isActive = activeOutcome === categoryKey;

        return (
          <div
            key={categoryKey}
            onClick={() => onSelectCategory && onSelectCategory(categoryKey)}
            className={`p-3.5 rounded-xl border bg-white transition-all flex flex-col justify-between ${
              isActive
                ? `${item.borderStyle} shadow-xs ring-1 ring-[#123B36]/10`
                : 'border-[#D4E7E1] hover:border-[#55B6A3]'
            } ${onSelectCategory ? 'cursor-pointer' : ''}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeStyle}`}>
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#123B36]' : 'text-[#78847C]'}`} />
              </div>
              <p className="text-xs font-semibold text-[#123B36] mb-1">
                {item.description}
              </p>
            </div>
            <p className="text-[10px] text-[#78847C] pt-2 border-t border-[#D9F0EA] mt-2 line-clamp-2 leading-relaxed">
              {item.criteria}
            </p>
          </div>
        );
      })}
    </div>
  );
};
