import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home/Home";
import LoanDetails from "../pages/LoanDetails/LoanDetails";
import LoanApplication from "../pages/LoanApplication/LoanApplication";
import AllLoans from "../pages/AllLoans/AllLoans";
import Profile from "../pages/Profile/Profile";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";

import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AuthLayout from "../layout/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import BorrowerRoute from "./BorrowerRoute";
import DashboardLayout from "../layout/DashboardLayout";
import MyLoans from "../pages/Dashboard/MyLoans/MyLoans";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import AdminAllLoans from "../pages/Dashboard/AdminAllLoans/AdminAllLoans";
import LoanApplications from "../pages/Dashboard/LoanApplications/LoanApplications";
import BorrowerDashboard from "../pages/Dashboard/BorrowerDashboard/BorrowerDashboard";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard/ManagerDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AddLoan from "../pages/Dashboard/AddLoan/AddLoan";
import ManageLoans from "../pages/Dashboard/ManageLoans/ManageLoans";
import PendingLoans from "../pages/Dashboard/PendingLoans/PendingLoans";
import ApprovedLoans from "../pages/Dashboard/ApprovedLoans/ApprovedLoans";
import NotFound from "../pages/Shared/NotFound/NotFound";
import Unauthorized from "../pages/Shared/Unauthorized/Unauthorized";

export const router = createBrowserRouter([
   {
      path: "/",
      Component: RootLayout,
      children: [
         {
            index: true,
            Component: Home
         },
         {
            path: "all-loans",
            Component: AllLoans
         },
         {
            path: "apply-loan",
            Component: LoanApplication
         },
         {
            path: "loan/:id",
            Component: LoanDetails
         },
         {
            path: "profile",
            Component: Profile
         },
         {
            path: "about",
            Component: About
         },
         {
            path: "contact",
            Component: Contact
         }
      ]
   },
   {
      path: "/",
      Component: AuthLayout,
      children: [
         {
            path: "login",
            Component: Login
         },
         {
            path: "register",
            Component: Register
         }
      ]
   },
   {
      path: 'dashboard',
      element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
      children: [
         {
            index: true,
            Component: DashboardHome // Dynamic dashboard based on role
         },
         {
            path: 'borrower',
            element: <BorrowerRoute><BorrowerDashboard /></BorrowerRoute>
         },
         {
            path: 'manager',
            element: <ManagerRoute><ManagerDashboard /></ManagerRoute>
         },
         {
            path: 'admin',
            element: <AdminRoute><AdminDashboard /></AdminRoute>
         },
         {
            path: 'my-loans',
            Component: MyLoans
         }, {
            path: 'profile',
            Component: Profile
         },
         // Admin routes
         {
            path: 'manage-users',
            element: <AdminRoute><ManageUsers/></AdminRoute>
         },
         {
            path: 'admin-all-loans',
            element: <AdminRoute><AdminAllLoans/></AdminRoute>
         },
         {
            path: 'loan-applications',
            element: <AdminRoute><LoanApplications/></AdminRoute>
         },
         // Manager routes
         {
            path: 'add-loan',
            element: <ManagerRoute><AddLoan /></ManagerRoute>
         },
         {
            path: 'update-loan/:id',
            element: <ManagerRoute><AddLoan /></ManagerRoute>
         },
         {
            path: 'manage-loans',
            element: <ManagerRoute><ManageLoans /></ManagerRoute>
         },
         {
            path: 'pending-loans',
            element: <ManagerRoute><PendingLoans /></ManagerRoute>
         },
         {
            path: 'approved-loans',
            element: <ManagerRoute><ApprovedLoans /></ManagerRoute>
         }
      ]
   },
   {
      path: "/unauthorized",
      Component: Unauthorized
   },
   {
      path: "*",
      Component: NotFound
   }
]);
