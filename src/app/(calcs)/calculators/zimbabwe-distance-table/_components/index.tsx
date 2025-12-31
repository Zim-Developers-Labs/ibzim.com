'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { DialogFooter } from '@/components/ui/dialog';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calculator,
  ArrowRightLeft,
  Fuel,
  Edit3,
  Check,
  Clock,
  AlertTriangle,
  Zap,
  Download,
  Route,
  Ruler,
} from 'lucide-react';
import Container from '@/components/container';
import Image from 'next/image';

interface City {
  name: string;
  lat: number;
  lng: number;
}

const zimbabweanCities: City[] = [
  { name: 'Beitbridge', lat: -22.2167, lng: 30.0 },
  { name: 'Bindura', lat: -17.3019, lng: 31.3275 },
  { name: 'Birchenough Bridge', lat: -19.9833, lng: 32.35 },
  { name: 'Bulawayo', lat: -20.1594, lng: 28.5906 },
  { name: 'Chegutu', lat: -18.1333, lng: 30.15 },
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
  { name: 'Victoria Falls', lat: -17.9243, lng: 25.8572 },
  { name: 'Zvishavane', lat: -20.3333, lng: 30.0333 },
];

// Road distances in km between major cities (symmetric matrix)
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
    'Victoria Falls': 759,
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
    'Victoria Falls': 964,
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
    'Victoria Falls': 437,
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
    'Victoria Falls': 891,
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
    'Victoria Falls': 992,
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
    'Victoria Falls': 997,
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
    'Victoria Falls': 601,
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
    'Victoria Falls': 876,
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
    'Victoria Falls': 102,
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
    'Victoria Falls': 735,
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
    'Victoria Falls': 1241,
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
    'Victoria Falls': 1080,
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
    'Victoria Falls': 663,
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
    'Victoria Falls': 950,
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
    'Victoria Falls': 1016,
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
    'Victoria Falls': 1123,
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
    'Victoria Falls': 949,
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
    'Victoria Falls': 539,
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
    'Victoria Falls': 855,
  },
  'Victoria Falls': {
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
    'Victoria Falls': 0,
  },
};

