import { Metadata } from 'next';
import InstallPageWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'Install IBZIM App',
  description: 'Install the IBZIM app for easy access and better performance.',
};

export default function InstallPage() {
  return <InstallPageWrapper />;
}
