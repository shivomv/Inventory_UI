import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import {
  LayoutDashboard,
  Package,
  Layers,
  SlidersHorizontal,
  Warehouse,
  Boxes,
  MoveRight,
  Settings,
  MapPin,
  Wrench,
  ClipboardList,
  ListOrdered,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Building2,
  FileBarChart,
  BarChart3,
  ChevronDown,
  ChevronRight,
  X,
  ChevronLeft,
  Menu as MenuIcon,
  FileText,
  Database,
  ShoppingBag,
  AlertTriangle,
  Plus,
  User,
  Factory,
  Palette,
  Ruler,
  Tag,
  Truck,
  ClipboardCheck,
  Users,
  BookOpen,
  FileText as InvoiceIcon,
  PieChart,
  BarChart2,
  Home,
  Archive,
  IndianRupee,
  ShoppingBasket,
  ClipboardList as BOMIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import PropTypes from 'prop-types';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: (props) => <Home {...props} color="#2563eb" />, // blue
  },
  {
    title: 'Masters',
    href: '/stock/masters',
    icon: (props) => <ListOrdered {...props} color="#eab308" />, // yellow
  },
  {
    title: 'Stock',
    href: '/stock',
    icon: (props) => <Warehouse {...props} color="#10b981" />, // green
    children: [
      { title: 'Stock Item', href: '/stock/register', icon: (props) => <Database {...props} color="#f43f5e" /> }, // red
    ],
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: (props) => <ShoppingCart {...props} color="#f59e42" />, // orange
    children: [
      { title: 'Purchase Orders', href: '/orders/purchase', icon: (props) => <IndianRupee {...props} color="#22d3ee" /> }, // cyan
      { title: 'Sales Orders', href: '/orders/sales', icon: (props) => <TrendingUp {...props} color="#a21caf" /> }, // purple
    ],
  },
  {
    title: 'Consumables',
    href: '/consumables',
    icon: (props) => <ShoppingBag {...props} color="#0ea5e9" />, // sky
  },
  {
    title: 'Scrap',
    href: '/scrap',
    icon: (props) => <AlertTriangle {...props} color="#be185d" />, // pink
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: (props) => <InvoiceIcon {...props} color="#6366f1" />, // indigo
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: (props) => <PieChart {...props} color="#84cc16" />, // lime
  },
  
  {
    title: 'User Management',
    href: '/usermanagement',
    icon: (props) => <Users {...props} color="#0f766e" />, // teal
  },
];

// Helper to check if a menu or its children is active
function isMenuActive(item, pathname) {
  if (item.href === pathname) return true;
  if (item.children) {
    return item.children.some(child => isMenuActive(child, pathname));
  }
  return false;
}

