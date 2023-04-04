import { ReactElement, useState } from 'react';
import Tabs, { TabType } from '../shared/Tabs';
import UserDailyMenu from '../UserDailyMenu';
import FamilyDailyMenu from '../FamilyDailyMenu';

const tabs: Array<TabType> = [
  {
    label: 'User Daily Menu',
    key: 'userDailyMenu',
    component: <UserDailyMenu />,
  },
  {
    label: 'Family Daily Menu',
    key: 'familyDailyMenu',
    component: <FamilyDailyMenu />,
  },
]

const FoodGuide: React.FC = (): ReactElement => {
  const [tabVal, setTabVal] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabVal(newValue);
  }

  return (
    <Tabs
      value={tabVal}
      handleChange={handleTabChange}
      tabs={tabs}
    />
  );
}
  
  export default FoodGuide;