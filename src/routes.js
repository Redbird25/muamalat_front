import React, {lazy, Suspense, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from "react-router-dom";
import {Spinner} from "./components";
import NotFound from "./pages/NotFound";
import {useSelector} from "react-redux";
import get from "lodash.get";
import Header from "./Layout/DashboardLayout/Header";
import Footer from "./Layout/DashboardLayout/Footer";


/* Client */
const MainClient = lazy(() => import("./pages/Customer/Main"));
const OrderClient = lazy(() => import("./pages/Customer/Order"));
const FavouritesClient = lazy(() => import("./pages/Customer/Favourites"));
const ReviewsClient = lazy(() => import("./pages/Customer/Reviews"));
const ProfileClient = lazy(() => import("./pages/Customer/Profile"));

/* Seller */
const LoginSaler = lazy(() => import("./pages/Seller/LoginSaler"));
const RegistrationSaler = lazy(() => import("./pages/Seller/RegistrationSaler"));
const CompanySaler = lazy(() => import("./pages/Seller/Company"));
const CompanyAccountCreateSaler = lazy(() => import("./pages/Seller/Account"));
const CompanyCommissionerSaler = lazy(() => import("./pages/Seller/Commissioner"));
const ReviewsSaler = lazy(() => import("./pages/Seller/Reviews"));
const ProductCreateSaler = lazy(() => import("./pages/Seller/ProductCreate"));

/* Courier */
const CourierDashboard = lazy(() => import("./pages/Courier/Dashboard"));
const CourierAccount = lazy(() => import("./pages/Courier/Account"));
const CourierOrders = lazy(() => import("./pages/Courier/Orders"));
const CourierView = lazy(() => import("./pages/Courier/View"));

const DashboardLayout = lazy(() => import("./Layout/DashboardLayout"));
const MasterLayout = lazy(() => import("./Layout/MasterLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CatalogSingle = lazy(() => import("./pages/CatalogSingle"));
const ProductSingle = lazy(() => import("./pages/ProductSingle"));

const ProductFavourites = lazy(() => import("./pages/LikeCart"));
const ProductBaskets = lazy(() => import("./pages/BasketCart"));
const ProductBasketsOrder = lazy(() => import("./pages/BasketOrder"));

/* isLogin Pages */

const MainPage = lazy(() => import("./pages/Main"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Personal = lazy(() => import("./pages/Personal"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LoginCourier = lazy(() => import("./pages/Courier/IsLogin"))
const MasterDashboard = lazy(() => import("./pages/Master/Dashboard"));
const MasterCatalog = lazy(() => import("./pages/Master/Catalog"));
const MasterModeration = lazy(() => import("./pages/Master/Moderation"));
const MasterPromotions = lazy(() => import("./pages/Master/Promotions"));
const MasterMerchants = lazy(() => import("./pages/Master/Merchants"));
const MerchantsPreview = lazy(() => import("./pages/Master/Merchants/Preview"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

const publicRoutes = [
  {
    path: "/",
    element: <MainPage/>
  },
  {
    path: "admin-login",
    element: <AdminLogin/>
  },
  {
    path: "login",
    element: <LoginSaler/>
  },
  {
    path: "seller-registration",
    element: <RegistrationSaler/>
  },
  {
    path: "catalog/:id",
    element: <CatalogSingle/>
  },
  {
    path: "product/:id",
    element: <ProductSingle/>
  },
  {
    path: "favourites",
    element: <ProductFavourites/>
  },
  {
    path: "basket",
    element: <ProductBaskets/>
  },
  {
    path: "basket-order",
    element: <ProductBasketsOrder/>
  },
  {
    path: "create-account",
    element: <CompanyAccountCreateSaler/>,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy/>
  },
  {
    path: "/login-courier",
    element: <LoginCourier/>
  }
]

const privateRoutes = {
  /* Admin = Admin */
  1: [
    {
      path: "/dashboard",
      element: <MasterLayout/>,
      children: [
        {
          index: true,
          element: <MasterDashboard/>,
        },
        {
          path: "catalog",
          element: <MasterCatalog/>
        },
        {
          path: "merchants",
          element: <MasterMerchants/>
        },
        {
          path: "merchants/:profileId/document/:documentId",
          element: <MerchantsPreview/>
        },
        {
          path: "moderation",
          element: <MasterModeration/>
        },
        {
          path: "promotions",
          element: <MasterPromotions/>
        }
      ]
    }
  ],
  /* Moderator */
  2: [
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <Dashboard/>,
        },
        {
          path: "products",
          element: <Products/>,
        },
        {
          path: "orders",
          element: <Orders/>,
        },
        {
          path: "reviews",
          element: <Reviews/>
        },
        {
          path: "personal",
          element: <Personal/>
        }
      ]
    }
  ],
  /* Client */
  3: [
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <MainClient/>,
        },
        {
          path: "shopping/order",
          element: <OrderClient/>
        },
        {
          path: "shopping/favorite",
          element: <FavouritesClient/>
        },
        {
          path: "products",
          element: <Products/>,
        },
        {
          path: "orders",
          element: <Orders/>,
        },
        {
          path: "reviews",
          element: <ReviewsClient/>
        },
        {
          path: "profile",
          element: <ProfileClient/>
        }
      ]
    }
  ],
  /* Seller */
  4: [
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <Dashboard/>,
        },
        {
          path: "company",
          element: <CompanySaler/>,
        },
        {
          path: "company/create-account",
          element: <CompanyAccountCreateSaler/>,
        },
        {
          path: "company/commissioner",
          element: <CompanyCommissionerSaler/>,
        },
        {
          path: "products",
          element: <Products/>,
        },
        {
          path: "products/create",
          element: <ProductCreateSaler/>,
        },
        {
          path: ":type",
          element: <Orders/>,
        },
        {
          path: "reviews",
          element: <ReviewsSaler/>
        },
        {
          path: "personal",
          element: <Personal/>
        }
      ]
    }
  ],
  /* Courier */
  5: [
    {
      path: "/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          index: true,
          element: <CourierDashboard/>
        },
        {
          path: "profile",
          element: <CourierAccount/>
        },
        {
          path: "orders",
          element: <CourierOrders/>
        },
        {
          path: "orders/view/:id",
          element: <CourierView/>
        }
      ]
    }
  ],
}

