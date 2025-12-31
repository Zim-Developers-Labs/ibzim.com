'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, Ruler } from 'lucide-react';

interface City {
  name: string;
  lat: number;
  lng: number;
}

const zimbabweanCities: City[] = [
  { name: 'Beitbridge', lat: -22.2167, lng: 30.0 },
  { name: 'Bindura', lat: -17.3019, lng: 31.3275 },
  { name: 'Bulawayo', lat: -20.1594, lng: 28.5906 },
  { name: 'Chimanimani', lat: -19.8, lng: 32.8667 },
  { name: 'Chinhoyi', lat: -17.3667, lng: 30.2 },
  { name: 'Chiredzi', lat: -21.05, lng: 31.6667 },
  { name: 'Chitungwiza', lat: -18.013, lng: 31.072 },
  { name: 'Gweru', lat: -19.45, lng: 29.8167 },
  { name: 'Harare', lat: -17.8292, lng: 31.0522 },
  { name: 'Hwange', lat: -18.3667, lng: 26.5 },
  { name: 'Kadoma', lat: -18.3333, lng: 29.9167 },
  { name: 'Kariba', lat: -16.5167, lng: 28.8 },
  { name: 'Karoi', lat: -16.8167, lng: 29.6833 },
  { name: 'Kwekwe', lat: -18.9167, lng: 29.8167 },
  { name: 'Marondera', lat: -18.1851, lng: 31.5519 },
  { name: 'Masvingo', lat: -20.0637, lng: 30.8267 },
  { name: 'Mutare', lat: -18.9707, lng: 32.6473 },
  { name: 'Nyanga', lat: -18.2167, lng: 32.75 },
  { name: 'Plumtree', lat: -20.4833, lng: 27.8167 },
  { name: 'Rusape', lat: -18.5333, lng: 32.1333 },
  { name: 'Vic Falls', lat: -17.9243, lng: 25.8572 },
  { name: 'Zvishavane', lat: -20.3333, lng: 30.0333 },
];