export default function DistanceTableComponents() {
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isFromTable, setIsFromTable] = useState(false);
  const [fuelPrice, setFuelPrice] = useState<number>(1.5); // Default fuel price in USD per liter
  const [fuelConsumption, setFuelConsumption] = useState<number>(10); // Default km per liter
  const [averageSpeed, setAverageSpeed] = useState<number>(70); // Default average speed in km/h
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isHybridCar, setIsHybridCar] = useState<boolean>(false);
  const [useRoadDistance, setUseRoadDistance] = useState<boolean>(true);

  // Pre-calculated distance matrix for better performance
  const [distanceMatrix, setDistanceMatrix] = useState<{
    [key: string]: { [key: string]: number };
  }>({});

  // Calculate distance matrix on component mount
  useEffect(() => {
    const matrix: { [key: string]: { [key: string]: number } } = {};

    zimbabweanCities.forEach((city1) => {
      matrix[city1.name] = {};
      zimbabweanCities.forEach((city2) => {
        if (city1.name === city2.name) {
          matrix[city1.name][city2.name] = 0;
        } else {
          const dist = calculateDistance(
            city1.lat,
            city1.lng,
            city2.lat,
            city2.lng,
          );
          matrix[city1.name][city2.name] = dist;
        }
      });
    });

    setDistanceMatrix(matrix);
  }, []);

  // Update fuel consumption when hybrid mode changes
  useEffect(() => {
    if (isHybridCar) {
      setFuelConsumption(16); // Better efficiency for hybrid cars
    } else {
      setFuelConsumption(10); // Regular car efficiency
    }
  }, [isHybridCar]);

  // Calculate fuel cost based on distance and fuel price
  const calculateFuelCost = (
    distanceKm: number,
    pricePerLiter: number,
    kmPerLiter: number,
  ) => {
    const litersNeeded = distanceKm / kmPerLiter;
    return litersNeeded * pricePerLiter;
  };

  // Calculate travel time and format it
  const calculateTravelTime = (distanceKm: number, speedKmh: number) => {
    const hours = distanceKm / speedKmh;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (wholeHours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}min`;
    }
  };

  const handleCalculate = () => {
    if (!fromCity || !toCity) return;

    const city1 = zimbabweanCities.find((city) => city.name === fromCity);
    const city2 = zimbabweanCities.find((city) => city.name === toCity);

    if (!city1 || !city2) return;

    setIsCalculating(true);
    setIsFromTable(false);

    setTimeout(() => {
      const straightLineDist = calculateDistance(
        city1.lat,
        city1.lng,
        city2.lat,
        city2.lng,
      );
      let finalDist: number;
      if (useRoadDistance) {
        finalDist =
          manualRoadDistances[city1.name]?.[city2.name] ?? straightLineDist;
      } else {
        finalDist = straightLineDist;
      }
      setDistance(finalDist);
      setIsCalculating(false);
    }, 300);
  };

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    // Clear distance if swapping, unless it was from table click
    if (!isFromTable) {
      setDistance(null);
    }
  };

  const handleReset = () => {
    setFromCity('');
    setToCity('');
    setDistance(null);
    setSelectedCell(null);
    setIsFromTable(false);
  };

  const toggleSettingsEditing = () => {
    setIsEditingSettings(!isEditingSettings);
  };

  const handleReportInaccuracy = () => {
    if (!fromCity || !toCity || distance === null || !reportReason.trim()) {
      return;
    }

    const currentDate = new Date().toLocaleString();
    const message = `Travel Planner Inaccuracy Report

Route: ${fromCity} to ${toCity}
Calculated Distance: ${distance.toFixed(0)} km
Issue: ${reportReason.trim()}
Reported: ${currentDate}

Please review this calculation for accuracy.`;

    const whatsappUrl = `https://wa.me/263717238876?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Reset and close dialog
    setReportReason('');
    setIsReportDialogOpen(false);
  };

  const canCalculate = fromCity && toCity && fromCity !== toCity;
  const canReport =
    fromCity && toCity && distance !== null && reportReason.trim().length > 0;

  const DistanceTable = () => {
    const majorCities = [
      'Beitbridge',
      'Bindura',
      'Bulawayo',
      'Chimanimani',
      'Chinhoyi',
      'Chiredzi',
      'Chitungwiza',
      'Gweru',
      'Harare',
      'Hwange',
      'Kadoma',
      'Kariba',
      'Kwekwe',
      'Marondera',
      'Masvingo',
      'Mutare',
      'Nyanga',
      'Plumtree',
      'Rusape',
      'Victoria Falls',
      'Zvishavane',
    ];

    const citiesWithoutRoadData = ['Chitungwiza', 'Zvishavane'];

    const displayCities = useRoadDistance
      ? majorCities.filter((city) => !citiesWithoutRoadData.includes(city))
      : majorCities;

    const touristDestinations = [
      'Victoria Falls',
      'Hwange',
      'Kariba',
      'Masvingo',
      'Bulawayo',
    ];

    const handleCellClick = (rowIndex: number, colIndex: number) => {
      if (rowIndex !== colIndex) {
        setSelectedCell({ row: rowIndex, col: colIndex });

        const fromCityName = displayCities[rowIndex];
        const toCityName = displayCities[colIndex];
        let cellDistance: number;
        if (useRoadDistance) {
          cellDistance =
            manualRoadDistances[fromCityName]?.[toCityName] ??
            distanceMatrix[fromCityName]?.[toCityName] ??
            0;
        } else {
          cellDistance = distanceMatrix[fromCityName]?.[toCityName] ?? 0;
        }

        setFromCity(fromCityName);
        setToCity(toCityName);
        setDistance(cellDistance || null);
        setIsFromTable(true);
      }
    };

    const isTouristDestinationFromHarare = (
      rowIndex: number,
      colIndex: number,
    ) => {
      const fromCityName = displayCities[rowIndex];
      const toCityName = displayCities[colIndex];
      return (
        (fromCityName === 'Harare' &&
          touristDestinations.includes(toCityName)) ||
        (toCityName === 'Harare' && touristDestinations.includes(fromCityName))
      );
    };

    const getCellStyle = (rowIndex: number, colIndex: number) => {
      const isTourist = isTouristDestinationFromHarare(rowIndex, colIndex);

      if (!selectedCell) {
        return isTourist ? 'bg-teal-100 border-teal-200' : '';
      }

      const isSelectedCell =
        selectedCell.row === rowIndex && selectedCell.col === colIndex;
      const isSelectedRow = selectedCell.row === rowIndex;
      const isSelectedCol = selectedCell.col === colIndex;

      if (isSelectedCell) {
        return 'bg-blue-200 border-blue-300';
      } else if (isSelectedRow || isSelectedCol) {
        return isTourist
          ? 'bg-teal-100 border-teal-200'
          : 'bg-blue-50 border-blue-100';
      }
      return isTourist ? 'bg-teal-100 border-teal-200' : '';
    };

    return (
      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle className="text-lg">
              Zimbabwe Distance Table Chart (km)
            </CardTitle>
            <CardDescription>
              Distances between major Zimbabwean cities - Click on any distance
              to see details above
            </CardDescription>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded border border-teal-300 bg-teal-100"></div>
                <span className="text-muted-foreground">
                  Key tourist destinations from Harare
                </span>
              </div>
              <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-2">
                <div className="flex items-center gap-1.5">
                  <Ruler className="text-muted-foreground h-4 w-4" />
                  <span
                    className={`text-sm ${!useRoadDistance ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    Straight Line
                  </span>
                </div>
                <Switch
                  checked={useRoadDistance}
                  onCheckedChange={setUseRoadDistance}
                  aria-label="Toggle between road and straight-line distances"
                />
                <div className="flex items-center gap-1.5">
                  <Route className="text-muted-foreground h-4 w-4" />
                  <span
                    className={`text-sm ${useRoadDistance ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    Road
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="relative w-full text-sm">
              <tbody>
                {displayCities.map((fromCity, rowIndex) => (
                  <tr key={fromCity}>
                    {displayCities
                      .slice(0, rowIndex)
                      .map((toCity, colIndex) => {
                        const activeMatrix = useRoadDistance
                          ? manualRoadDistances
                          : distanceMatrix;
                        return (
                          <td
                            key={toCity}
                            className={`w-[40px] max-w-[40px] min-w-[40px] cursor-pointer border p-2 text-center transition-colors ${getCellStyle(rowIndex, colIndex)}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                          >
                            <span
                              className={`font-mono hover:font-bold ${isTouristDestinationFromHarare(rowIndex, colIndex) ? 'font-semibold text-teal-700' : ''}`}
                            >
                              {activeMatrix[fromCity]?.[toCity]?.toFixed(0) ||
                                '...'}
                            </span>
                          </td>
                        );
                      })}
                    <td
                      className={`min-w-[40px w-[40px] max-w-[40px] border-none bg-transparent p-2 font-medium whitespace-nowrap ${
                        selectedCell?.row === rowIndex ||
                        selectedCell?.col === rowIndex
                          ? 'bg-blue-100'
                          : ''
                      }`}
                    >
                      {fromCity.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            {useRoadDistance ? (
              <>
                <p>
                  * Road distances are estimated based on official Zimbabwe
                  Distance Chart
                </p>
                <p>
                  * Actual driving distances may vary depending on specific
                  routes taken and road conditions
                </p>
              </>
            ) : (
              <>
                <p>
                  * Distances are calculated as straight-line distances between
                  city centers
                </p>
                <p>
                  * Actual driving distances will be longer depending on road
                  conditions and routes
                </p>
              </>
            )}
            <p>
              * Click on any distance to highlight the row and column and see
              details above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TravelPlanner = () => {
    return (
      <div className="space-y-6">
        {/* City Selection Row */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-end lg:gap-4 lg:space-y-0">
          {/* From City */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="from-city">From</Label>
            <Select
              value={fromCity}
              onValueChange={(value) => {
                setFromCity(value);
                setIsFromTable(false);
                setDistance(null);
              }}
            >
              <SelectTrigger id="from-city" className="w-full">
                <SelectValue placeholder="Select starting city" />
              </SelectTrigger>
              <SelectContent>
                {zimbabweanCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center lg:pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapCities}
              disabled={!fromCity && !toCity}
              className="rounded-full"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To City */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="to-city">To</Label>
            <Select
              value={toCity}
              onValueChange={(value) => {
                setToCity(value);
                setIsFromTable(false);
                setDistance(null);
              }}
            >
              <SelectTrigger id="to-city" className="w-full">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {zimbabweanCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            disabled={!canCalculate || isCalculating}
            className="flex-1"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {isCalculating ? 'Calculating...' : 'Calculate Distance'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Clear
          </Button>
        </div>

        {/* Results and Travel Settings Row */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:gap-4 lg:space-y-0">
          {/* Result - Always Visible */}
          <Card
            className={`flex-1 ${
              distance !== null && fromCity && toCity
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                {distance !== null && fromCity && toCity ? (
                  <>
                    <div className="mb-2 text-sm text-green-700">
                      Distance from <strong>{fromCity}</strong> to{' '}
                      <strong>{toCity}</strong>
                      {isFromTable && (
                        <span className="ml-2 text-xs">(from table)</span>
                      )}
                    </div>
                    <div className="mb-1 text-3xl font-bold text-green-800">
                      {distance.toFixed(0)} km
                    </div>
                    <div className="mb-3 text-sm text-green-600">
                      ({(distance * 0.621371).toFixed(0)} miles)
                    </div>

                    {/* Travel Time */}
                    {averageSpeed > 0 && (
                      <div className="mb-3 border-t pt-3">
                        <div className="mb-1 text-sm text-green-700">
                          Estimated Travel Time
                        </div>
                        <div className="text-xl font-bold text-green-800">
                          {calculateTravelTime(distance, averageSpeed)}
                        </div>
                        <div className="text-xs text-green-600">
                          at {averageSpeed} km/h average
                        </div>
                      </div>
                    )}

                    {/* Fuel Cost */}
                    {fuelPrice > 0 && fuelConsumption > 0 && (
                      <div className="mb-3 border-t pt-3">
                        <div className="mb-1 text-sm text-green-700">
                          Estimated Fuel Cost
                          {isHybridCar && (
                            <span className="ml-1 text-xs">(Hybrid)</span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-green-800">
                          $
                          {calculateFuelCost(
                            distance,
                            fuelPrice,
                            fuelConsumption,
                          ).toFixed(2)}
                        </div>
                        <div className="text-xs text-green-600">
                          ({(distance / fuelConsumption).toFixed(1)}L needed)
                        </div>
                      </div>
                    )}

                    {/* Report Inaccuracy Button */}
                    <div className="border-t pt-3">
                      <Dialog
                        open={isReportDialogOpen}
                        onOpenChange={setIsReportDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-xs"
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Report Inaccuracy
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              Report Distance Inaccuracy
                            </DialogTitle>
                            <DialogDescription>
                              Help us improve accuracy by reporting issues with
                              the calculated distance between{' '}
                              <strong>{fromCity}</strong> and{' '}
                              <strong>{toCity}</strong> ({distance.toFixed(0)}{' '}
                              km).
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="report-reason">
                                What seems inaccurate?
                              </Label>
                              <Textarea
                                id="report-reason"
                                placeholder="e.g., The actual driving distance is much longer due to road conditions, or the straight-line distance seems incorrect..."
                                value={reportReason}
                                onChange={(e) =>
                                  setReportReason(e.target.value)
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsReportDialogOpen(false);
                                setReportReason('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleReportInaccuracy}
                              disabled={!canReport}
                            >
                              Submit Report
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2 text-sm text-gray-500">
                      {fromCity && toCity && fromCity !== toCity
                        ? "Click 'Calculate Distance' to see results"
                        : 'Select two different cities or click a distance in the table below'}
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-400">
                      -- km
                    </div>
                    <div className="mb-3 text-sm text-gray-400">(-- miles)</div>

                    {/* Travel Time Placeholder */}
                    <div className="mb-3 border-t pt-3">
                      <div className="mb-1 text-sm text-gray-500">
                        Estimated Travel Time
                      </div>
                      <div className="text-xl font-bold text-gray-400">
                        --h --min
                      </div>
                      <div className="text-xs text-gray-400">
                        at -- km/h average
                      </div>
                    </div>

                    {/* Fuel Cost Placeholder */}
                    <div className="border-t pt-3">
                      <div className="mb-1 text-sm text-gray-500">
                        Estimated Fuel Cost
                      </div>
                      <div className="text-xl font-bold text-gray-400">$--</div>
                      <div className="text-xs text-gray-400">(--L needed)</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Travel Settings */}
          <Card className="lg:w-72">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4 text-orange-600" />
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <Label className="text-sm font-medium">
                      Travel Settings
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSettingsEditing}
                    className="h-8 w-8 bg-transparent p-0"
                  >
                    {isEditingSettings ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Edit3 className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Hybrid Car Switch */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <Label htmlFor="hybrid-mode" className="text-sm">
                      Hybrid Car
                    </Label>
                  </div>
                  <Switch
                    id="hybrid-mode"
                    checked={isHybridCar}
                    onCheckedChange={setIsHybridCar}
                    disabled={!isEditingSettings}
                  />
                </div>
                {isHybridCar && (
                  <div className="-mt-2 text-xs text-green-600">
                    Better fuel efficiency enabled
                  </div>
                )}

                {/* Average Speed */}
                <div className="space-y-2">
                  <Label htmlFor="average-speed" className="text-sm">
                    Average Speed
                  </Label>
                  <div className="relative">
                    <Input
                      id="average-speed"
                      type="number"
                      step="1"
                      min="1"
                      max="200"
                      value={averageSpeed}
                      onChange={(e) =>
                        setAverageSpeed(Number.parseFloat(e.target.value) || 70)
                      }
                      placeholder="70"
                      disabled={!isEditingSettings}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-gray-500">
                      km/h
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    kilometers per hour
                  </div>
                </div>

                {/* Fuel Price */}
                <div className="space-y-2">
                  <Label htmlFor="fuel-price" className="text-sm">
                    Fuel Price
                  </Label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm text-gray-500">
                      $
                    </span>
                    <Input
                      id="fuel-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={fuelPrice}
                      onChange={(e) =>
                        setFuelPrice(Number.parseFloat(e.target.value) || 0)
                      }
                      className="pl-7"
                      placeholder="0.00"
                      disabled={!isEditingSettings}
                    />
                  </div>
                  <div className="text-xs text-gray-600">USD per liter</div>
                </div>

                {/* Fuel Consumption */}
                <div className="space-y-2">
                  <Label htmlFor="fuel-consumption" className="text-sm">
                    Fuel Efficiency
                  </Label>
                  <div className="relative">
                    <Input
                      id="fuel-consumption"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={fuelConsumption}
                      onChange={(e) =>
                        setFuelConsumption(
                          Number.parseFloat(e.target.value) || 10,
                        )
                      }
                      placeholder="10"
                      disabled={!isEditingSettings}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-gray-500">
                      km/L
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {isHybridCar ? 'hybrid efficiency' : 'kilometers per liter'}
                  </div>
                </div>

                {!isEditingSettings && (
                  <div className="border-t pt-2 text-xs text-gray-500">
                    Click edit button to modify values
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Same city warning */}
        {fromCity && toCity && fromCity === toCity && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4">
              <div className="text-center text-sm text-yellow-700">
                Please select two different cities to calculate distance.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const DistanceTableImageDownload = () => {
    const [selectedImageId, setSelectedImageId] = useState<string>(
      'standard-distance-table',
    );
    const [useRoadDistanceImage, setUseRoadDistanceImage] =
      useState<boolean>(true);

    const imageVariants = [
      {
        id: 'standard-distance-table',
        name: 'Standard Distance Table',
        shortName: 'Standard',
        description:
          'A clean and simple distance table image showing distances between major Zimbabwean cities.',
        imageUrl: {
          road: '/assets/distance-tables/zimbabwe/standard-road.png',
          straightLine:
            '/assets/distance-tables/zimbabwe/standard-straight-line.png',
        },
      },
      {
        id: 'colorful-distance-table',
        name: 'Colorful Distance Table',
        shortName: 'Colorful',
        description:
          'A vibrant distance table image with color-coded distances for better visual distinction.',
        imageUrl: {
          road: '/assets/distance-tables/zimbabwe/colorful-road.png',
          straightLine:
            '/assets/distance-tables/zimbabwe/colorful-straight-line.png',
        },
      },
      {
        id: 'compact-distance-table',
        name: 'Compact Distance Table',
        shortName: 'Compact',
        description:
          'A compact distance table image optimized for quick reference and easy sharing.',
        imageUrl: {
          road: '/assets/distance-tables/zimbabwe/compact-road.png',
          straightLine:
            '/assets/distance-tables/zimbabwe/compact-straight-line.png',
        },
      },
      {
        id: 'full-distance-table',
        name: 'Full Distance Table',
        shortName: 'Full',
        description: 'A comprehensive distance table image with full square.',
        imageUrl: {
          road: '/assets/distance-tables/zimbabwe/full-road.png',
          straightLine:
            '/assets/distance-tables/zimbabwe/full-straight-line.png',
        },
      },
    ];

    const selectedVariant =
      imageVariants.find((v) => v.id === selectedImageId) || imageVariants[0];
    const currentImageUrl = useRoadDistanceImage
      ? selectedVariant.imageUrl.road
      : selectedVariant.imageUrl.straightLine;

    const handleDownload = async () => {
      try {
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `zimbabwe-distance-table-${selectedVariant.shortName.toLowerCase()}-${useRoadDistanceImage ? 'road' : 'straight-line'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        // Fallback: open image in new tab
        window.open(currentImageUrl, '_blank');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <Label className="mb-3 block text-sm font-medium">
            Select Table Style
          </Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {imageVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedImageId(variant.id)}
                className={`group hover:border-primary relative overflow-hidden rounded-lg border-2 p-2 transition-all ${
                  selectedImageId === variant.id
                    ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="bg-muted aspect-video overflow-hidden rounded-md">
                  <Image
                    src={
                      useRoadDistanceImage
                        ? variant.imageUrl.road
                        : variant.imageUrl.straightLine
                    }
                    alt={variant.name}
                    className="pointer-events-none h-full w-full object-cover transition-transform group-hover:scale-105"
                    height={191}
                    width={340}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">{variant.shortName}</div>
                </div>
                {selectedImageId === variant.id && (
                  <div className="bg-primary absolute top-1 right-1 rounded-full p-1">
                    <Check className="text-primary-foreground h-3 w-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {selectedVariant.description}
          </p>
        </div>

        <div className="bg-muted/30 flex flex-col items-center justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:gap-0">
          <div>
            <Label className="text-sm font-medium">Distance Type</Label>
            <p className="text-muted-foreground text-xs">
              Choose between road distances or straight-line calculations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Ruler className="text-muted-foreground h-4 w-4" />
              <span
                className={`text-sm ${!useRoadDistanceImage ? 'font-medium' : 'text-muted-foreground'}`}
              >
                Straight Line
              </span>
            </div>
            <Switch
              checked={useRoadDistanceImage}
              onCheckedChange={setUseRoadDistanceImage}
              aria-label="Toggle between road and straight-line distances"
            />
            <div className="flex items-center gap-1.5">
              <Route className="text-muted-foreground h-4 w-4" />
              <span
                className={`text-sm ${useRoadDistanceImage ? 'font-medium' : 'text-muted-foreground'}`}
              >
                Road
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            Selected:{' '}
            <span className="text-foreground font-medium">
              {selectedVariant.name}
            </span>
            {' · '}
            <span className="text-foreground font-medium">
              {useRoadDistanceImage
                ? 'Road Distances'
                : 'Straight-Line Distances'}
            </span>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download HD Image
          </Button>
        </div>
      </div>
    );
  };

  return (
    <main className="bg-zinc-50">
      <Container className="py-12">
        <div className="mb-6">
          <div className="mb-4 flex gap-3 sm:items-center">
            <Avatar className="h-16 w-16 rounded-md border border-zinc-300">
              <AvatarImage
                src="/assets/calc-logos/zinara.png"
                alt={`Distance Table Calculator ZINARA logo`}
              />
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Zimbabwe Distance Table</h1>
              <p className="text-muted-foreground">
                View distance between Zimbabwe locations and estimate travel
                costs including fuel and tolls.
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button asChild className="md:hidden">
              <Link href="#distance-table">Interactive Table</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link href="#distance-table">
                Download Image <Download className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="#travel-planner">Travel Planner</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          {/* Image Download - shown first on mobile via order classes */}
          <div className="order-1 mt-12 md:order-2" id="image-download">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-lg">
                    <h2>Zimbabwe Distance Table Image Download</h2>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      Select and customize your preferred distance table image
                      for download.
                    </p>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <DistanceTableImageDownload />
              </CardContent>
            </Card>
          </div>
          {/* Distance Table Chart - shown second on mobile via order classes */}
          <div id="distance-table" className="order-2 md:order-1">
            <DistanceTable />
          </div>
          {/* Travel Planner - always last in both views */}
          <div className="order-3 mt-12" id="travel-planner">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-lg">
                    <h2>Travel Planner Tool</h2>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      Calculate distances, fuel costs, and travel times between
                      Zimbabwean cities.
                    </p>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <TravelPlanner />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-12">
          <div className="mb-3 text-lg font-semibold">Other Calculators</div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href="/calculators/ecocash-charges"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/ecocash.png"
                  alt={`ZiG and USD Ecocash Calculator logo`}
                />
              </Avatar>
              Ecocash Calculator
            </Link>
            <Link
              href="/calculators/currency-converter"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zig.png"
                  alt={`ZiG/ZWL Currency Converter logo`}
                />
              </Avatar>
              Currency Converter
            </Link>
            <Link
              href="/calculators/zesa-units"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zesa.png"
                  alt={`ZESA logo`}
                />
              </Avatar>
              ZESA Calculator
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371; // Earth's radius in kilometers
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
};
