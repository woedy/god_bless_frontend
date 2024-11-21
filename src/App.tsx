import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import Dashboard from './pages/Dashboard/Dashboard';

import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import SignUp from './pages/Authentication/SignUp';
import SignIn from './pages/Authentication/SignIn';

import AddRegion from './pages/Regions/AddRegion';
import AllRegions from './pages/Regions/AllRegions';
import RegionDetails from './pages/Regions/RegionDetails';
import AllNumbers from './pages/AllNumbers/AllNumbers';
import GenerateNumbers from './pages/AllNumbers/GenerateNumbers';
import ValidateNumber from './pages/Validation/ValidateNumber.tsx';
import ValidateInfo from './pages/AllNumbers/ValidateInfo.tsx';

const hiddenOnRoutes = ['/', '/signup', '/signin'];




function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout pathname={pathname} hiddenOnRoutes={hiddenOnRoutes}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Dashboard | God Bless America" />
              <Dashboard />
            </>
          }
        />

        <Route
          index
          element={
            <>
              <PageTitle title="Sign In | God Bless America" />
              <SignIn />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <PageTitle title="Sign Up | God Bless America" />
              <SignUp />
            </>
          }
        />

        <Route
          path="/signin"
          element={
            <>
              <PageTitle title="Sign In | God Bless America" />
              <SignIn />
            </>
          }
        />



        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | God Bless America " />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | God Bless America" />
              <Buttons />
            </>
          }
        />

        {/* Elections Navigation Here */}

        <Route
          path="/add-region"
          element={
            <>
              <PageTitle title="Add region - Sels | Smart Election Ledger System" />
              <AddRegion />
            </>
          }
        />

        <Route
          path="/all-regions"
          element={
            <>
              <PageTitle title="All regions - Sels | Smart Election Ledger System" />
              <AllRegions />
            </>
          }
        />

        <Route
          path="/region-details/:region_id"
          element={
            <>
              <PageTitle title="Region Details - Sels | Smart Election Ledger System" />
              <RegionDetails />
            </>
          }
        />



<Route
          path="/all-numbers"
          element={
            <>
              <PageTitle title="All Numbers - God Bless America" />
              <AllNumbers />
            </>
          }
        />


<Route
          path="/validate-number"
          element={
            <>
              <PageTitle title="Validate Number - God Bless America" />
              <ValidateNumber />
            </>
          }
        />





<Route
          path="/generate-numbers"
          element={
            <>
              <PageTitle title="Generate Numbers - God Bless America" />
              <GenerateNumbers />
            </>
          }
        />

<Route
          path="/validate-info"
          element={
            <>
              <PageTitle title="Validate Info - God Bless America" />
              <ValidateInfo />
            </>
          }
        />



        


      </Routes>
    </DefaultLayout>
  );
}

export default App;
