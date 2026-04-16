import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ClimberProfile, Crag } from '@/lib/types';
import { getWeather } from '@/lib/weather';
import { recommendCrags } from '@/lib/scoring';

const gradeOrder = [
  'VD', 'S', 'HS', 'VS', 'HVS', 'E1', 'E2', 'E3', 'E4', 'E5',
  '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d'
];

function gradeIndex(grade: string): number {
  const cleanGrade = grade.replace(/ .*/, ''); // remove suffix like 5b
  return gradeOrder.indexOf(cleanGrade) !== -1 ? gradeOrder.indexOf(cleanGrade) : -1;
}

export async function POST(request: NextRequest) {
  try {
    const { climber, partner, date, preferredTypes }: { climber: ClimberProfile; partner: ClimberProfile; date: string; preferredTypes: string[] } = await request.json();

    // Load crags from JSON
    const cragsPath = path.join(process.cwd(), 'data', 'llanberis.json');
    const cragsData = await fs.readFile(cragsPath, 'utf-8');
    const cragData = JSON.parse(cragsData);
    // Transform to expected format
    const crags: Crag[] = [{
      id: cragData.crag.id,
      name: cragData.crag.name,
      location: `${cragData.crag.location.area}, ${cragData.crag.location.country}`,
      type: [...new Set(cragData.crag.routes.map((r: any) => r.type))] as ("bouldering" | "sport" | "trad")[],
      grades: {
        min: cragData.crag.routes.reduce((min: string, r: any) => gradeIndex(r.grade) < gradeIndex(min) ? r.grade : min, cragData.crag.routes[0].grade),
        max: cragData.crag.routes.reduce((max: string, r: any) => gradeIndex(r.grade) > gradeIndex(max) ? r.grade : max, cragData.crag.routes[0].grade),
      },
      styles: cragData.crag.style,
      rockType: cragData.crag.rockType,
      sunExposure: cragData.crag.aspect === 'south' ? 'S' : 'N', // simplify
      forestCover: false, // assume
      dryingTimeHours: cragData.crag.dryingSpeed === 'fast' ? 2 : 4,
      approachMinutes: cragData.crag.approachTimeMin,
    }];

    // Get weather
    const weather = getWeather(date);

    // Compute weather icon
    let weatherIcon = '☀️';
    if (weather.rainProbability > 20 || weather.precipitation > 0) {
      weatherIcon = '🌧️';
    } else if (weather.humidity > 80) {
      weatherIcon = '☁️';
    }

    // Recommend
    const recommendations = recommendCrags(climber, partner, weather, crags, preferredTypes);

    return NextResponse.json({ recommendations, weatherIcon, windDirection: weather.windDirection });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}