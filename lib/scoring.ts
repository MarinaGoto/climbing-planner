import { ClimberProfile, Weather, Crag, RankedCrag } from './types';

const gradeOrder = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
  '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d'
];

function gradeIndex(grade: string): number {
  return gradeOrder.indexOf(grade) !== -1 ? gradeOrder.indexOf(grade) : -1;
}

function isSuitable(climber: ClimberProfile, crag: Crag): boolean {
  for (const type of crag.type) {
    let comfortGrade: string;
    if (type === 'bouldering') {
      comfortGrade = climber.bouldering.comfortGrade;
    } else if (type === 'sport') {
      comfortGrade = climber.sport.comfortGrade;
    } else if (type === 'trad') {
      comfortGrade = climber.trad.comfortGrade;
    } else {
      continue;
    }
    if (gradeIndex(comfortGrade) > gradeIndex(crag.grades.max)) {
      return false;
    }
  }
  return true;
}

export function recommendCrags(
  climber: ClimberProfile,
  partner: ClimberProfile,
  weather: Weather,
  crags: Crag[],
  preferredTypes: string[]
): RankedCrag[] {
  // Filter based on preferred types
  let filteredCrags = crags.filter(crag => crag.type.some(t => preferredTypes.includes(t)));

  // Filter based on weather
  if (weather.rainProbability > 20) {
    filteredCrags = filteredCrags.filter(c => c.type.includes('bouldering'));
  }

  // Further filter for suitability
  filteredCrags = filteredCrags.filter(c => isSuitable(climber, c) && isSuitable(partner, c));

  // Score each crag
  const scored = filteredCrags.map(crag => {
    let score = 0;

    // Grade match
    score += 50; // Base for suitable

    // Weather score
    if (weather.rainProbability > 20 && !crag.type.includes('bouldering')) {
      score -= 100;
    }

    // Drying score
    if (weather.humidity > 85) {
      score -= Math.max(0, crag.dryingTimeHours - 2) * 5;
    }

    // Style match (placeholder)
    score += 0;

    // Approach penalty
    score -= crag.approachMinutes / 10;

    // Generate reason
    let reason = 'Suitable for your grades.';
    if (weather.humidity > 85 && crag.dryingTimeHours <= 2) {
      reason += ' Dries quickly.';
    }
    if (crag.approachMinutes < 15) {
      reason += ' Short approach.';
    }

    return {
      crag: crag.name,
      score: Math.round(score),
      reason,
      type: crag.type,
      styles: crag.styles,
      approachMinutes: crag.approachMinutes,
      dryingTimeHours: crag.dryingTimeHours,
      face: crag.sunExposure
    };
  });

  // Sort by score desc, take top 3
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}