import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { IconHistory, IconHome, IconLogout, IconRocket } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';

function Interview({username,imageUrl}: {username: string,imageUrl?: string}) { // Capitalized component name (React convention)

  const isSpeaking = true; 

  const messages = [
    'What is your greatest strength?',
    'My greatest strength is my ability to learn quickly and adapt to new technologies.',
  ];

  const links = [
    { label: "Home", href: "/homesection", icon: <IconHome className="h-9 w-9 text-neutral-100" /> },
    { label: "Quick start", href: "/quickstart", icon: <IconRocket className="h-9 w-9 text-neutral-100" /> },
    { label: "Recent activity", href: "/recent_activity", icon: <IconHistory className="h-9 w-9 text-neutral-100" /> },
    {
      label: "Logout",
      href: "/",
      onClick: () => {
        document.cookie = 'token=; Max-Age=0; path=/;';
        window.location.href = '/';
      },
      icon: <IconLogout className="h-9 w-9 text-neutral-100" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative bg-black min-h-0">
        <GridBackgroundDemo />

        {/* Title Section - Using top-0 instead of inset-0 to prevent blocking clicks */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-center pt-10 sm:pt-16 md:pt-20 z-30 pointer-events-none px-4">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">Interview Section</h1>
        </div>

        {/* Cards Container */}
        <div className='absolute inset-0 flex flex-col sm:flex-row z-20 justify-center items-center gap-8 px-4 pt-20'>
          
          {/* Card 1: Interviewer */}
          <Card className='w-80 h-64 flex flex-col items-center justify-center bg-neutral-900 border-neutral-800 text-white'>
            <div className='relative flex items-center justify-center w-24 h-24'>
              {/* Blinking Aura behind the logo */}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-gray-500/40 animate-ping scale-90 z-0"></div>
              )}
              {/* The Logo */}
              <img 
                src={'https://avatars.githubusercontent.com/u/9919?s=200&v=4'} 
                alt='Avatar' 
                className='rounded-full w-20 h-20 relative z-10 border-2 border-neutral-700' 
              />
            </div>
            <p className="mt-4 text-neutral-400 font-medium">Interviewer</p>
          </Card>

          {/* Card 2: Candidate */}
          <Card className='w-80 h-64 flex flex-col items-center justify-center bg-neutral-900 border-neutral-800 text-white'>
            <div className='relative w-20 h-20'>
              <img 
                src={imageUrl || 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'}
                alt='Avatar' 
                className='rounded-full w-full h-full object-cover border-2 border-neutral-700' 
              />
            </div>
            <p className="mt-4 text-neutral-400 font-medium">{username}</p>
          </Card>

          {messages.length > 0 && (
            <div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;