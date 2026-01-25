'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  X,
  Info,
  GraduationCap,
  TriangleAlert,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Container from '@/components/container';
import Link from 'next/link';
import { textify } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SchoolPickerProfilesType } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import PtRenderer from '@/components/pt-renderer';
import primaryContent from '../content/primary.json';
import oLevelContent from '../content/o-level.json';
import aLevelContent from '../content/a-level.json';
import tertiaryContent from '../content/tertiary.json';
import GoogleAdUnit from '@/components/ad-unit';
import ComparisonDialog from './comparison-dialog';

const educationLevels = [
  { value: 'best-primary-schools', label: 'Primary' },
  { value: 'best-o-level-schools', label: 'O Level' },
  { value: 'best-a-level-schools', label: 'A Level' },
  { value: 'best-tertiary-institutions', label: 'Tertiary' },
];

export default function SchoolPickerComponent({
  level,
  selectedLevel,
  schools,
}: {
  level: string;
  selectedLevel: string;
  schools: SchoolPickerProfilesType[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedChurch, setSelectedChurch] = useState('all');
  const [selectedSchoolsForComparison, setSelectedSchoolsForComparison] =
    useState<SchoolPickerProfilesType[]>([]);

  const averages = schools.map((school) => {
    const amounts = school.feesHistory.map((f) => f.amount);
    const sum = amounts.reduce((acc, curr) => acc + curr, 0);
    const avg = amounts.length > 0 ? sum / amounts.length : 0;
    return avg;
  });

  const lowestAverage = Math.min(...averages);
  const highestAverage = Math.max(...averages);

  const [feeRange, setFeeRange] = useState([lowestAverage, highestAverage]);

  const contentBody =
    selectedLevel === 'best-primary-schools'
      ? primaryContent
      : selectedLevel === 'best-o-level-schools'
        ? oLevelContent
        : selectedLevel === 'best-a-level-schools'
          ? aLevelContent
          : tertiaryContent;

  const provinces = [
    'all',
    'Harare',
    'Bulawayo',
    'Manicaland',
    'Mashonaland East',
    'Mashonaland West',
    'Masvingo',
    'Midlands',
    'Matabeleland North',
    'Matabeleland South',
  ];
  const schoolTypes = [
    'all',
    'Boys Boarding',
    'Girls Boarding',
    'Mixed Boarding',
    'Day School',
  ];
  const tertiaryTypes = [
    'all',
    'University',
    'Polytechnic College',
    'Teaching College',
    'Technical College',
    'Nursing School',
    'Vocational Training Centre',
    'Business School',
  ];
  const churches = [
    'all',
    'Anglican',
    'Catholic',
    'Christian',
    'Dutch',
    'Methodist',
    'Presbyterian',
    'Salvation Army',
  ];

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesLevel = school.level === level;
      const matchesSearch = school.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // || school.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        selectedProvince === 'all' || school.province === selectedProvince;
      const matchesType =
        selectedType === 'all' ||
        (() => {
          let typeToCheck;

          if (school.level === 'primary-school') {
            typeToCheck = school.primarySchoolType;
          } else if (school.level === 'high-school') {
            if (level === 'best-a-level-schools') {
              typeToCheck = school.aLevelSchoolType;
            } else if (level === 'best-o-level-schools') {
              typeToCheck = school.oLevelSchoolType;
            }
          }

          return typeToCheck === selectedType;
        })();
      const averageFee =
        school.feesHistory && school.feesHistory.length > 0
          ? school.feesHistory.reduce((sum, fee) => sum + fee.amount, 0) /
            school.feesHistory.length
          : 0;

      const matchesFees =
        averageFee >= feeRange[0] && averageFee <= feeRange[1];
      // For universities, ignore church filter since they typically don't have religious affiliations
      const matchesChurch =
        selectedLevel === 'best-tertiary-institutions' ||
        selectedChurch === 'all' ||
        school.churchAffiliation === selectedChurch;

      return (
        matchesLevel &&
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesFees &&
        matchesChurch
      );
    });
  }, [
    selectedLevel,
    searchTerm,
    selectedProvince,
    selectedType,
    feeRange,
    selectedChurch,
  ]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedChurch('all');
    setFeeRange([lowestAverage, highestAverage]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Boys Boarding':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Girls Boarding':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Mixed Boarding':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Day School':
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const handleCompareToggle = (
    school: SchoolPickerProfilesType,
    checked: boolean,
  ) => {
    if (checked) {
      if (selectedSchoolsForComparison.length < 4) {
        setSelectedSchoolsForComparison([
          ...selectedSchoolsForComparison,
          school,
        ]);
      }
    } else {
      setSelectedSchoolsForComparison(
        selectedSchoolsForComparison.filter((s) => s._id !== school._id),
      );
    }
  };

  const isSchoolSelected = (schoolId: string) => {
    return selectedSchoolsForComparison.some((s) => s._id === schoolId);
  };

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900">
          {textify(selectedLevel)} Table
        </h1>
        <p className="mx-auto max-w-sm text-zinc-600">
          Browse through{' '}
          {selectedLevel !== 'best-tertiary-institutions' ? '100+' : '30+'}{' '}
          {textify(selectedLevel)} in Zimbabwe to find the best fit for your
          educational needs.
        </p>
      </div>

      {/* Education Level Tabs */}
      <div className="mb-6">
        <div className="bg-muted/80 mb-6 grid w-full grid-cols-4 gap-2 rounded-md p-2">
          {educationLevels.map((level) => (
            <Link
              key={level.value}
              href={`/tools/school-picker/${level.value}-in-zimbabwe`}
              className={`flex h-full w-full items-center justify-center rounded-md py-1 text-sm ${
                selectedLevel === level.value
                  ? 'bg-teal-200'
                  : 'hover:bg-primary/10'
              }`}
            >
              {level.label}
            </Link>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 py-6">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="location" className="mb-2 text-sm font-normal">
                  Province
                </Label>
                <Select
                  value={selectedProvince}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province === 'all' ? 'All Provinces' : province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLevel === 'best-tertiary-institutions' ? (
                <div>
                  <Label htmlFor="type" className="mb-2 text-sm font-normal">
                    School Type
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className={`w-full`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tertiaryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="type" className="mb-2 text-sm font-normal">
                    School Type
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className={`w-full`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="church" className="mb-2 text-sm font-normal">
                  Church Affiliation
                </Label>
                <Select
                  value={selectedChurch}
                  onValueChange={setSelectedChurch}
                  disabled={
                    selectedLevel === 'best-tertiary-institutions' ||
                    selectedLevel === 'best-primary-schools'
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      selectedLevel === 'best-tertiary-institutions'
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select church" />
                  </SelectTrigger>
                  <SelectContent>
                    {churches.map((church) => (
                      <SelectItem key={church} value={church}>
                        {church === 'all' ? 'All Churches' : church}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="self-end">
                <Button
                  variant="default"
                  onClick={clearFilters}
                  className="w-full flex-1"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-4 text-sm font-normal">
                {level === 'tertiary-institution' ? 'Semester' : 'Term'} Fees
                Range: ${feeRange[0]} - ${feeRange[1]}
              </Label>
              <Slider
                value={feeRange}
                onValueChange={setFeeRange}
                max={20000}
                step={10}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Alert className="border-primaryColor mb-6 border bg-yellow-200">
          <Info />
          <AlertDescription className="text-primary">
            Figures provided are estimates and averages based on available data.
            For better experience rotate your phone or use IBZIM on wider
            screens like laptops or tablets.
          </AlertDescription>
        </Alert>

        {/* Schools Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-zinc-200">
            <thead>
              <tr className="bg-zinc-50">
                <th className="border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                  Rank
                </th>
                <th className="sticky left-0 z-10 max-w-[75px] min-w-[65px] border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-900 md:max-w-[200px] md:min-w-[200px]">
                  {selectedLevel === 'best-tertiary-institutions'
                    ? 'Institution Name'
                    : 'School Name'}
                </th>
                <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                  {selectedLevel === 'best-tertiary-institutions'
                    ? 'Main Campus'
                    : 'Location'}
                </th>
                {selectedLevel !== 'best-tertiary-institutions' && (
                  <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                    Type
                  </th>
                )}
                {selectedLevel !== 'best-primary-schools' &&
                  selectedLevel !== 'best-tertiary-institutions' && (
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                      Church
                    </th>
                  )}
                <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                  {selectedLevel === 'best-tertiary-institutions'
                    ? 'Fees + Living Cost'
                    : 'Fees'}
                </th>
                <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                  {selectedLevel === 'best-tertiary-institutions'
                    ? 'Year Founded'
                    : 'Performance'}
                </th>
                <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-900">
                  Rating
                </th>
                <th className="border border-zinc-200 px-2 py-3 text-left text-sm font-medium text-zinc-900">
                  Compare
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school, index) => {
                const averageFee =
                  school.feesHistory && school.feesHistory.length > 0
                    ? school.feesHistory.reduce(
                        (sum, fee) => sum + fee.amount,
                        0,
                      ) / school.feesHistory.length
                    : 0;

                return (
                  <tr
                    key={school._id}
                    className="text-xs hover:bg-zinc-50 sm:text-sm"
                  >
                    <td className="border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-800">
                        {index + 1}
                      </div>
                    </td>
                    <td className="sticky left-0 z-10 max-w-[100px] min-w-[75px] border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50 md:max-w-[200px] md:min-w-[200px]">
                      <Link
                        href={`/profiles/school/${school.slug.current}`}
                        className="hover:text-primaryColor pb-2 font-medium text-yellow-800 underline decoration-dotted underline-offset-2"
                      >
                        {school.name}
                      </Link>
                    </td>
                    <td className="border border-zinc-200 px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <MapPin className="h-3 w-3" />
                        {school.location}
                      </div>
                    </td>
                    {selectedLevel !== 'best-tertiary-institutions' && (
                      <td className="border border-zinc-200 px-4 py-3">
                        <Badge
                          variant="outline"
                          className={getTypeColor(
                            school.primarySchoolType ||
                              school.oLevelSchoolType ||
                              school.aLevelSchoolType ||
                              '',
                          )}
                        >
                          {school.primarySchoolType ||
                            school.oLevelSchoolType ||
                            school.aLevelSchoolType ||
                            'N/A'}
                        </Badge>
                      </td>
                    )}
                    {!school.primarySchoolType &&
                      selectedLevel !== 'best-tertiary-institutions' && (
                        <td className="border border-zinc-200 px-4 py-3">
                          {school.churchAffiliation ? (
                            <Badge
                              variant="outline"
                              className="border-purple-200 bg-purple-50 text-xs text-purple-700"
                            >
                              {school.churchAffiliation}
                            </Badge>
                          ) : (
                            <span className="text-sm text-zinc-400">None</span>
                          )}
                        </td>
                      )}
                    <td className="border border-zinc-200 px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        {school.feesHistory[0].feesStatus ===
                          'Needs Confirmation' && (
                          <TriangleAlert className="size-4 text-red-600" />
                        )}
                        {school.feesHistory[0].feesStatus === 'Custom' && (
                          <TriangleAlert className="size-4 text-yellow-600" />
                        )}
                        {school.feesHistory[0].feesStatus === 'Verified' && (
                          <CheckCircle className="size-4 text-green-600" />
                        )}
                        <span>
                          ${averageFee.toLocaleString()}/
                          {school.level === 'tertiary-institution'
                            ? 'semester'
                            : 'term'}
                        </span>
                      </div>
                    </td>
                    <td className="border border-zinc-200 px-4 py-3">
                      {school.level !== 'tertiary-institution'
                        ? (() => {
                            let ratesArray:
                              | { year: number; passRate: number }[]
                              | undefined;

                            if (school.level === 'high-school') {
                              if (selectedLevel === 'best-a-level-schools') {
                                ratesArray = school.aLevelSchoolPassRates;
                              } else if (
                                selectedLevel === 'best-o-level-schools'
                              ) {
                                ratesArray = school.oLevelSchoolPassRates;
                              }
                            }

                            if (school.level == 'primary-school') {
                              if (selectedLevel === 'best-primary-schools') {
                                ratesArray = school.primarySchoolPassRates;
                              }
                            }

                            const avgPassRate = ratesArray?.length
                              ? (
                                  ratesArray.reduce(
                                    (sum, item) => sum + item.passRate,
                                    0,
                                  ) / ratesArray.length
                                ).toFixed(1)
                              : null;

                            return (
                              <div className="flex items-center gap-1">
                                {avgPassRate !== null ? (
                                  <div className="flex items-center">
                                    <span className="text-sm">{`${avgPassRate}%`}</span>
                                    <GraduationCap className="h-4 w-4 text-purple-600" />
                                  </div>
                                ) : (
                                  <span className="text-sm text-zinc-500">
                                    No data
                                  </span>
                                )}
                              </div>
                            );
                          })()
                        : school.yearFounded || 'N/A'}
                    </td>
                    {/* Ratings */}
                    <td className="border border-zinc-200 px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium text-zinc-600">
                          {school.averageRating} ({school.reviewsCount})
                        </span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="border border-zinc-200 px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <Checkbox
                          id={`compare-${school._id}`}
                          className="cursor-pointer"
                          checked={isSchoolSelected(school._id)}
                          onCheckedChange={(checked) =>
                            handleCompareToggle(school, checked as boolean)
                          }
                          disabled={
                            !isSchoolSelected(school._id) &&
                            selectedSchoolsForComparison.length >= 4
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSchools.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-zinc-400">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-zinc-900">
                No schools found
              </h3>
              <p className="text-zinc-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>

        <Alert className="border-primaryColor mt-6 border bg-yellow-200">
          <Info />
          <AlertDescription className="text-primary">
            We are still working on adding more schools with as much accurate
            data as we can find. Contact us on +263717238876 (Whatsapp).
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex flex-col gap-8 pb-10 md:mt-8 md:grid md:flex-none md:grid-cols-[1fr_350px] md:pb-20">
          <div className="h-fit">
            <PtRenderer body={contentBody.body} />
          </div>
          <aside className="relative w-full">
            <div className="top-[10vh] p-1 md:sticky md:p-2">
              <GoogleAdUnit adSlot="6137077018" />
            </div>
          </aside>
        </div>
      </div>
      <ComparisonDialog
        selectedSchools={selectedSchoolsForComparison}
        onRemoveSchool={(schoolId) => {
          setSelectedSchoolsForComparison(
            selectedSchoolsForComparison.filter((s) => s._id !== schoolId),
          );
        }}
        onClearAll={() => setSelectedSchoolsForComparison([])}
      />
    </Container>
  );
}
