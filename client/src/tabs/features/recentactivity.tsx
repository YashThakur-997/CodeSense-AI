import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconHistory, IconHome, IconLogout, IconRocket} from '@tabler/icons-react';
import { useState } from 'react';


function recentactivity() {
  const [open, setOpen] = useState(false);

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
      href: "/recent_activity",
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
        
        </div>
      </div>
  );
}

export default recentactivity
