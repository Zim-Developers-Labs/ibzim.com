import { globalGETRateLimit } from '@/lib/server/request';
import ForgotPasswordComponents from './components';

export default function Page() {
  if (!globalGETRateLimit()) {
    return 'Too many requests';
  }
  return <ForgotPasswordComponents />;
}
