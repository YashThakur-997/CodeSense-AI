import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { Featuredcard } from '@/components/ui/featuredcard';
import Navbar from './navbar';

function homesection() {

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black">
      <Navbar />
      <div className="flex-1 relative overflow-y-auto bg-black min-h-0">
        <GridBackgroundDemo />
        <div className="absolute inset-0 flex items-start justify-center pt-10 sm:pt-16 md:pt-20 gap-2 sm:gap-4 z-20 pointer-events-none px-4">
          <LayoutTextFlip text={'CodeSense helps you'} words={['Analyze Repos', 'Fix Logic Gaps', 'Master Technicals']} />
        </div>
      

        {/* Featured Cards Section */}
        <div className="relative z-20 mt-105 sm:mt-120 md:mt-100 px-4 sm:px-6 md:px-10 pb-10">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-6">Featured Interviews</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            <Featuredcard 
              title='Code Analysis' 
              description='Deep dive into your codebase with AI-powered insights and suggestions.' 
              imageUrl='https://cdn.pixabay.com/photo/2024/01/29/22/47/ai-generated-8540920_1280.jpg'
              badge='Popular'
              buttonText='Try Now'
            />
            <Featuredcard 
              title='Interview Prep' 
              description='Generate technical interview questions based on your project code.' 
              imageUrl='https://cdn.pixabay.com/photo/2023/01/22/06/50/technology-7735671_1280.jpg'
              badge='New'
              buttonText='Start'
            />
            <Featuredcard 
              title='Debug Assistant' 
              description='Find and fix bugs faster with intelligent debugging suggestions.' 
              imageUrl='https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg'
              badge='Featured'
              buttonText='Start'
            />
            <Featuredcard 
              title='Learn Patterns' 
              description='Master design patterns and best practices from real codebases.' 
              imageUrl='https://cdn.pixabay.com/photo/2018/05/08/08/44/artificial-intelligence-3382507_1280.jpg'
              badge='Pro'
              buttonText='Learn'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default homesection
