'use client';

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
  MapPin,
  Calculator,
  ArrowRightLeft,
  Fuel,
  Edit3,
  Check,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import ToolFAQs from '../faq';
import { User } from 'lucia';
import { Answer } from '@/server/db/schema';
interface City {
  name: string;
  lat: number;
  lng: number;
}

const zimbabweanCities: City[] = [
  { name: 'Harare', lat: -17.8292, lng: 31.0522 },
  { name: 'Bulawayo', lat: -20.1594, lng: 28.5906 },
  { name: 'Chitungwiza', lat: -18.013, lng: 31.072 },
  { name: 'Mutare', lat: -18.9707, lng: 32.6473 },
  { name: 'Gweru', lat: -19.45, lng: 29.8167 },
  { name: 'Kwekwe', lat: -18.9167, lng: 29.8167 },
  { name: 'Kadoma', lat: -18.3333, lng: 29.9167 },
  { name: 'Masvingo', lat: -20.0637, lng: 30.8267 },
  { name: 'Chinhoyi', lat: -17.3667, lng: 30.2 },
  { name: 'Marondera', lat: -18.1851, lng: 31.5519 },
  { name: 'Zvishavane', lat: -20.3333, lng: 30.0333 },
  { name: 'Bindura', lat: -17.3019, lng: 31.3275 },
  { name: 'Beitbridge', lat: -22.2167, lng: 30.0 },
  { name: 'Redcliff', lat: -19.0333, lng: 29.7833 },
  { name: 'Victoria Falls', lat: -17.9243, lng: 25.8572 },
  { name: 'Hwange', lat: -18.3667, lng: 26.5 },
  { name: 'Chegutu', lat: -18.1333, lng: 30.15 },
  { name: 'Shurugwi', lat: -19.6667, lng: 30.0 },
  { name: 'Kariba', lat: -16.5167, lng: 28.8 },
  { name: 'Karoi', lat: -16.8167, lng: 29.6833 },
];

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

export default function DistanceCalculatorWrapper({
  dbAnswers,
  user,
}: {
  user: User | null;
  dbAnswers: Answer[] | null;
}) {
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
      const dist = calculateDistance(
        city1.lat,
        city1.lng,
        city2.lat,
        city2.lng,
      );
      setDistance(dist);
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
    const message = `Distance Calculator Inaccuracy Report

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
      'Harare',
      'Bulawayo',
      'Chitungwiza',
      'Mutare',
      'Gweru',
      'Kwekwe',
      'Kadoma',
      'Masvingo',
      'Chinhoyi',
      'Marondera',
      'Zvishavane',
      'Bindura',
      'Beitbridge',
      'Victoria Falls',
      'Hwange',
      'Kariba',
    ];

    const handleCellClick = (rowIndex: number, colIndex: number) => {
      if (rowIndex !== colIndex) {
        // Don't allow clicking on diagonal cells
        setSelectedCell({ row: rowIndex, col: colIndex });

        // Get the cities and distance for this cell
        const fromCityName = majorCities[rowIndex];
        const toCityName = majorCities[colIndex];
        const cellDistance = distanceMatrix[fromCityName]?.[toCityName];

        // Update the result display
        setFromCity(fromCityName);
        setToCity(toCityName);
        setDistance(cellDistance || null);
        setIsFromTable(true);
      }
    };

    const getCellStyle = (rowIndex: number, colIndex: number) => {
      if (!selectedCell) return '';

      const isSelectedCell =
        selectedCell.row === rowIndex && selectedCell.col === colIndex;
      const isSelectedRow = selectedCell.row === rowIndex;
      const isSelectedCol = selectedCell.col === colIndex;

      if (isSelectedCell) {
        return 'bg-blue-200 border-blue-300';
      } else if (isSelectedRow || isSelectedCol) {
        return 'bg-blue-50 border-blue-100';
      }
      return '';
    };

    return (
      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle className="text-lg">Distance Table (km)</CardTitle>
            <CardDescription>
              Distances between major Zimbabwean cities - Click on any distance
              to see details above
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="relative w-full text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 min-w-[120px] border-b bg-white p-2 text-left font-medium">
                    From / To
                  </th>
                  {majorCities.map((city, index) => (
                    <th
                      key={city}
                      className={`min-w-[80px] border-b p-2 text-center font-medium ${
                        selectedCell?.col === index ? 'bg-blue-50' : ''
                      }`}
                    >
                      {city.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {majorCities.map((fromCity, rowIndex) => (
                  <tr key={fromCity} className="hover:bg-gray-50">
                    <td
                      className={`sticky left-0 z-10 border-r bg-white p-2 font-medium ${
                        selectedCell?.row === rowIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      {fromCity}
                    </td>
                    {majorCities.map((toCity, colIndex) => (
                      <td
                        key={toCity}
                        className={`cursor-pointer border-r p-2 text-center transition-colors ${getCellStyle(rowIndex, colIndex)}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {fromCity === toCity ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span className="font-mono hover:font-bold">
                            {distanceMatrix[fromCity]?.[toCity]?.toFixed(0) ||
                              '...'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            <p>
              * Distances are calculated as straight-line distances between city
              centers
            </p>
            <p>
              * Actual driving distances may vary depending on road conditions
              and routes
            </p>
            <p>
              * Click on any distance to highlight the row and column and see
              details above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-green-600" />
            <CardTitle className="text-2xl">
              Zimbabwe Distance Calculator
            </CardTitle>
          </div>
          <CardDescription>
            Calculate distances between major cities in Zimbabwe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
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
                              className="text-xs"
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
                                Help us improve accuracy by reporting issues
                                with the calculated distance between{' '}
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
                      <div className="mb-3 text-sm text-gray-400">
                        (-- miles)
                      </div>

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
                        <div className="text-xl font-bold text-gray-400">
                          $--
                        </div>
                        <div className="text-xs text-gray-400">
                          (--L needed)
                        </div>
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
                      className="h-8 w-8 p-0"
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
                          setAverageSpeed(
                            Number.parseFloat(e.target.value) || 70,
                          )
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
                      {isHybridCar
                        ? 'hybrid efficiency'
                        : 'kilometers per liter'}
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

          {/* Distance Table */}
          <DistanceTable />
        </CardContent>
      </Card>
      <ToolFAQs tool="distance-calculator" user={user} dbAnswers={dbAnswers} />
    </div>
  );
}
