import React from 'react';
import Banner from '../Banner/Banner';

import HowItWorks from '../HowItWorks/HowItWorks';


import CustomerFeedback from '../CustomerFeedback/CustomerFeedback';
import Statistics from '../Statistics/Statistics';
import FAQ from '../FAQ/FAQ';
import AvailableLoans from '../AvailableLoans/AvailableLoans';

const Home = () => {
  return (
    <div>
      <Banner />
      <Statistics />
      <AvailableLoans />
      <HowItWorks />
      <CustomerFeedback />
      <FAQ />
    </div>
  );
};

export default Home;