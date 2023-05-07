import {Navigate, createBrowserRouter} from "react-router-dom";
import Home from './pages/Home/Home'
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Guest from "./middlewar/Guest"
import ManageMedicines  from "./pages/Manage/ManageMedicines"
import AddMedicines from "./pages/Manage/AddMedicines"
import UpdateMedicines from "./pages/Manage/UpdateMedicines"
import Admin from "./middlewar/Admin"
import App from './App'
import ManageCategories from "./pages/Manage/ManageCategories";
import AddCategories from "./pages/Manage/AddCategories";
import ManagePatient from "./pages/Manage/ManagePatient";
import AddPatient from "./pages/Manage/AddPatient";
import Details from "./pages/Requests/Details";
import PatientReq from "./pages/Requests/PatientReq";
import ManageReq from "./pages/RequestAdmin/ManageReq";
import UpdateCategory from "./pages/Manage/UpdateCategory";
import ShowHistory from "./showhistory/ShowHistory";
import UpdatePatient from "./pages/Manage/UpdatePatient";
import Contact from "./pages/Contact/Contact";
import Accept from "./pages/RequestAdmin/Accept"
export const routes = createBrowserRouter([
    { 
      
      path: '',
      element: <App />,
      children:[
        {
          path: "/",
          element: <Home />,
        },
        {
          path:"/:id",
          element:<Details />,

        },
        {
          path:"/req",
          element:<PatientReq />,

        },
        {
          path:"/show",
          element:<ShowHistory/>,

        },
        {
          path:"/contact",
          element:<Contact />,

        },
        {
          element: <Guest />,
          children:[
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/register",
              element: <Register />,
            },
            
           
          ],
        },
        {
          path: "/Manage",
          element: <Admin />,
          children: [
            {
              path: '',
              element:<ManageMedicines />,
            },
            {
              path: 'add',
              element:<AddMedicines />,
            },
            {
              path: ':id',
              element:<UpdateMedicines />,
            },
            
          ]
        },
        {
          path: "/Manages",
          element: <Admin />,
          children: [
            {
              path: '',
              element:<ManageCategories />,
            },
            {
              path:'add_category',
              element:<AddCategories />,
            },
            {
              path:'update/:id',
              element:<UpdateCategory />,
            },
            
            
          ]
        },
        {
          path: "/patient",
          element: <Admin />,
          children: [
            {
              path: '',
              element:<ManagePatient />,
            },
            {
              path: 'add_patient',
              element:<AddPatient />,
            },
            {
              path: 'update_patient/:id',
              element:<UpdatePatient />,
            },
          
            
            
          ]
        },
        {
          path: "/request",
          element: <Admin />,
          children: [
            {
              path: '',
              element:<ManageReq />,
            },
            {
              path: 'update_req/:id',
              element:<ManageReq />,
            },
            
            {
              path: 'Accept/:id',
              element:<Accept />,
            },
            
            
          ]
          
        },
        
        
        

      ],
    },
    {
      path: '*',
      element: <Navigate to={"/"} />

    }
    
  ]);