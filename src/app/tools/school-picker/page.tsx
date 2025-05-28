

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, School } from 'lucide-react'; 
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchoolData {
  id: string;
  name: string;
  location: string;
  type: 'primary' | 'secondary' | 'tertiary';
  description: string;
}

// Placeholder school data for MVP
const allSchools: SchoolData[] = [
  {
    id: 'sch-1',
    name: 'Harare High School',
    location: 'Harare',
    type: 'secondary',
    description: 'A well-established secondary school in Harare.',
  },
  {
    id: 'sch-2',
    name: 'Bulawayo Primary School',
    location: 'Bulawayo',
    type: 'primary',
    description: 'A leading primary school in Bulawayo.',
  },
  {
    id: 'sch-3',
    name: 'Mutare Polytechnic',
    location: 'Mutare',
    type: 'tertiary',
    description: 'Providing technical education in Mutare.',
  },
  {
    id: 'sch-4',
    name: 'Gweru Girls High',
    location: 'Gweru',
    type: 'secondary',
    description: 'A prominent girls high school in Gweru.',
  },
   {
    id: 'sch-5',
    name: 'Harare International School',
    location: 'Harare',
    type: 'secondary',
    description: 'An international school offering diverse programs.',
  },
];

export default function SchoolPickerPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const locations = useMemo(() => [
    'all', ...Array.from(new Set(allSchools.map(school => school.location)))
  ], []);

   const types = useMemo(() => [
    'all', ...Array.from(new Set(allSchools.map(school => school.type)))
  ], []);

  const filteredSchools = useMemo(() => {
    return allSchools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || school.location === locationFilter;
      const matchesType = typeFilter === 'all' || school.type === typeFilter;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchTerm, locationFilter, typeFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <School className="h-8 w-8 text-primary" />{/* Using School icon */}
          </div>
          <div>
            <h1 className="text-3xl font-bold">School Picker</h1>
            <p className="text-muted-foreground">Find a school based on your preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Find a School</CardTitle>
            <CardDescription>Search and filter schools by location and type.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-3">
                 <Label htmlFor="schoolSearch">Search by Name</Label>
                 <Input 
                    id="schoolSearch"
                    type="text"
                    placeholder="e.g. Harare High"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
               <div>
                 <Label htmlFor="locationFilter">Filter by Location</Label>
                 <Select onValueChange={setLocationFilter} defaultValue="all">
                    <SelectTrigger id="locationFilter">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                       {locations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
               </div>
                <div>
                 <Label htmlFor="typeFilter">Filter by Type</Label>
                  <Select onValueChange={setTypeFilter} defaultValue="all">
                    <SelectTrigger id="typeFilter">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                     <SelectContent>
                       {types.map(type => (
                          <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
               </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Schools Found ({filteredSchools.length})</h3>
              {filteredSchools.length > 0 ? (
                <div className="grid gap-4">
                  {filteredSchools.map(school => (
                    <Card key={school.id}>
                      <CardHeader>
                         <CardTitle className="text-lg">{school.name}</CardTitle>
                         <CardDescription>{school.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <p className="text-sm text-muted-foreground">Location: {school.location}</p>
                         <p className="text-sm text-muted-foreground">Type: {school.type.charAt(0).toUpperCase() + school.type.slice(1)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No schools match your criteria.</p>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