const manualRoadDistances: { [key: string]: { [key: string]: number } } = {
  Beitbridge: {
    Beitbridge: 0,
    Bindura: 670,
    Bulawayo: 322,
    Chimanimani: 461,
    Chinhoyi: 698,
    Chiredzi: 203,
    Gweru: 472,
    Harare: 582,
    Hwange: 658,
    Kadoma: 606,
    Kariba: 947,
    Karoi: 786,
    Kwekwe: 534,
    Marondera: 656,
    Masvingo: 289,
    Mutare: 586,
    Nyanga: 693,
    Plumtree: 424,
    Rusape: 597,
    'Vic Falls': 759,
  },
  Bindura: {
    Beitbridge: 670,
    Bindura: 0,
    Bulawayo: 527,
    Chimanimani: 478,
    Chinhoyi: 204,
    Chiredzi: 583,
    Gweru: 390,
    Harare: 88,
    Hwange: 865,
    Kadoma: 229,
    Kariba: 453,
    Karoi: 292,
    Kwekwe: 301,
    Marondera: 162,
    Masvingo: 381,
    Mutare: 353,
    Nyanga: 360,
    Plumtree: 629,
    Rusape: 268,
    'Vic Falls': 964,
  },
  Bulawayo: {
    Beitbridge: 322,
    Bindura: 527,
    Bulawayo: 0,
    Chimanimani: 454,
    Chinhoyi: 555,
    Chiredzi: 484,
    Gweru: 164,
    Harare: 439,
    Hwange: 337,
    Kadoma: 298,
    Kariba: 804,
    Karoi: 643,
    Kwekwe: 226,
    Marondera: 523,
    Masvingo: 282,
    Mutare: 597,
    Nyanga: 686,
    Plumtree: 102,
    Rusape: 609,
    'Vic Falls': 437,
  },
  Chimanimani: {
    Beitbridge: 461,
    Bindura: 478,
    Bulawayo: 454,
    Chimanimani: 0,
    Chinhoyi: 552,
    Chiredzi: 225,
    Gweru: 461,
    Harare: 416,
    Hwange: 789,
    Kadoma: 489,
    Kariba: 781,
    Karoi: 594,
    Kwekwe: 523,
    Marondera: 513,
    Masvingo: 278,
    Mutare: 151,
    Nyanga: 258,
    Plumtree: 662,
    Rusape: 246,
    'Vic Falls': 891,
  },
  Chinhoyi: {
    Beitbridge: 698,
    Bindura: 204,
    Bulawayo: 555,
    Chimanimani: 552,
    Chinhoyi: 0,
    Chiredzi: 611,
    Gweru: 391,
    Harare: 116,
    Hwange: 769,
    Kadoma: 257,
    Kariba: 249,
    Karoi: 88,
    Kwekwe: 299,
    Marondera: 611,
    Masvingo: 409,
    Mutare: 381,
    Nyanga: 388,
    Plumtree: 657,
    Rusape: 286,
    'Vic Falls': 992,
  },
  Chiredzi: {
    Beitbridge: 203,
    Bindura: 583,
    Bulawayo: 484,
    Chimanimani: 225,
    Chinhoyi: 611,
    Chiredzi: 0,
    Gweru: 385,
    Harare: 495,
    Hwange: 896,
    Kadoma: 557,
    Kariba: 860,
    Karoi: 620,
    Kwekwe: 447,
    Marondera: 342,
    Masvingo: 203,
    Mutare: 325,
    Nyanga: 432,
    Plumtree: 586,
    Rusape: 381,
    'Vic Falls': 997,
  },
  Gweru: {
    Beitbridge: 472,
    Bindura: 390,
    Bulawayo: 164,
    Chimanimani: 461,
    Chinhoyi: 391,
    Chiredzi: 385,
    Gweru: 0,
    Harare: 275,
    Hwange: 501,
    Kadoma: 134,
    Kariba: 640,
    Karoi: 479,
    Kwekwe: 62,
    Marondera: 299,
    Masvingo: 183,
    Mutare: 480,
    Nyanga: 547,
    Plumtree: 266,
    Rusape: 445,
    'Vic Falls': 601,
  },
  Harare: {
    Beitbridge: 582,
    Bindura: 88,
    Bulawayo: 439,
    Chimanimani: 416,
    Chinhoyi: 116,
    Chiredzi: 495,
    Gweru: 275,
    Harare: 0,
    Hwange: 776,
    Kadoma: 141,
    Kariba: 365,
    Karoi: 204,
    Kwekwe: 213,
    Marondera: 72,
    Masvingo: 293,
    Mutare: 265,
    Nyanga: 272,
    Plumtree: 541,
    Rusape: 180,
    'Vic Falls': 876,
  },
  Hwange: {
    Beitbridge: 658,
    Bindura: 865,
    Bulawayo: 337,
    Chimanimani: 789,
    Chinhoyi: 769,
    Chiredzi: 896,
    Gweru: 501,
    Harare: 776,
    Hwange: 0,
    Kadoma: 635,
    Kariba: 1080,
    Karoi: 980,
    Kwekwe: 563,
    Marondera: 850,
    Masvingo: 617,
    Mutare: 906,
    Nyanga: 849,
    Plumtree: 437,
    Rusape: 755,
    'Vic Falls': 102,
  },
  Kadoma: {
    Beitbridge: 606,
    Bindura: 229,
    Bulawayo: 298,
    Chimanimani: 489,
    Chinhoyi: 257,
    Chiredzi: 557,
    Gweru: 134,
    Harare: 141,
    Hwange: 635,
    Kadoma: 0,
    Kariba: 506,
    Karoi: 345,
    Kwekwe: 72,
    Marondera: 519,
    Masvingo: 617,
    Mutare: 406,
    Nyanga: 413,
    Plumtree: 400,
    Rusape: 311,
    'Vic Falls': 735,
  },
  Kariba: {
    Beitbridge: 947,
    Bindura: 453,
    Bulawayo: 804,
    Chimanimani: 781,
    Chinhoyi: 249,
    Chiredzi: 860,
    Gweru: 640,
    Harare: 365,
    Hwange: 1080,
    Kadoma: 506,
    Kariba: 0,
    Karoi: 161,
    Kwekwe: 578,
    Marondera: 439,
    Masvingo: 658,
    Mutare: 630,
    Nyanga: 637,
    Plumtree: 906,
    Rusape: 535,
    'Vic Falls': 1241,
  },
  Karoi: {
    Beitbridge: 786,
    Bindura: 292,
    Bulawayo: 643,
    Chimanimani: 594,
    Chinhoyi: 88,
    Chiredzi: 620,
    Gweru: 479,
    Harare: 204,
    Hwange: 980,
    Kadoma: 345,
    Kariba: 161,
    Karoi: 0,
    Kwekwe: 417,
    Marondera: 278,
    Masvingo: 497,
    Mutare: 469,
    Nyanga: 476,
    Plumtree: 745,
    Rusape: 374,
    'Vic Falls': 1080,
  },
  Kwekwe: {
    Beitbridge: 534,
    Bindura: 301,
    Bulawayo: 226,
    Chimanimani: 523,
    Chinhoyi: 299,
    Chiredzi: 447,
    Gweru: 62,
    Harare: 213,
    Hwange: 563,
    Kadoma: 72,
    Kariba: 578,
    Karoi: 417,
    Kwekwe: 0,
    Marondera: 563,
    Masvingo: 345,
    Mutare: 478,
    Nyanga: 485,
    Plumtree: 328,
    Rusape: 383,
    'Vic Falls': 663,
  },
  Marondera: {
    Beitbridge: 656,
    Bindura: 162,
    Bulawayo: 523,
    Chimanimani: 513,
    Chinhoyi: 611,
    Chiredzi: 342,
    Gweru: 299,
    Harare: 72,
    Hwange: 850,
    Kadoma: 519,
    Kariba: 439,
    Karoi: 278,
    Kwekwe: 563,
    Marondera: 0,
    Masvingo: 488,
    Mutare: 191,
    Nyanga: 198,
    Plumtree: 615,
    Rusape: 106,
    'Vic Falls': 950,
  },
  Masvingo: {
    Beitbridge: 289,
    Bindura: 381,
    Bulawayo: 282,
    Chimanimani: 278,
    Chinhoyi: 409,
    Chiredzi: 203,
    Gweru: 183,
    Harare: 293,
    Hwange: 617,
    Kadoma: 617,
    Kariba: 658,
    Karoi: 497,
    Kwekwe: 345,
    Marondera: 488,
    Masvingo: 0,
    Mutare: 297,
    Nyanga: 413,
    Plumtree: 400,
    Rusape: 317,
    'Vic Falls': 1016,
  },
  Mutare: {
    Beitbridge: 586,
    Bindura: 353,
    Bulawayo: 597,
    Chimanimani: 151,
    Chinhoyi: 381,
    Chiredzi: 325,
    Gweru: 480,
    Harare: 265,
    Hwange: 906,
    Kadoma: 406,
    Kariba: 630,
    Karoi: 469,
    Kwekwe: 478,
    Marondera: 191,
    Masvingo: 297,
    Mutare: 0,
    Nyanga: 107,
    Plumtree: 680,
    Rusape: 85,
    'Vic Falls': 1123,
  },
  Nyanga: {
    Beitbridge: 693,
    Bindura: 360,
    Bulawayo: 686,
    Chimanimani: 258,
    Chinhoyi: 388,
    Chiredzi: 432,
    Gweru: 547,
    Harare: 272,
    Hwange: 849,
    Kadoma: 413,
    Kariba: 637,
    Karoi: 476,
    Kwekwe: 485,
    Marondera: 198,
    Masvingo: 413,
    Mutare: 107,
    Nyanga: 0,
    Plumtree: 813,
    Rusape: 102,
    'Vic Falls': 949,
  },
  Plumtree: {
    Beitbridge: 424,
    Bindura: 629,
    Bulawayo: 102,
    Chimanimani: 662,
    Chinhoyi: 657,
    Chiredzi: 586,
    Gweru: 266,
    Harare: 541,
    Hwange: 437,
    Kadoma: 400,
    Kariba: 906,
    Karoi: 745,
    Kwekwe: 328,
    Marondera: 615,
    Masvingo: 400,
    Mutare: 680,
    Nyanga: 813,
    Plumtree: 0,
    Rusape: 711,
    'Vic Falls': 539,
  },
  Rusape: {
    Beitbridge: 597,
    Bindura: 268,
    Bulawayo: 609,
    Chimanimani: 246,
    Chinhoyi: 286,
    Chiredzi: 381,
    Gweru: 445,
    Harare: 180,
    Hwange: 755,
    Kadoma: 311,
    Kariba: 535,
    Karoi: 374,
    Kwekwe: 383,
    Marondera: 106,
    Masvingo: 317,
    Mutare: 85,
    Nyanga: 102,
    Plumtree: 711,
    Rusape: 0,
    'Vic Falls': 855,
  },
  'Vic Falls': {
    Beitbridge: 759,
    Bindura: 964,
    Bulawayo: 437,
    Chimanimani: 891,
    Chinhoyi: 992,
    Chiredzi: 997,
    Gweru: 601,
    Harare: 876,
    Hwange: 102,
    Kadoma: 735,
    Kariba: 1241,
    Karoi: 1080,
    Kwekwe: 663,
    Marondera: 950,
    Masvingo: 1016,
    Mutare: 1123,
    Nyanga: 949,
    Plumtree: 539,
    Rusape: 855,
    'Vic Falls': 0,
  },
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Variant configurations
const imageVariants = [
  {
    id: 'standard-distance-table',
    name: 'Standard Distance Table',
    shortName: 'Standard',
    description:
      'A clean and simple distance table image showing distances between major Zimbabwean cities.',
  },
  {
    id: 'colorful-distance-table',
    name: 'Colorful Distance Table',
    shortName: 'Colorful',
    description:
      'A vibrant distance table image with color-coded distances for better visual distinction.',
  },
  {
    id: 'compact-distance-table',
    name: 'Compact Distance Table',
    shortName: 'Compact',
    description:
      'A compact distance table image optimized for quick reference and easy sharing.',
  },
  {
    id: 'full-distance-table',
    name: 'Full Distance Table',
    shortName: 'Full',
    description: 'A comprehensive distance table image with full square.',
  },
];

// Subset of cities for compact/standard variants (10 major cities)
const compactCities = [
  'Harare',
  'Bulawayo',
  'Mutare',
  'Gweru',
  'Masvingo',
  'Kwekwe',
  'Kadoma',
  'Chinhoyi',
  'Vic Falls',
  'Kariba',
];

// Full list of cities for full variant
const fullCities = [
  'Beitbridge',
  'Bindura',
  'Bulawayo',
  'Chimanimani',
  'Chinhoyi',
  'Chiredzi',
  'Gweru',
  'Harare',
  'Hwange',
  'Kadoma',
  'Kariba',
  'Karoi',
  'Kwekwe',
  'Marondera',
  'Masvingo',
  'Mutare',
  'Nyanga',
  'Plumtree',
  'Rusape',
  'Vic Falls',
];

export default function DistanceTablePage() {
  const [activeVariant, setActiveVariant] = useState('standard-distance-table');
  const [useRoadDistance, setUseRoadDistance] = useState<boolean>(true);
  const [distanceMatrix, setDistanceMatrix] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const matrix: { [key: string]: { [key: string]: number } } = {};
    zimbabweanCities.forEach((city1) => {
      matrix[city1.name] = {};
      zimbabweanCities.forEach((city2) => {
        if (city1.name === city2.name) {
          matrix[city1.name][city2.name] = 0;
        } else {
          matrix[city1.name][city2.name] = calculateDistance(
            city1.lat,
            city1.lng,
            city2.lat,
            city2.lng,
          );
        }
      });
    });
    setDistanceMatrix(matrix);
  }, []);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (rowIndex !== colIndex) {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 200) return 'bg-emerald-100 text-emerald-800';
    if (distance <= 400) return 'bg-sky-100 text-sky-800';
    if (distance <= 600) return 'bg-amber-100 text-amber-800';
    if (distance <= 800) return 'bg-orange-100 text-orange-800';
    return 'bg-rose-100 text-rose-800';
  };

  // Standard Variant - clean, simple triangular table
  const StandardTable = () => {
    const cities = fullCities;
    const activeMatrix = useRoadDistance ? manualRoadDistances : distanceMatrix;

    return (
      <div className="w-full">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {cities.map((fromCity, rowIndex) => (
              <tr key={fromCity}>
                {cities.slice(0, rowIndex).map((toCity, colIndex) => (
                  <td
                    key={toCity}
                    className={`cursor-pointer border border-gray-400 p-0.5 text-center transition-colors hover:bg-gray-100 ${
                      selectedCell?.row === rowIndex &&
                      selectedCell?.col === colIndex
                        ? 'bg-blue-200'
                        : selectedCell?.row === rowIndex ||
                            selectedCell?.col === colIndex
                          ? 'bg-blue-50'
                          : 'bg-white'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <span className="font-mono text-[12px]">
                      {activeMatrix[fromCity]?.[toCity]?.toFixed(0) || '-'}
                    </span>
                  </td>
                ))}
                <td className="border-none border-gray-300 bg-transparent p-0.5 text-[12px] font-medium whitespace-nowrap">
                  {fromCity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Colorful Variant - color-coded by distance ranges
  const ColorfulTable = () => {
    const cities = fullCities;
    const activeMatrix = useRoadDistance ? manualRoadDistances : distanceMatrix;

    return (
      <div className="w-full">
        <div className="mb-4 flex flex-wrap gap-2 text-[12px]">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border bg-emerald-100"></span>0-200
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border bg-sky-100"></span>201-400
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border bg-amber-100"></span>401-600
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border bg-orange-100"></span>
            601-800
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border bg-rose-100"></span>800+
          </span>
        </div>
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {cities.map((fromCity, rowIndex) => (
              <tr key={fromCity}>
                {cities.slice(0, rowIndex).map((toCity, colIndex) => {
                  const distance = activeMatrix[fromCity]?.[toCity] || 0;
                  return (
                    <td
                      key={toCity}
                      className={`cursor-pointer border border-gray-200 p-0.5 text-center transition-all hover:scale-105 ${getDistanceColor(distance)}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      <span className="font-mono text-[12px] font-semibold">
                        {distance?.toFixed(0) || '-'}
                      </span>
                    </td>
                  );
                })}
                <td className="border border-gray-300 bg-slate-700 p-0.5 text-[10px] font-medium whitespace-nowrap text-white">
                  {fromCity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Compact Variant - minimal, optimized for small spaces
  const CompactTable = () => {
    const cities = compactCities.slice(0, 8); // Even fewer cities for compact
    const activeMatrix = useRoadDistance ? manualRoadDistances : distanceMatrix;

    return (
      <div className="w-full">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {cities.map((fromCity, rowIndex) => (
              <tr key={fromCity}>
                {cities.slice(0, rowIndex).map((toCity, colIndex) => (
                  <td
                    key={toCity}
                    className="cursor-pointer border border-gray-300 bg-gray-50 p-1 text-center hover:bg-gray-200"
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <span className="font-mono text-[20px] font-medium">
                      {activeMatrix[fromCity]?.[toCity]?.toFixed(0) || '-'}
                    </span>
                  </td>
                ))}
                <td className="border border-gray-400 bg-slate-800 p-1 text-center text-[20px] font-bold whitespace-nowrap text-white">
                  {fromCity.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 grid grid-cols-4 gap-1 text-[20px] text-gray-500">
          {cities.map((c) => (
            <span key={c}>
              {c.slice(0, 3).toUpperCase()} = {c}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Full Variant - complete square matrix with all cities
  const FullTable = () => {
    const cities = fullCities;
    const activeMatrix = useRoadDistance ? manualRoadDistances : distanceMatrix;

    return (
      <div className="w-full overflow-visible">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-slate-700 p-0.5 text-[11px] text-white"></th>
              {cities.map((city) => (
                <th
                  key={city}
                  className="border border-gray-300 bg-slate-700 p-0.5 text-[11px] font-medium text-white"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    height: '100px',
                  }}
                >
                  {city}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((fromCity, rowIndex) => (
              <tr key={fromCity}>
                <td className="border border-gray-300 bg-slate-700 p-0.5 text-[10px] font-medium whitespace-nowrap text-white">
                  {fromCity}
                </td>
                {cities.map((toCity, colIndex) => {
                  const distance =
                    rowIndex === colIndex
                      ? 0
                      : activeMatrix[fromCity]?.[toCity];
                  const isAboveDiagonal = colIndex > rowIndex;
                  return (
                    <td
                      key={toCity}
                      className={`border border-gray-200 p-0 text-center ${
                        rowIndex === colIndex
                          ? 'bg-slate-300'
                          : isAboveDiagonal
                            ? 'bg-gray-100'
                            : 'bg-white'
                      }`}
                    >
                      <span className="font-mono text-[12px]">
                        {distance?.toFixed(0) || '-'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderVariant = () => {
    switch (activeVariant) {
      case 'standard-distance-table':
        return <StandardTable />;
      case 'colorful-distance-table':
        return <ColorfulTable />;
      case 'compact-distance-table':
        return <CompactTable />;
      case 'full-distance-table':
        return <FullTable />;
      default:
        return <StandardTable />;
    }
  };

  const currentVariant = imageVariants.find((v) => v.id === activeVariant);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{currentVariant?.name}</CardTitle>
            <CardDescription className="text-xs">
              {currentVariant?.description}
            </CardDescription>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={activeVariant}
                onValueChange={setActiveVariant}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid h-8 grid-cols-4">
                  {imageVariants.map((variant) => (
                    <TabsTrigger
                      key={variant.id}
                      value={variant.id}
                      className="px-2 text-[10px]"
                    >
                      {variant.shortName}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-1.5">
                <div className="flex items-center gap-1">
                  <Ruler className="text-muted-foreground h-3 w-3" />
                  <span
                    className={`text-[10px] ${!useRoadDistance ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    Straight
                  </span>
                </div>
                <Switch
                  checked={useRoadDistance}
                  onCheckedChange={setUseRoadDistance}
                  className="scale-75"
                />
                <div className="flex items-center gap-1">
                  <Route className="text-muted-foreground h-3 w-3" />
                  <span
                    className={`text-[10px] ${useRoadDistance ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    Road
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderVariant()}
            <p className="mt-3 text-[9px] text-gray-500">
              Distances in kilometers.{' '}
              {useRoadDistance
                ? 'Road distances based on official Zimbabwe Distance Chart.'
                : 'Straight-line distances calculated between city centers.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
