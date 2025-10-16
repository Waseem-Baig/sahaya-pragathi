import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Scale,
  Church,
  Heart,
  GraduationCap,
  Building2,
  Calendar,
  Users,
  Briefcase,
  Building,
  School,
  MapPin,
  Hospital,
  MessageCircle,
  FileText,
  Settings,
  UserCheck,
  Shield,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { UserRole } from '@/types/government';
import { Badge } from '@/components/ui/badge';

interface AppSidebarProps {
  userRole: UserRole;
}

interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  // Core Operations
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Assignments', url: '/assignments', icon: UserCheck, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Verification', url: '/verification', icon: Shield, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Grievances', url: '/grievances', icon: MessageSquare, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
  { title: 'Disputes', url: '/disputes', icon: Scale, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Temple Letters', url: '/temple-letters', icon: Church, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
  { title: 'CM Relief', url: '/cmrf', icon: Heart, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
  { title: 'Education', url: '/education', icon: GraduationCap, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
  { title: 'CSR/Tenders', url: '/csr', icon: Building2, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Appointments', url: '/appointments', icon: Calendar, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
  { title: 'Resource Pool', url: '/resources', icon: Users, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Programs', url: '/programs', icon: Briefcase, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN', 'L3_CITIZEN'] },
];

const masterDataItems: NavItem[] = [
  { title: 'Departments', url: '/admin/departments', icon: Building, roles: ['L1_MASTER_ADMIN'] },
  { title: 'Institutions', url: '/admin/institutions', icon: School, roles: ['L1_MASTER_ADMIN'] },
  { title: 'Temples', url: '/admin/temples', icon: Church, roles: ['L1_MASTER_ADMIN'] },
  { title: 'Hospitals', url: '/admin/hospitals', icon: Hospital, roles: ['L1_MASTER_ADMIN'] },
  { title: 'Companies', url: '/admin/companies', icon: Building2, roles: ['L1_MASTER_ADMIN'] },
  { title: 'Locations', url: '/admin/locations', icon: MapPin, roles: ['L1_MASTER_ADMIN'] },
];

const systemItems: NavItem[] = [
  { title: 'Communications', url: '/communications', icon: MessageCircle, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Reports', url: '/reports', icon: FileText, roles: ['L1_MASTER_ADMIN', 'L2_EXEC_ADMIN'] },
  { title: 'Admin', url: '/admin', icon: Settings, roles: ['L1_MASTER_ADMIN'] },
];

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const getNavClassName = (path: string) => 
    isActive(path) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  const filterItemsByRole = (items: NavItem[]) => 
    items.filter(item => item.roles.includes(userRole));

  const renderNavGroup = (items: NavItem[], label?: string) => {
    const filteredItems = filterItemsByRole(items);
    if (filteredItems.length === 0) return null;

    return (
      <SidebarGroup>
        {label && !collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavClassName(item.url)}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {renderNavGroup(navItems, 'Services')}
        {renderNavGroup(masterDataItems, 'Master Data')}
        {renderNavGroup(systemItems, 'System')}
      </SidebarContent>
    </Sidebar>
  );
}