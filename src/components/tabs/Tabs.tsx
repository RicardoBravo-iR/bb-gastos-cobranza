import React from 'react';
import { TabsContainer, TabButton } from './Tabs.styles';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  // Verificación de props
  if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
    return <div>No hay tabs disponibles</div>;
  }

  if (!activeTab || !setActiveTab) {
    return <div>Error en la configuración de tabs</div>;
  }

  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          isActive={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default Tabs; 