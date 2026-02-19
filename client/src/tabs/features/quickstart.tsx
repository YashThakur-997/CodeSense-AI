import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconHistory, IconHome, IconLogout, IconRocket, IconBrandGithub, IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function quickstart() {
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
      href: "/homesection",
      icon: <IconHome className="h-9 w-9 text-neutral-100" />,
    },
    {
      label: "Quick start",
      href: "/quickstart",
      icon: <IconRocket className="h-9 w-9 text-neutral-100" />,
    },
    {
      label: "Recent activity",
      href: "/recentactivity",
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
      </div>
    </div>
  );
}

export default quickstart
