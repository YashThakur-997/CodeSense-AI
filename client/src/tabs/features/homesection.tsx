import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconHistory, IconHome, IconLogout, IconRocket, IconBrandGithub, IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { Featuredcard } from '@/components/ui/featuredcard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function homesection() {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      // TODO: Send repo URL to AI for analysis
      console.log('Analyzing repo:', repoUrl);
    }
  };

  const links = [
    {
      label: "Home",
      href: "homesection",
      icon: <IconHome className="h-9 w-9 text-neutral-100" />,
    },
    {
      label: "Quick start",
      href: "",
      icon: <IconRocket className="h-9 w-9 text-neutral-100" />,
    },
    {
      label: "Recent activity",
      href: "",
      icon: <IconHistory className="h-9 w-9 text-neutral-100" />,
    },
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
    <div className="flex flex-col md:flex-row h-screen w-full bg-black">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-center gap-10 bg-neutral-900">
          <div className="flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 relative overflow-y-auto bg-black min-h-0">
        <GridBackgroundDemo />
        <div className="absolute inset-0 flex items-start justify-center pt-10 sm:pt-16 md:pt-20 gap-2 sm:gap-4 z-20 pointer-events-none px-4">
          <LayoutTextFlip text={'CodeSense helps you'} words={['Analyze Repos', 'Fix Logic Gaps', 'Master Technicals']} />
        </div>
        
        {/* GitHub Repo Link Input Card */}
        <div className="absolute top-30 sm:top-36 md:top-44 left-4 right-4 sm:left-6 sm:right-6 md:left-10 md:right-10 z-20 flex justify-center">
          <div className="w-full max-w-2xl bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <IconBrandGithub className="h-6 w-6 text-white" />
              <h3 className="text-white font-semibold text-lg">Analyze GitHub Repository</h3>
            </div>
            <p className="text-neutral-400 text-sm mb-4">Paste your GitHub repository link to generate AI-powered interview questions and code analysis.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500 focus:border-neutral-500"
              />
              <Button 
                onClick={handleAnalyze}
                className="bg-white text-black hover:bg-neutral-200 font-semibold px-6"
              >
                Analyze
                <IconArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
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
