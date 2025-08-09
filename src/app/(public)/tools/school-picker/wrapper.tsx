'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  X,
  Phone,
  Info,
  BriefcaseBusiness,
  GraduationCap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Container from '@/components/container';
import Link from 'next/link';
import { textify } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SchoolPickerProfilesType } from '@/types';

const educationLevels = [
  { value: 'best-primary-schools', label: 'Primary' },
  { value: 'best-o-level-schools', label: 'O Level' },
  { value: 'best-a-level-schools', label: 'A Level' },
  { value: 'best-tertiary-institutions', label: 'Tertiary' },
];

export default function SchoolPicker({
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

  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedSchoolForContact, setSelectedSchoolForContact] =
    useState<any>(null);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [contactDialogTab, setContactDialogTab] = useState('view');

  const averages = schools.map((school) => {
    const amounts = school.feesHistory.map((f) => f.amount);
    const sum = amounts.reduce((acc, curr) => acc + curr, 0);
    const avg = amounts.length > 0 ? sum / amounts.length : 0;
    return avg;
  });

  const lowestAverage = Math.min(...averages);
  const highestAverage = Math.max(...averages);

  const [feeRange, setFeeRange] = useState([lowestAverage, highestAverage]);

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
  const tetiaryTypes = [
    'all',
    'Public',
    'Private',
    'Polytechnic',
    'Teacher Training',
    'Technical College',
  ];
  const churches = [
    'all',
    'Anglican',
    'Catholic',
    'Christian',
    'Dutch',
    'Methodist',
    'Presbyterian',
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

  const handleContactSubmit = (e: any) => {
    e.preventDefault();
    if (!agreesToTerms) {
      alert('Please agree to the terms before submitting.');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('New contact submitted:', {
      schoolId: selectedSchoolForContact?.id,
      name: newContactName,
      phone: newContactPhone,
      role: newContactRole,
    });

    window.open(
      `https://wa.me/+263717238876?text="School: ${selectedSchoolForContact?.name} - New Contact Submission: Name: ${newContactName}, Phone: ${newContactPhone}, Role: ${newContactRole}"`,
      '_blank',
    );

    // Reset form
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRole('');
    setAgreesToTerms(false);
    setContactDialogTab('view');
  };

  const openContactDialog = (school: any) => {
    setSelectedSchoolForContact(school);
    setContactDialogTab('view');
    setIsContactDialogOpen(true);
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
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
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
              href={`/tools/school-picker/${level.value}`}
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
                      {tetiaryTypes.map((type) => (
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
                  disabled={selectedLevel === 'best-tertiary-institutions'}
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
            For better experience view on wider screens like laptops or tablets.
          </AlertDescription>
        </Alert>

        {/* Results */}
        <div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => {
              const averageFee =
                school.feesHistory && school.feesHistory.length > 0
                  ? school.feesHistory.reduce(
                      (sum, fee) => sum + fee.amount,
                      0,
                    ) / school.feesHistory.length
                  : 0;

              return (
                <li key={school._id}>
                  <Card className="relative transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between pt-4">
                        <div>
                          <CardTitle className="text-lg">
                            {school.name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.location}
                          </CardDescription>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium text-gray-600">
                            4.8 (120 reviews)
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* <p className="text-sm text-gray-600">
                      {school.description}
                    </p> */}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                              ''}
                          </Badge>
                          {school.churchAffiliation && (
                            <Badge
                              variant="outline"
                              className="border-purple-200 bg-purple-50 text-xs text-purple-700"
                            >
                              {school.churchAffiliation}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>
                            ${averageFee.toLocaleString()}/
                            {school.level === 'tertiary-institution'
                              ? 'semester'
                              : 'term'}
                          </span>
                        </div>
                        {school.level === 'tertiary-institution'
                          ? // For tertiary institutions — average from employmentRatesHistory
                            (() => {
                              const avgEmploymentRate = school
                                .employmentRatesHistory?.length
                                ? (
                                    school.employmentRatesHistory.reduce(
                                      (sum, item) => sum + item.employmentRate,
                                      0,
                                    ) / school.employmentRatesHistory.length
                                  ).toFixed(1)
                                : null;

                              return (
                                <div className="flex items-center gap-1">
                                  {avgEmploymentRate !== null ? (
                                    <>
                                      <span className="text-sm">{`${avgEmploymentRate}% employed`}</span>
                                      <BriefcaseBusiness className="h-4 w-4 text-purple-600" />
                                    </>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      No data
                                    </span>
                                  )}
                                </div>
                              );
                            })()
                          : // For high schools — decide array based on `level` param
                            (() => {
                              let ratesArray:
                                | { year: number; passRate: number }[]
                                | undefined;

                              if (school.level === 'high-school') {
                                if (selectedLevel === 'best-a-level-schools') {
                                  ratesArray = school.aLevelSchoolPassRates; // show A-level rates
                                } else if (
                                  selectedLevel === 'best-o-level-schools'
                                ) {
                                  ratesArray = school.oLevelSchoolPassRates; // show O-level rates
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
                                    <>
                                      <span className="text-sm">{`${avgPassRate}% pass rate`}</span>
                                      <GraduationCap className="h-4 w-4 text-purple-600" />
                                    </>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      No data
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link
                          href={`/profiles/school/${school.slug.current}`}
                          className="bg-primary hover:bg-primary/90 block w-full flex-1 rounded-md py-1 text-center text-white transition-colors"
                        >
                          View Details
                        </Link>
                        <Dialog
                          open={isContactDialogOpen}
                          onOpenChange={setIsContactDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="cursor-pointer"
                              size="sm"
                              onClick={() => openContactDialog(school)}
                            >
                              <Phone className="mr-1 h-4 w-4" />
                              Call
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>
                                Contact {selectedSchoolForContact?.name}
                              </DialogTitle>
                              <DialogDescription>
                                View available contacts or add new ones
                              </DialogDescription>
                            </DialogHeader>

                            <Tabs
                              value={contactDialogTab}
                              onValueChange={setContactDialogTab}
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="view">
                                  View Contacts
                                </TabsTrigger>
                                <TabsTrigger value="add">
                                  Add Contact
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="view" className="space-y-4">
                                <div>
                                  <h4 className="mb-3 font-medium">
                                    Available Contacts:
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedSchoolForContact?.contacts?.map(
                                      (contact: any, index: any) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm font-medium">
                                              {contact.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              {contact.role}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                              {contact.phone}
                                            </p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              variant="default"
                                              onClick={() =>
                                                window.open(
                                                  `tel:${contact.phone}`,
                                                )
                                              }
                                            >
                                              <Phone className="mr-1 h-3 w-3" />
                                              Call
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() =>
                                                alert(
                                                  `Report submitted for ${contact.phone}. Thank you for helping us maintain accurate contact information.`,
                                                )
                                              }
                                            >
                                              Report
                                            </Button>
                                          </div>
                                        </div>
                                      ),
                                    ) || (
                                      <div className="py-8 text-center text-gray-500">
                                        <Phone className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">
                                          No contacts available for this school.
                                        </p>
                                        <p className="mt-1 text-xs">
                                          Be the first to add one!
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="add" className="space-y-4">
                                <div>
                                  <h4 className="mb-3 text-base font-medium">
                                    Submit a New Contact:
                                  </h4>
                                  <form
                                    onSubmit={handleContactSubmit}
                                    className="space-y-4"
                                  >
                                    <div>
                                      <Label
                                        htmlFor="contactName"
                                        className="mb-2 text-sm font-normal"
                                      >
                                        Contact Name
                                      </Label>
                                      <Input
                                        id="contactName"
                                        value={newContactName}
                                        onChange={(e) =>
                                          setNewContactName(e.target.value)
                                        }
                                        placeholder="e.g., John Smith or Main Office"
                                        required
                                      />
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor="contactPhone"
                                        className="mb-2 text-sm font-normal"
                                      >
                                        Phone Number
                                      </Label>
                                      <Input
                                        id="contactPhone"
                                        value={newContactPhone}
                                        onChange={(e) =>
                                          setNewContactPhone(e.target.value)
                                        }
                                        placeholder="+263-XX-XXXXXXX"
                                        required
                                      />
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor="contactRole"
                                        className="mb-2 text-sm font-normal"
                                      >
                                        Role/Position
                                      </Label>
                                      <Select
                                        value={newContactRole}
                                        onValueChange={setNewContactRole}
                                        required
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="School Landline">
                                            School Landline
                                          </SelectItem>
                                          <SelectItem value="Principal">
                                            Principal
                                          </SelectItem>
                                          <SelectItem value="Headmaster">
                                            Headmaster
                                          </SelectItem>
                                          <SelectItem value="Admissions Officer">
                                            Admissions Officer
                                          </SelectItem>
                                          <SelectItem value="Bursar">
                                            Bursar
                                          </SelectItem>
                                          <SelectItem value="Secretary">
                                            Secretary
                                          </SelectItem>
                                          <SelectItem value="Deputy Head">
                                            Deputy Head
                                          </SelectItem>
                                          <SelectItem value="Other">
                                            Other
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="terms"
                                        checked={agreesToTerms}
                                        onCheckedChange={() =>
                                          setAgreesToTerms(!agreesToTerms)
                                        }
                                      />
                                      <Label
                                        htmlFor="terms"
                                        className="text-xs"
                                      >
                                        I confirm that this phone number belongs
                                        to a member of{' '}
                                        {selectedSchoolForContact?.name}
                                      </Label>
                                    </div>

                                    <Button
                                      type="submit"
                                      className="w-full"
                                      disabled={
                                        !agreesToTerms ||
                                        !newContactName ||
                                        !newContactPhone ||
                                        !newContactRole
                                      }
                                    >
                                      Submit Contact
                                    </Button>
                                  </form>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>

          {filteredSchools.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-400">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No schools found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
