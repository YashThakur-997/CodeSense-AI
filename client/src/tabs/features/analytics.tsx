import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import Navbar from './navbar';


function analytics() {

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black">
      <Navbar />
      <div className="flex-1 relative overflow-y-auto bg-black min-h-0">
        <GridBackgroundDemo />
        
        </div>
      </div>
  );
}

export default analytics