const RouterContent = ({auth}) => {
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const hideChrome = location.pathname.startsWith('/dashboard');
  
  const handleRoute = (route, key) => {
    
    if (!get(route, 'children')) {
      const routeProps = {
        element: route?.element,
      }
      
      if (route?.path) {
        routeProps["path"] = get(route, "path");
      }
      if (route?.index) {
        routeProps["index"] = get(route, "index");
      }
      return <React.Fragment key={key}><Route {...routeProps}/></React.Fragment>
    }
    
    return (
      <Route
        path={route.path}
        element={route.element}
        key={key}
      >
        {
          route?.children?.map((child, key) => handleRoute(child, key))
        }
      </Route>
    )
  };
  
  
  return (
    <>
      {!hideChrome && <Header {...{mobileMenu, setMobileMenu}}/>}
      <Routes>
        {
          publicRoutes.map((route, key) => handleRoute(route, key))
        }
        {
          auth.isAuthenticated && privateRoutes[parseInt(get(auth, 'data.user.role_id'))]
            ? privateRoutes[parseInt(get(auth, 'data.user.role_id'))].map((route, key) => handleRoute(route, key))
            : null
        }
        <Route path={"/404"} element={<NotFound/>}/>
        <Route path={"*"} element={<Navigate to={'/404'}/>}/>
      </Routes>
      {!hideChrome && <Footer {...{setMobileMenu}}/>}
    </>
  );
};

const RoutesComponent = () => {
  const {auth} = useSelector(state => state);
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <Suspense fallback={<Spinner center/>}>
        <RouterContent auth={auth}/>
      </Suspense>
    </Router>
  );
};

export default RoutesComponent;
