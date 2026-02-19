import React from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconHistory, IconHome, IconLogout, IconRocket , IconChartBar } from '@tabler/icons-react';

const navbar = () => {
    const [open, setOpen] = React.useState(false);

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
            label: "Analytics",
            href: "/analytics",
            icon: <IconChartBar className="h-9 w-9 text-neutral-100" />,
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
        <div>
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
        </div>
    )
}

export default navbar
