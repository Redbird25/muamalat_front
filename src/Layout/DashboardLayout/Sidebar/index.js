import React, {useEffect, useState} from 'react';
import './sidebar.scss';
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation} from "react-router-dom";
import get from "lodash.get";
import logo from "assets/images/logo.svg"
import SidebarLogoSolo from 'assets/images/logo-solo.png';
import {MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu, Menu, SidebarFooter} from "react-pro-sidebar";
import {CHANGE_MOBILE, LOGOUT, UTILITY} from "redux/actions";
import {toast} from "react-toastify";
import {Responsive} from "services/utils";

const Sidebar = () => {
  const dispatch = useDispatch();
  const screenSize = Responsive();
  const {auth, system: {sidebarToggle, mobileToggle}} = useSelector(state => state);
  const [toggle, setToggle] = useState(parseInt(mobileToggle));
  const {pathname, search} = useLocation();
  
  const iconRender = (menu) => (
    menu.icon.type !== "i" ?
      <span
        className={`btn menu-btn border-0 ${menu.match(pathname + search) ? `active ${get(menu, "classIconActive")}` ?? "" : ''}`}>
              <img src={menu?.icon} alt={"icon"}/></span>
      : <span
        className={`btn menu-btn border-0 ${menu.match(pathname + search) ? `active ${get(menu, "classIconActive")}` ?? "" : ''}`}>
              {menu.icon}
            </span>
  )
  
  const handleSidebar = menu => {
    if (!get(menu, 'children')) {
      return (
        <MenuItem
          key={menu.id}
          className={`${menu.match(pathname + search) ? `active ${get(menu, "classActiveMenu")}` : ''}`}
          icon={iconRender(menu)}
          suffix={menu?.suffix ? menu?.suffix() : null}
        >
          <span className={"d-inline-block text-nowrap"}>{menu.title}</span>
          <Link to={get(menu, "path")} state={get(menu, "state")}/>
        </MenuItem>
      )
    }
    
    return <SubMenu
      key={menu.id}
      className={`${menu.match(pathname) ? 'text-white' : ''} px-1 px-1`}
      title={menu.title}
      // prefix={menu.icon ? <i className={menu.icon}/> : null}
      icon={iconRender(menu)}
      defaultOpen={menu.isOpen(pathname)}
      open={menu.open}
    >
      {
        get(menu, 'children').length
          ? get(menu, 'children').map(item => handleSidebar(item))
          : null
      }
    </SubMenu>
  };
  
  const sidebarMenus = {
    /* Admin = Admin */
    1: [],
    /* Customer = Buyurtmachi */
    2: [
      {
        id: 1,
        title: "Bosh sahifa",
        path: "/dashboard",
        match: path => path === "/dashboard",
        icon: <i className="hgi hgi-stroke hgi-home-03 fs-19"/>
      },
      {
        id: 2,
        title: "Murojaatlar",
        path: "/dashboard/appeals",
        match: path => path.includes("/dashboard/appeal"),
        icon: <i className="hgi hgi-stroke hgi-file-01 fs-19"/>
      }
    ],
    3: [
      {
        id: 1,
        title: "Bosh sahifa",
        path: "/dashboard",
        match: path => path === "/dashboard",
        icon: <i className="hgi hgi-stroke hgi-home-03 fs-19"/>
      },
      {
        id: 2,
        title: "Murojaatlar",
        path: "/dashboard/appeals",
        match: path => path.includes("/dashboard/appeal"),
        icon: <i className="hgi hgi-stroke hgi-file-01 fs-19"/>
      }
    ]
  }
  
  useEffect(() => {
    if (screenSize.width <= 768) {
      if (parseInt(sidebarToggle) === 0) {
        dispatch(UTILITY.success({sidebarToggle: 1}))
      }
    }
  }, [dispatch, screenSize, sidebarToggle])
  
  useEffect(() => {
    setToggle(parseInt(mobileToggle))
  }, [mobileToggle]);
  
  if (!get(auth, "isAuthenticated") || !pathname.includes("/dashboard")) {
    return null
  } else {
    return (
      <ProSidebar
        width={300}
        collapsedWidth={75}
        collapsed={!!parseInt(sidebarToggle)}
        toggled={!!toggle}
        breakPoint={"md"}
        onToggle={() => {
          setToggle((prev) => !prev);
          dispatch(CHANGE_MOBILE.success(0));
          dispatch(UTILITY.success({sidebarToggle: 1}))
        }}
      >
        <SidebarHeader className={"bg-white border-bottom-0"}>
          <div className="d-flex-between-center menu-logo px-3 py-2">
            <Link to="/dashboard" className={`${parseInt(sidebarToggle) ? "w-0" : "w-100"} h-100`}>
              <img
                src={logo}
                alt={"Shaffof"}
                className={`d-md-block ${parseInt(sidebarToggle) ? "w-0" : "w-auto"} d-none h-100 ms-1`}
              />
              
              <img
                src={SidebarLogoSolo}
                alt={"Shaffof"}
                width={45}
                className={`d-md-none h-100`}
              />
            </Link>
            
            <button className={"btn d-md-block d-none menu-btn focus-none"}
                    onClick={() => dispatch(UTILITY.success({sidebarToggle: parseInt(sidebarToggle) ? "0" : "1"}))}>
              
              <i
                className={`fa-regular transition-05 fa-angle-left ${parseInt(sidebarToggle) ? 'fa-rotate-180' : ''}`}/>
            </button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            {
              get(auth, 'data.user.role_id') && sidebarMenus[get(auth, 'data.user.role_id')]
                ? sidebarMenus[get(auth, 'data.user.role_id')].map((item) => handleSidebar(item))
                : null
            }
          </Menu>
        </SidebarContent>
        <SidebarFooter className={"px-3 py-2"}>
          <div
            className={"d-flex-between-center cursor-pointer"}
            onClick={() => {
              dispatch(LOGOUT.request({
                url: '/logout',
                cb: {
                  success: () => {
                    toast.success("Platfordan chiqish amalga oshirildi!");
                  },
                  error: () => {
                    toast.error("Xatolik yuz berdi!");
                  },
                  finally: () => {
                    
                  }
                }
              }));
            }}
          >
            <div className={"d-flex-center "}>
              <button className="btn menu-btn focus-none mr-10">
                <i className="hgi hgi-stroke hgi-login-03 fs-19"/>
              </button>
              <span
                className={`text-181D25 transition-05 ${parseInt(sidebarToggle) ? "opacity-0" : "opacity-1"}`}>Chiqish</span>
            </div>
          </div>
        </SidebarFooter>
      </ProSidebar>
    );
  }
  
  
};

export default Sidebar;
