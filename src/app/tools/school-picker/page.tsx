import SchoolPickerClient from './SchoolPickerClient';

export const metadata = {
  title: 'School Picker | IBZim',
  description: 'Find schools based on location, type, and other criteria in Zimbabwe.',
  keywords: 'schools, education, primary, secondary, tertiary, Zimbabwe, school finder'
};

export default async function SchoolPickerPage() {
  
  return (
    <SchoolPickerClient />
  );
}

