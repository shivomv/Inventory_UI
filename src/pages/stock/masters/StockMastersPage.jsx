import React, { useState } from 'react';
import PaperTypeMasterPage from './ProductMaster';
import UnitMasterPage from './UnitMasterPage';
import LocationMasterPage from './LocationMasterPage';
import SupplierMasterPage from './SupplierMasterPage';
import CompanyMasterPage from './CompanyMaster';
import { FileTextIcon, PackageIcon, MapPinIcon, UsersIcon, Building2Icon } from 'lucide-react';

const tabs = [
  { label: 'Products', icon: FileTextIcon, component: <PaperTypeMasterPage /> },
  { label: 'Units', icon: PackageIcon, component: <UnitMasterPage /> },
  { label: 'Locations', icon: MapPinIcon, component: <LocationMasterPage /> },
  { label: 'Suppliers', icon: UsersIcon, component: <SupplierMasterPage /> },
  { label: 'Companies', icon: Building2Icon, component: <CompanyMasterPage /> },
];

const StockMastersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Masters</h1>
      <div className="mb-4 border-b">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors duration-200 focus:outline-none ${isActive ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab(idx)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div>
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default StockMastersPage;
