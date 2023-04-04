import { ReactElement, SyntheticEvent, FC } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './TabPanel';

export type TabType = {
  label: string;
  key: string;
  component?: ReactElement;
};

interface TabLayoutProps {
  value: number;
  handleChange: (event: SyntheticEvent, newValue: number) => void;
  tabs: Array<TabType>;
}

const a11yProps = (index: number): object => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabLayout:FC<TabLayoutProps> = ({ value, handleChange, tabs }: TabLayoutProps): ReactElement => (
  <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tab layout">
          {
            tabs.map((tab, index) => (
              <Tab key={tab.key} label={tab.label} {...a11yProps(index)} />
            ))
          }
        </Tabs>
      </Box>
      {
        tabs.map((tab, index) => (
          <TabPanel key={tab.key} value={value} index={index}>
            {tab.component}
          </TabPanel>
        ))
      }
    </Box>
);

export default TabLayout;