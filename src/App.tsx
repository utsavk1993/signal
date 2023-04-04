import React, { ReactElement } from 'react';
import FoodGuide from './components/FoodGuide';

const App: React.FC = (): ReactElement => {
  return (
    <>
      <h1>Welcome to the Food Guide!</h1>
      <FoodGuide />
    </>
  );
}

export default App;
