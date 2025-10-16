import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Scale,
  Building2,
  Heart,
  GraduationCap,
  Factory,
  Calendar,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  Crown,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Work Queues',
    url: '/admin/work-queues',
    icon: CheckSquare,
  },
];

const serviceModules = [
  { title: 'Grievances', url: '/admin/grievances', icon: MessageSquare },
  { title: 'Disputes', url: '/admin/disputes', icon: Scale },
  { title: 'Temple Letters', url: '/admin/temple-letters', icon: Building2 },
  { title: 'CM Relief Fund', url: '/admin/cm-relief', icon: Heart },
  { title: 'Education Support', url: '/admin/education', icon: GraduationCap },
  { title: 'CSR & Industrial', url: '/admin/csr-industrial', icon: Factory },
  { title: 'Appointments', url: '/admin/appointments', icon: Calendar },
  { title: 'Programs/Job Melas', url: '/admin/programs', icon: Users },
];

const systemModules = [
  { title: 'Communications', url: '/admin/communications', icon: MessageCircle },
  { title: 'Reports & KPIs', url: '/admin/reports', icon: BarChart3 },
  { title: 'Admin', url: '/admin/system', icon: Settings },
];

export const MasterAdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  const getNavCls = (path: string) =>
    isActive(path) ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted/50';

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-sm">Master Admin</h2>
            <p className="text-xs text-muted-foreground">Political Office</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Service Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-2 border-t">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
};