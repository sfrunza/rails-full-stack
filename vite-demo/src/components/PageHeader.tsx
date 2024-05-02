import colorLogo from '@/assets/logos/color-logo.png';
import whiteLogo from '@/assets/logos/mono-logo.png';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function PageHeader({ invert }: { invert?: boolean }) {
  return (
    <header className={cn(!invert && 'border-b bg-white w-full z-10')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-fit">
          <Link to="/">
            <img
              src={invert ? whiteLogo : colorLogo}
              alt="Brave Movers Boston"
              className="w-auto h-8"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