const Sidebar = ({ isOpen, onClose }) => {
  // Track expanded state for each parent menu by href
  const [expandedMenus, setExpandedMenus] = React.useState({});
  // Track collapsed state for the whole sidebar
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const handleToggleMenu = (href) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-white text-gray-900 border-r border-slate-200/60 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-[72px]" : "w-64"
      )}>
        <div className="relative border-b border-slate-200/60 bg-white">
          {/* Logo and Title */}
          <div className={cn(
            "flex items-center py-4",
            collapsed ? "justify-center" : "px-4"
          )}>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <img 
                  src="/vite.svg" 
                  alt="InvenTree Logo" 
                  className="w-5 h-5 text-white" 
                />
              </div>
              {!collapsed && (
                <h1 className="text-lg font-semibold text-slate-800">
                  InvenTree
                </h1>
              )}
            </div>
          </div>

          {/* Toggle Button - Positioned Absolutely */}
          <button
            onClick={handleToggleSidebar}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200",
              collapsed ? "-right-3" : "-right-3"
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            )}
          </button>

          
        </div>
        <div className="flex-1 overflow-y-auto bg-white">
          <nav className={cn(
            "pt-3 pb-8",
            collapsed ? "px-2" : "px-3"
          )}>
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  onItemClick={onClose}
                  expandedMenus={expandedMenus}
                  onToggleMenu={handleToggleMenu}
                  collapsed={collapsed}
                  pathname={location.pathname}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const NavItem = ({ item, level = 0, onItemClick, expandedMenus, onToggleMenu, collapsed, pathname }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = expandedMenus && expandedMenus[item.href];
  const isActive = item.href === pathname;
  const isChildActive = hasChildren && item.children.some(child => child.href === pathname);

  const handleClick = () => {
    if (hasChildren) {
      onToggleMenu(item.href);
    } else if (onItemClick) {
      // Only close sidebar on mobile
      if (window.innerWidth < 1024 && onItemClick) {
        onItemClick();
      }
    }
  };

  // Popover for collapsed sidebar and parent items
  if (hasChildren && collapsed) {
    return (
      <li>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              onClick={handleClick}
              className={cn(
                'w-full flex items-center justify-center p-2 rounded hover:bg-gray-100 focus:bg-gray-200 transition-colors',
                isChildActive && 'bg-gray-200 text-blue-700 font-semibold'
              )}
              aria-expanded={isOpen}
              aria-controls={`submenu-${item.href}`}
              title={item.title}
            >
              {typeof item.icon === 'function' ? item.icon({ className: 'w-6 h-6 flex-shrink-0' }) : <item.icon className="w-6 h-6 flex-shrink-0" />}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content side="right" align="start" className="z-50 bg-white rounded shadow-lg border border-gray-100 p-2 min-w-[160px]">
              <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {typeof item.icon === 'function' ? item.icon({ className: 'w-5 h-5' }) : <item.icon className="w-5 h-5" />}
                <span>{item.title}</span>
              </div>
              <ul className="space-y-1">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <NavLink
                      to={child.href}
                      onClick={onItemClick}
                      className={({ isActive: navIsActive }) =>
                        cn(
                          'flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 focus:bg-gray-200 transition-colors',
                          (navIsActive || pathname === child.href) && 'bg-gray-200 text-blue-700 font-semibold'
                        )
                      }
                    >
                      {typeof child.icon === 'function' ? child.icon({ className: 'w-5 h-5 mr-2' }) : <child.icon className="w-5 h-5 mr-2" />}
                      <span>{child.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </li>
    );
  }

  return (
    <li>
      <div>
        {hasChildren ? (
          <button
            onClick={handleClick}
            className={cn('w-full flex items-center rounded-xl transition-all duration-200 text-base font-medium',
                level > 0 && 'ml-3 text-sm',
                isChildActive && 'bg-blue-50/80 text-blue-600',
                collapsed ? 'justify-center p-2.5' : 'p-2.5',
                !isChildActive && 'hover:bg-slate-100'
            )}
            aria-expanded={isOpen}
            aria-controls={`submenu-${item.href}`}
            title={item.title}
          >
            {typeof item.icon === 'function' ? item.icon({ className: 'w-6 h-6 flex-shrink-0' }) : <item.icon className="w-6 h-6 flex-shrink-0" />}
            {!collapsed && <span className="flex-1 text-left truncate ml-3">{item.title}</span>}
            {!collapsed && (isOpen ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            ))}
          </button>
        ) : (
          <NavLink
            to={item.href}
            onClick={onItemClick}
            className={({ isActive: navIsActive }) =>
              cn(
                'flex items-center rounded-xl transition-all duration-200 text-base font-medium',
                level > 0 && 'ml-3 text-sm',
                (navIsActive || isActive) ? 'bg-blue-50/80 text-blue-600' : 'hover:bg-slate-100',
                collapsed ? 'justify-center p-2.5' : 'p-2.5'
              )
            }
            title={item.title}
          >
            {typeof item.icon === 'function' ? item.icon({ className: 'w-6 h-6 flex-shrink-0' }) : <item.icon className="w-6 h-6 flex-shrink-0" />}
            {!collapsed && <span className="truncate ml-3">{item.title}</span>}
          </NavLink>
        )}
      </div>
      {hasChildren && !collapsed && (
        <ul
          id={`submenu-${item.href}`}
          className={cn(
            'overflow-hidden transition-all duration-300 ml-4 border-l border-gray-100 pl-2',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
          style={{
            transitionProperty: 'max-height, opacity',
            marginTop: '2px',
            marginBottom: '6px',
          }}
        >
          {item.children && item.children.map((child) => (
            <NavItem
              key={child.href}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
              expandedMenus={expandedMenus}
              onToggleMenu={onToggleMenu}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  onItemClick: PropTypes.func,
  expandedMenus: PropTypes.object,
  onToggleMenu: PropTypes.func,
  collapsed: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
};

export default Sidebar;