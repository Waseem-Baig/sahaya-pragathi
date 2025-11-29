import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { UserRole } from "@/types/government";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  userRole: UserRole;
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  // Core Operations - Executive Portal
  {
    title: "Dashboard",
    url: "/executive/dashboard",
    icon: LayoutDashboard,
    roles: ["L2_EXEC_ADMIN"],
  },
  {
    title: "Assignments",
    url: "/executive/assignments",
    icon: UserCheck,
    roles: ["L2_EXEC_ADMIN"],
  },
  {
    title: "Verification",
    url: "/executive/verification",
    icon: Shield,
    roles: ["L2_EXEC_ADMIN"],
  },
];
const masterDataItems: NavItem[] = [
  {
    title: "Departments",
    url: "/admin/departments",
    icon: Building,
    roles: ["L1_MASTER_ADMIN"],
  },
  {
    title: "Institutions",
    url: "/admin/institutions",
    icon: School,
    roles: ["L1_MASTER_ADMIN"],
  },
  {
    title: "Temples",
    url: "/admin/temples",
    icon: Church,
    roles: ["L1_MASTER_ADMIN"],
  },
  {
    title: "Hospitals",
    url: "/admin/hospitals",
    icon: Hospital,
    roles: ["L1_MASTER_ADMIN"],
  },
  {
    title: "Companies",
    url: "/admin/companies",
    icon: Building2,
    roles: ["L1_MASTER_ADMIN"],
  },
  {
    title: "Locations",
    url: "/admin/locations",
    icon: MapPin,
    roles: ["L1_MASTER_ADMIN"],
  },
];

const systemItems: NavItem[] = [
  {
    title: "Communications",
    url: "/communications",
    icon: MessageCircle,
    roles: ["L1_MASTER_ADMIN", "L2_EXEC_ADMIN"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    roles: ["L1_MASTER_ADMIN", "L2_EXEC_ADMIN"],
  },
  { title: "Admin", url: "/admin", icon: Settings, roles: ["L1_MASTER_ADMIN"] },
];

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const getNavClassName = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/50";

  const filterItemsByRole = (items: NavItem[]) =>
    items.filter((item) => item.roles.includes(userRole));

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
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {renderNavGroup(navItems, "Services")}
        {renderNavGroup(masterDataItems, "Master Data")}
        {renderNavGroup(systemItems, "System")}
      </SidebarContent>
    </Sidebar>
  );
}
