import React, {useEffect, useMemo, useRef, useState} from 'react';
import logo_sidebar from "assets/images/icon/logo.svg"
import avatar from "assets/images/icon_avatar.jpg"
import {Link, useLocation, useNavigate} from "react-router-dom";
import * as SolarIconSet from "solar-icon-set";
import {Collapse} from "../../../components";
import {get} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {LOGOUT} from "../../../redux/actions";
import {toast} from "react-toastify";

const CustomSidebar = () => {
  const toastID = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {auth} = useSelector(state => state);
  const [isAccordion, setAccordion] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const {pathname} = useLocation();
  
  const icons = {
    graph: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg" width={20}
                height={20} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M1.66699 1.04175C1.32181 1.04175 1.04199 1.32157 1.04199 1.66675C1.04199 2.01193 1.32181 2.29175 1.66699 2.29175H3.33366V8.75008C3.33366 11.3035 3.33366 12.5802 4.1705 13.3735C5.00733 14.1667 6.3542 14.1667 9.04795 14.1667H9.37533V17.1138L8.05415 17.7744C7.74541 17.9288 7.62027 18.3042 7.77464 18.6129C7.92901 18.9217 8.30443 19.0468 8.61317 18.8924L10.0003 18.1989L11.3875 18.8924C11.6962 19.0468 12.0716 18.9217 12.226 18.6129C12.3804 18.3042 12.2552 17.9288 11.9465 17.7744L10.6253 17.1138V14.1667H10.9527C13.6464 14.1667 14.9933 14.1667 15.8302 13.3735C16.667 12.5802 16.667 11.3035 16.667 8.7501V2.29175H18.3337C18.6788 2.29175 18.9587 2.01193 18.9587 1.66675C18.9587 1.32157 18.6788 1.04175 18.3337 1.04175H1.66699ZM12.9423 6.64147C13.1863 6.88555 13.1863 7.28128 12.9423 7.52536L11.8446 8.62307C11.7237 8.74398 11.5931 8.87473 11.468 8.97021C11.3213 9.08208 11.1116 9.20249 10.8337 9.20249C10.5558 9.20249 10.346 9.08208 10.1994 8.97021C10.0742 8.87473 9.94357 8.74398 9.82276 8.62307L9.31431 8.11461C9.25592 8.05623 9.20858 8.00892 9.16699 7.96866C9.12541 8.00892 9.07806 8.05623 9.01968 8.11461L7.94227 9.19202C7.69819 9.4361 7.30246 9.4361 7.05838 9.19202C6.81431 8.94794 6.81431 8.55222 7.05838 8.30814L8.15609 7.21042C8.27691 7.08951 8.40755 6.95877 8.5327 6.86328C8.67931 6.75142 8.8891 6.631 9.16699 6.631C9.44489 6.631 9.65467 6.75142 9.80129 6.86328C9.92642 6.95875 10.057 7.08948 10.1778 7.21037L10.6863 7.71888C10.7447 7.77727 10.7921 7.82457 10.8337 7.86484C10.8752 7.82457 10.9226 7.77727 10.981 7.71888L12.0584 6.64147C12.3025 6.3974 12.6982 6.3974 12.9423 6.64147Z"
            fill="url(#paint0_linear_5112_8694)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8694" x1="1.04199" y1="10.0001" x2="18.9587" y2="10.0001"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    building: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg"
                   width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M12.5003 1.66675H14.167C15.7383 1.66675 16.524 1.66675 17.0122 2.1549C17.5003 2.64306 17.5003 3.42873 17.5003 5.00008V17.7084H18.3337C18.6788 17.7084 18.9587 17.9882 18.9587 18.3334C18.9587 18.6786 18.6788 18.9584 18.3337 18.9584H1.66699C1.32181 18.9584 1.04199 18.6786 1.04199 18.3334C1.04199 17.9882 1.32181 17.7084 1.66699 17.7084H2.50033V7.50008C2.50033 5.92873 2.50033 5.14306 2.98848 4.6549C3.47664 4.16675 4.26231 4.16675 5.83366 4.16675H9.16699C10.7383 4.16675 11.524 4.16675 12.0122 4.6549C12.5003 5.14306 12.5003 5.92873 12.5003 7.50008V17.7084H13.7503V7.50008L13.7503 7.42551C13.7504 6.70414 13.7505 6.04276 13.6782 5.50474C13.5985 4.91227 13.4111 4.28606 12.8961 3.77102C12.381 3.25598 11.7548 3.06857 11.1623 2.98891C10.6319 2.9176 9.98153 2.91667 9.272 2.91674C9.34224 2.59404 9.45948 2.35057 9.65515 2.1549C10.1433 1.66675 10.929 1.66675 12.5003 1.66675ZM4.37533 6.66675C4.37533 6.32157 4.65515 6.04175 5.00033 6.04175H10.0003C10.3455 6.04175 10.6253 6.32157 10.6253 6.66675C10.6253 7.01193 10.3455 7.29175 10.0003 7.29175H5.00033C4.65515 7.29175 4.37533 7.01193 4.37533 6.66675ZM4.37533 9.16675C4.37533 8.82157 4.65515 8.54175 5.00033 8.54175H10.0003C10.3455 8.54175 10.6253 8.82157 10.6253 9.16675C10.6253 9.51193 10.3455 9.79175 10.0003 9.79175H5.00033C4.65515 9.79175 4.37533 9.51193 4.37533 9.16675ZM4.37533 11.6667C4.37533 11.3216 4.65515 11.0417 5.00033 11.0417H10.0003C10.3455 11.0417 10.6253 11.3216 10.6253 11.6667C10.6253 12.0119 10.3455 12.2917 10.0003 12.2917H5.00033C4.65515 12.2917 4.37533 12.0119 4.37533 11.6667ZM7.50033 15.2084C7.8455 15.2084 8.12533 15.4882 8.12533 15.8334V17.7084H6.87533V15.8334C6.87533 15.4882 7.15515 15.2084 7.50033 15.2084Z"
            fill="url(#paint0_linear_5112_8705)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8705" x1="1.04199" y1="10.3126" x2="18.9587" y2="10.3126"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    box: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg" width={20}
              height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M14.6484 3.69301L12.9818 2.81839C11.5187 2.05063 10.7872 1.66675 10.0003 1.66675C9.21343 1.66675 8.48192 2.05063 7.0189 2.81839L6.7508 2.95908L14.1867 7.20814L17.5339 5.53452C16.9954 4.92466 16.1265 4.4687 14.6484 3.69301Z"
        fill="url(#paint0_linear_5112_8716)"/>
      <path
        d="M18.124 6.63704L14.792 8.30302V10.8334C14.792 11.1786 14.5122 11.4584 14.167 11.4584C13.8218 11.4584 13.542 11.1786 13.542 10.8334V8.92802L10.6253 10.3864V18.2534C11.2236 18.1044 11.9043 17.7472 12.9817 17.1818L14.6484 16.3071C16.4415 15.3662 17.338 14.8957 17.8358 14.0503C18.3337 13.2049 18.3337 12.1529 18.3337 10.0488V9.95134C18.3337 8.37413 18.3337 7.38806 18.124 6.63704Z"
        fill="url(#paint1_linear_5112_8716)"/>
      <path
        d="M9.37533 18.2534V10.3864L1.87669 6.63704C1.66699 7.38806 1.66699 8.37412 1.66699 9.95134V10.0488C1.66699 12.1529 1.66699 13.2049 2.16482 14.0503C2.66265 14.8957 3.55918 15.3662 5.35222 16.3071L7.0189 17.1818C8.09636 17.7472 8.77706 18.1044 9.37533 18.2534Z"
        fill="url(#paint2_linear_5112_8716)"/>
      <path
        d="M2.46674 5.53452L10.0003 9.30131L12.843 7.88L5.43746 3.64829L5.35224 3.69301C3.87411 4.4687 3.00524 4.92466 2.46674 5.53452Z"
        fill="url(#paint3_linear_5112_8716)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8716" x1="1.66699" y1="9.96009" x2="18.3337" y2="9.96009"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint1_linear_5112_8716" x1="1.66699" y1="9.96009" x2="18.3337" y2="9.96009"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint2_linear_5112_8716" x1="1.66699" y1="9.96009" x2="18.3337" y2="9.96009"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint3_linear_5112_8716" x1="1.66699" y1="9.96009" x2="18.3337" y2="9.96009"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    shopping: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg"
                   width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.53364 1.91031C2.208 1.79582 1.85121 1.96699 1.73672 2.29263C1.62223 2.61827 1.79341 2.97506 2.11904 3.08955L2.33672 3.16608C2.89306 3.36167 3.25869 3.4913 3.52772 3.62331C3.78041 3.74729 3.8918 3.84765 3.96519 3.95504C4.0404 4.06511 4.09849 4.21629 4.13126 4.51908C4.16556 4.83592 4.16641 5.2486 4.16641 5.86522L4.16641 8.03329C4.16641 10.4846 4.21911 11.2936 4.94111 12.0551C5.66311 12.8166 6.82515 12.8166 9.14924 12.8166H13.5683C14.8692 12.8166 15.5196 12.8166 15.9794 12.442C16.4391 12.0673 16.5704 11.4303 16.833 10.1562L17.2495 8.13559C17.5387 6.68637 17.6834 5.96176 17.3134 5.48086C16.9435 4.99996 15.6795 4.99996 14.2754 4.99996H5.4102C5.40462 4.77468 5.39405 4.56973 5.374 4.38457C5.32923 3.97092 5.23221 3.59365 4.99723 3.24978C4.76041 2.90323 4.44554 2.68129 4.07835 2.50112C3.73494 2.33262 3.29858 2.17922 2.78481 1.99861L2.53364 1.91031ZM10.8333 6.87496C11.1784 6.87496 11.4583 7.15478 11.4583 7.49996V8.54163H12.4999C12.8451 8.54163 13.1249 8.82145 13.1249 9.16663C13.1249 9.5118 12.8451 9.79163 12.4999 9.79163H11.4583V10.8333C11.4583 11.1785 11.1784 11.4583 10.8333 11.4583C10.4881 11.4583 10.2083 11.1785 10.2083 10.8333V9.79163H9.16658C8.82141 9.79163 8.54158 9.5118 8.54158 9.16663C8.54158 8.82145 8.82141 8.54163 9.16658 8.54163H10.2083V7.49996C10.2083 7.15478 10.4881 6.87496 10.8333 6.87496Z"
            fill="url(#paint0_linear_5112_8727)"/>
      <path
        d="M6.24992 15C6.94027 15 7.49992 15.5596 7.49992 16.25C7.49992 16.9403 6.94027 17.5 6.24992 17.5C5.55956 17.5 4.99992 16.9403 4.99992 16.25C4.99992 15.5596 5.55956 15 6.24992 15Z"
        fill="url(#paint1_linear_5112_8727)"/>
      <path
        d="M13.7499 15C14.4403 15 14.9999 15.5597 14.9999 16.25C14.9999 16.9404 14.4403 17.5 13.7499 17.5C13.0596 17.5 12.4999 16.9404 12.4999 16.25C12.4999 15.5597 13.0596 15 13.7499 15Z"
        fill="url(#paint2_linear_5112_8727)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8727" x1="1.70117" y1="9.68739" x2="17.5347" y2="9.68739"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint1_linear_5112_8727" x1="1.70117" y1="9.68739" x2="17.5347" y2="9.68739"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint2_linear_5112_8727" x1="1.70117" y1="9.68739" x2="17.5347" y2="9.68739"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    order: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg" width={20}
                height={20} viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_4906_12323)">
        <path
          d="M7.5 18.3333C7.5 19.2542 6.75417 20 5.83333 20C4.9125 20 4.16667 19.2542 4.16667 18.3333C4.16667 17.4125 4.9125 16.6667 5.83333 16.6667C6.75417 16.6667 7.5 17.4125 7.5 18.3333ZM14.1667 16.6667C13.2458 16.6667 12.5 17.4125 12.5 18.3333C12.5 19.2542 13.2458 20 14.1667 20C15.0875 20 15.8333 19.2542 15.8333 18.3333C15.8333 17.4125 15.0875 16.6667 14.1667 16.6667ZM20 4.16667C20 6.4675 18.1342 8.33333 15.8333 8.33333C13.5325 8.33333 11.6667 6.4675 11.6667 4.16667C11.6667 1.86583 13.5325 0 15.8333 0C18.1342 0 20 1.86583 20 4.16667ZM17.5 5.83333C17.825 5.50833 17.825 4.98 17.5 4.655L16.6667 3.82167V2.5C16.6667 2.04 16.2933 1.66667 15.8333 1.66667C15.3733 1.66667 15 2.04 15 2.5V4.16667C15 4.3875 15.0875 4.6 15.2442 4.75583L16.3217 5.83333C16.6467 6.15833 17.175 6.15833 17.5 5.83333ZM15.8333 10.0958C12.6167 10.0958 10 7.47833 10 4.2625C10 3.64833 10.0967 3.05667 10.2742 2.5H4.36833L4.33417 2.20667C4.185 0.948333 3.1175 0 1.85167 0H0.833333C0.3725 0 0 0.373333 0 0.833333C0 1.29333 0.3725 1.66667 0.833333 1.66667H1.85167C2.27417 1.66667 2.63 1.98333 2.67917 2.4025L3.82583 12.1542C4.07333 14.2517 5.8525 15.8342 7.96417 15.8342H15.8333C16.2942 15.8342 16.6667 15.4608 16.6667 15.0008C16.6667 14.5408 16.2942 14.1675 15.8333 14.1675H7.96417C6.8875 14.1675 5.96083 13.4792 5.61417 12.5008H15.1342C17.1133 12.5008 18.8317 11.0925 19.2192 9.15167L19.2533 8.97917C18.2908 9.67917 17.1117 10.0967 15.8333 10.0967V10.0958Z"
          fill="url(#paint0_linear_4906_12323)"/>
      </g>
      <defs>
        <linearGradient id="paint0_linear_4906_12323" x1="0" y1="10" x2="20" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <clipPath id="clip0_4906_12323">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>,
    comments: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg"
                   width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M18.3337 7.08341C18.3337 4.09187 15.9085 1.66675 12.917 1.66675C11.1813 1.66675 9.63622 2.48533 8.64491 3.75609C12.8729 3.91955 16.2503 7.39873 16.2503 11.6667C16.2503 11.7587 16.2488 11.8502 16.2457 11.9414L16.5225 12.0155C17.3278 12.231 18.0645 11.4942 17.8491 10.689L17.7429 10.2923C17.6572 9.9718 17.7087 9.63326 17.8466 9.33152C18.1594 8.64674 18.3337 7.88543 18.3337 7.08341Z"
        fill="url(#paint0_linear_5112_8735)"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M15.0003 11.6667C15.0003 15.3486 12.0156 18.3334 8.33366 18.3334C7.30407 18.3334 6.329 18.1 5.45846 17.6832C5.15925 17.54 4.82027 17.4897 4.49981 17.5755L3.47812 17.8488C2.67284 18.0643 1.93612 17.3276 2.15158 16.5223L2.42495 15.5006C2.5107 15.1801 2.4604 14.8412 2.31716 14.542C1.90039 13.6714 1.66699 12.6963 1.66699 11.6667C1.66699 7.98485 4.65176 5.00008 8.33366 5.00008C12.0156 5.00008 15.0003 7.98485 15.0003 11.6667ZM5.41699 12.5001C5.87723 12.5001 6.25033 12.127 6.25033 11.6667C6.25033 11.2065 5.87723 10.8334 5.41699 10.8334C4.95675 10.8334 4.58366 11.2065 4.58366 11.6667C4.58366 12.127 4.95675 12.5001 5.41699 12.5001ZM8.33366 12.5001C8.7939 12.5001 9.16699 12.127 9.16699 11.6667C9.16699 11.2065 8.7939 10.8334 8.33366 10.8334C7.87342 10.8334 7.50033 11.2065 7.50033 11.6667C7.50033 12.127 7.87342 12.5001 8.33366 12.5001ZM11.2503 12.5001C11.7106 12.5001 12.0837 12.127 12.0837 11.6667C12.0837 11.2065 11.7106 10.8334 11.2503 10.8334C10.7901 10.8334 10.417 11.2065 10.417 11.6667C10.417 12.127 10.7901 12.5001 11.2503 12.5001Z"
            fill="url(#paint1_linear_5112_8735)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8735" x1="1.66699" y1="10.0001" x2="18.3337" y2="10.0001"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint1_linear_5112_8735" x1="1.66699" y1="10.0001" x2="18.3337" y2="10.0001"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    personal: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg"
                   width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M8.33366 3.33325H11.667C14.8097 3.33325 16.381 3.33325 17.3573 4.30956C18.3337 5.28587 18.3337 6.85722 18.3337 9.99992C18.3337 13.1426 18.3337 14.714 17.3573 15.6903C16.381 16.6666 14.8097 16.6666 11.667 16.6666H8.33366C5.19096 16.6666 3.61961 16.6666 2.6433 15.6903C1.66699 14.714 1.66699 13.1426 1.66699 9.99992C1.66699 6.85722 1.66699 5.28587 2.6433 4.30956C3.61961 3.33325 5.19096 3.33325 8.33366 3.33325ZM11.042 7.49992C11.042 7.15474 11.3218 6.87492 11.667 6.87492H15.8337C16.1788 6.87492 16.4587 7.15474 16.4587 7.49992C16.4587 7.8451 16.1788 8.12492 15.8337 8.12492H11.667C11.3218 8.12492 11.042 7.8451 11.042 7.49992ZM11.8753 9.99992C11.8753 9.65474 12.1551 9.37492 12.5003 9.37492H15.8337C16.1788 9.37492 16.4587 9.65474 16.4587 9.99992C16.4587 10.3451 16.1788 10.6249 15.8337 10.6249H12.5003C12.1551 10.6249 11.8753 10.3451 11.8753 9.99992ZM12.7087 12.4999C12.7087 12.1547 12.9885 11.8749 13.3337 11.8749H15.8337C16.1788 11.8749 16.4587 12.1547 16.4587 12.4999C16.4587 12.8451 16.1788 13.1249 15.8337 13.1249H13.3337C12.9885 13.1249 12.7087 12.8451 12.7087 12.4999ZM9.16699 7.49992C9.16699 8.42039 8.4208 9.16658 7.50033 9.16658C6.57985 9.16658 5.83366 8.42039 5.83366 7.49992C5.83366 6.57944 6.57985 5.83325 7.50033 5.83325C8.4208 5.83325 9.16699 6.57944 9.16699 7.49992ZM7.50033 14.1666C10.8337 14.1666 10.8337 13.4204 10.8337 12.4999C10.8337 11.5794 9.34127 10.8333 7.50033 10.8333C5.65938 10.8333 4.16699 11.5794 4.16699 12.4999C4.16699 13.4204 4.16699 14.1666 7.50033 14.1666Z"
            fill="url(#paint0_linear_5112_8749)"/>
      <defs>
        <linearGradient id="paint0_linear_5112_8749" x1="1.66699" y1="9.99992" x2="18.3337" y2="9.99992"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    home: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg" width={20}
               height={20} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.09966 6.51928C1.66699 7.30972 1.66699 8.26323 1.66699 10.1703V11.4378C1.66699 14.6885 1.66699 16.3139 2.6433 17.3238C3.61961 18.3337 5.19096 18.3337 8.33366 18.3337H11.667C14.8097 18.3337 16.381 18.3337 17.3573 17.3238C18.3337 16.3139 18.3337 14.6885 18.3337 11.4378V10.1703C18.3337 8.26323 18.3337 7.30972 17.901 6.51928C17.4683 5.72883 16.6779 5.23825 15.097 4.2571L13.4303 3.22272C11.7592 2.18557 10.9236 1.66699 10.0003 1.66699C9.07705 1.66699 8.24148 2.18557 6.57035 3.22272L4.90369 4.2571C3.32278 5.23825 2.53233 5.72883 2.09966 6.51928ZM7.8725 12.8316C7.5952 12.626 7.20377 12.6842 6.99822 12.9615C6.79267 13.2388 6.85084 13.6302 7.12815 13.8358C7.93849 14.4364 8.92952 14.792 10.0003 14.792C11.0711 14.792 12.0622 14.4364 12.8725 13.8358C13.1498 13.6302 13.208 13.2388 13.0024 12.9615C12.7969 12.6842 12.4055 12.626 12.1281 12.8316C11.5212 13.2814 10.7886 13.542 10.0003 13.542C9.21208 13.542 8.47945 13.2814 7.8725 12.8316Z"
            fill="url(#paint0_linear_4902_12205)"/>
      <defs>
        <linearGradient id="paint0_linear_4902_12205" x1="1.66699" y1="10.0003" x2="18.3337" y2="10.0003"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>,
    reviews: <svg style={{overflowClipMargin: "unset", overflow: "unset"}} xmlns="http://www.w3.org/2000/svg" width={20}
                  height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M8.56433 13.763C8.56821 13.6714 8.71986 13.6351 8.76483 13.7149C8.97593 14.0897 9.33605 14.6408 9.74468 14.8914C10.1533 15.142 10.8078 15.2131 11.2375 15.2313C11.3291 15.2352 11.3654 15.3869 11.2856 15.4318C10.9109 15.6429 10.3597 16.003 10.1091 16.4117C9.85854 16.8203 9.78745 17.4748 9.76921 17.9045C9.76532 17.9961 9.61368 18.0324 9.56871 17.9526C9.35761 17.5779 8.99749 17.0267 8.58886 16.7761C8.18023 16.5255 7.52572 16.4544 7.096 16.4362C7.00445 16.4323 6.9681 16.2807 7.04793 16.2357C7.42268 16.0246 7.97381 15.6645 8.2244 15.2559C8.47499 14.8472 8.54609 14.1927 8.56433 13.763Z"
        fill="url(#paint0_linear_4906_12363)"/>
      <path
        d="M15.4092 12.9296C15.4022 12.8382 15.2423 12.7999 15.1946 12.8781C15.051 13.1135 14.844 13.3977 14.6138 13.5388C14.3837 13.68 14.0365 13.7357 13.7616 13.7569C13.6703 13.764 13.6319 13.9238 13.7102 13.9715C13.9456 14.1151 14.2297 14.3222 14.3708 14.5523C14.512 14.7825 14.5677 15.1296 14.5889 15.4046C14.596 15.4959 14.7559 15.5342 14.8036 15.456C14.9472 15.2206 15.1542 14.9364 15.3844 14.7953C15.6145 14.6542 15.9616 14.5984 16.2366 14.5772C16.3279 14.5702 16.3663 14.4103 16.288 14.3626C16.0526 14.219 15.7685 14.0119 15.6273 13.7818C15.4862 13.5516 15.4305 13.2045 15.4092 12.9296Z"
        fill="url(#paint1_linear_4906_12363)"/>
      <path
        d="M12.2522 3.33517L12.0503 3.08011C11.2697 2.09421 10.8795 1.60126 10.4254 1.67403C9.9714 1.7468 9.75429 2.3371 9.32009 3.51768L9.20775 3.82312C9.08437 4.1586 9.02267 4.32635 8.90435 4.44946C8.78603 4.57258 8.62447 4.63714 8.30136 4.76625L8.0072 4.88379L7.80065 4.96644C6.80105 5.36749 6.29736 5.59475 6.23305 6.03636C6.16445 6.5074 6.64121 6.91036 7.59471 7.71628L7.84139 7.92478C8.11235 8.1538 8.24783 8.26831 8.32549 8.42439C8.40315 8.58047 8.41421 8.76044 8.43632 9.1204L8.45645 9.44811C8.53427 10.7148 8.57318 11.3482 8.98481 11.5665C9.39645 11.7849 9.90819 11.4436 10.9317 10.7611L10.9317 10.7611L11.1965 10.5845C11.4873 10.3906 11.6328 10.2936 11.7991 10.267C11.9654 10.2403 12.1338 10.287 12.4706 10.3803L12.7772 10.4653C13.9623 10.7938 14.5549 10.9581 14.8779 10.622C15.2009 10.2859 15.0404 9.67204 14.7195 8.44431L14.6364 8.12668C14.5452 7.7778 14.4996 7.60336 14.5248 7.4308C14.5499 7.25825 14.6429 7.10713 14.8289 6.80487L14.8289 6.80486L14.9983 6.52968C15.6529 5.46602 15.9802 4.93418 15.7682 4.50811C15.5562 4.08204 14.9453 4.0439 13.7234 3.96763L13.4073 3.9479C13.0601 3.92622 12.8865 3.91538 12.7357 3.8354C12.5849 3.75541 12.474 3.61533 12.2522 3.33517L12.2522 3.33517Z"
        fill="url(#paint2_linear_4906_12363)"/>
      <path
        d="M7.36315 11.1054C5.58208 11.9755 4.10008 13.3537 3.54102 15.0005C2.91389 11.0775 3.78378 8.5442 5.17822 6.96973C5.29838 7.21533 5.45453 7.41866 5.59479 7.57757C5.88637 7.90792 6.30497 8.26155 6.73001 8.62063L7.03586 8.87911C7.09385 8.92813 7.13896 8.96629 7.1773 8.99937C7.18119 9.05299 7.18506 9.11559 7.19004 9.1967L7.21489 9.60129C7.24829 10.1471 7.2809 10.6799 7.36315 11.1054Z"
        fill="url(#paint3_linear_4906_12363)"/>
      <defs>
        <linearGradient id="paint0_linear_4906_12363" x1="7.00391" y1="15.8338" x2="11.3296" y2="15.8338"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint1_linear_4906_12363" x1="13.668" y1="14.1671" x2="16.3302" y2="14.1671"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint2_linear_4906_12363" x1="6.22656" y1="6.64956" x2="15.8324" y2="6.64956"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
        <linearGradient id="paint3_linear_4906_12363" x1="3.33398" y1="10.9851" x2="7.36315" y2="10.9851"
                        gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2C881"/>
          <stop offset="1" stopColor="#8B6F2A"/>
        </linearGradient>
      </defs>
    </svg>
  }
  
  const filterListSideBar = (role_id) => {
    switch (role_id) {
      case 3:
        return [
          {
            title: "Главная",
            path: "/dashboard",
            state: null,
            match: path => path === "/dashboard",
            clickOn: () => null,
            icon: get(icons, "home")
          },
          {
            title: "Профиль",
            path: "/dashboard/profile",
            state: null,
            match: path => path.includes("/dashboard/profile"),
            clickOn: () => null,
            icon: get(icons, "personal")
          },
          {
            title: "Покупки",
            pathname: "",
            state: null,
            match: path => path.includes("/dashboard/company"),
            clickOn: () => null,
            icon: get(icons, "order"),
            children_collapse: [
              {
                title: "Заказы",
                path: "/dashboard/shopping/order",
                state: null,
                match: path => path.includes("/dashboard/shopping/order"),
                clickOn: () => null,
                icon: null
              },
              {
                title: "Избранные продукты",
                path: "/dashboard/shopping/favorite",
                state: null,
                match: path => path.includes("/dashboard/shopping/favorite"),
                clickOn: () => null,
                icon: null
              }
            ]
          },
          {
            title: "Отзывы",
            path: "/dashboard/reviews",
            state: null,
            match: path => path.includes("/dashboard/reviews"),
            clickOn: () => null,
            icon: get(icons, "reviews")
          },
          {
            title: "Выход",
            path: "",
            state: null,
            match: () => null,
            clickOn: () => {
              toastID.current = toast("Harakat amalga oshirilmoqda!", {
                theme: "colored",
                type: toast.TYPE.WARNING,
                autoClose: false,
                icon: <i className="fad fa-spinner-third fa-spin"/>
              });
              dispatch(LOGOUT.request({
                navigate: () => navigate("/", {replace: true}),
                cb: {
                  success: () => {
                    navigate("/", {replace: true});
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: "Platfordan chiqish amalga oshirildi!",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null
                    }, 900);
                  },
                  error: (error) => {
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: get(error, "message"),
                        type: toast.TYPE.ERROR,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null
                    }, 900);
                  },
                  finally: () => {
                  
                  }
                }
              }))
            },
            icon: <SolarIconSet.Login3 svgProps={{width: 20, height: 20}} color={"#F04E79"} iconStyle={"Bold"}
                                       size={20}/>
          }
        ]
      case 4:
        return [
          {
            title: "Cтатистика",
            path: "/dashboard",
            state: null,
            match: path => path === "/dashboard",
            clickOn: () => null,
            icon: get(icons, "graph")
          },
          {
            title: "Компания",
            path: "/dashboard/company",
            state: null,
            match: path => path.includes("/dashboard/company"),
            clickOn: () => null,
            icon: get(icons, "building")
          },
          {
            title: "Товары",
            path: "/dashboard/products",
            state: null,
            match: path => path.includes("/dashboard/products"),
            clickOn: () => null,
            icon: get(icons, "box")
          },
          {
            title: "Заказы",
            path: "/dashboard/orders",
            state: null,
            match: path => path === "/dashboard/orders" || path === "/dashboard/archive",
            clickOn: () => null,
            icon: get(icons, "shopping")
          },
          {
            title: "Отзывы",
            path: "/dashboard/reviews",
            state: null,
            match: path => path.includes("/dashboard/reviews"),
            clickOn: () => null,
            icon: get(icons, "comments")
          },/*
      {
        title: "Личные данные",
        path: "/dashboard/personal",
        state: null,
        match: path => path.includes("/dashboard/personal"),
        clickOn: () => null,
        icon: get(icons, "personal")
      },*/
          {
            title: "Выход",
            path: "",
            state: null,
            match: () => null,
            clickOn: () => {
              toastID.current = toast("Harakat amalga oshirilmoqda!", {
                theme: "colored",
                type: toast.TYPE.WARNING,
                autoClose: false,
                icon: <i className="fad fa-spinner-third fa-spin"/>
              });
              dispatch(LOGOUT.request({
                navigate: () => navigate("/", {replace: true}),
                cb: {
                  success: () => {
                    navigate("/", {replace: true});
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: "Platfordan chiqish amalga oshirildi!",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null
                    }, 900);
                  },
                  error: (error) => {
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: get(error, "message"),
                        type: toast.TYPE.ERROR,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null
                    }, 900);
                  },
                  finally: () => {
                  
                  }
                }
              }))
            },
            icon: <SolarIconSet.Login3 svgProps={{width: 20, height: 20}} color={"#F04E79"} iconStyle={"Bold"}
                                       size={20}/>
          },
        ]
      case 5:
        return [
          {
            title: "Главная",
            path: "/dashboard",
            state: null,
            match: path => path === "/dashboard",
            clickOn: () => null,
            icon: get(icons, "home")
          },
          {
            title: "Профиль",
            path: "/dashboard/profile",
            state: null,
            match: path => path.includes("/dashboard/profile"),
            clickOn: () => null,
            icon: get(icons, "personal")
          },
          {
            title: "Заказы",
            path: "/dashboard/orders",
            state: null,
            match: path => path.includes("/dashboard/orders"),
            clickOn: () => null,
            icon: get(icons, "shopping")
          },
          {
            title: "Выход",
            path: "",
            state: null,
            match: () => null,
            clickOn: () => {
              toastID.current = toast("Harakat amalga oshirilmoqda!", {
                theme: "colored",
                type: toast.TYPE.WARNING,
                autoClose: false,
                icon: <i className="fad fa-spinner-third fa-spin"/>
              });
              dispatch(LOGOUT.request({
                navigate: () => navigate("/", {replace: true}),
                cb: {
                  success: () => {
                    navigate("/", {replace: true});
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: "Platfordan chiqish amalga oshirildi!",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null;
                    }, 900);
                  },
                  error: (error) => {
                    setTimeout(() => {
                      toast.update(toastID.current, {
                        theme: "colored",
                        render: get(error, "message"),
                        type: toast.TYPE.ERROR,
                        autoClose: 900,
                        icon: <i className="fas fa-check-circle"/>,
                        className: "animated-toastify",
                      });
                      toastID.current = null;
                    }, 900);
                  },
                  finally: () => {
                  
                  }
                }
              }))
            },
            icon: <SolarIconSet.Login3 svgProps={{width: 20, height: 20}} color={"#F04E79"} iconStyle={"Bold"}
                                       size={20}/>
          },
        ]
      default:
        return []
    }
  }
  
  const list_sidebar =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => filterListSideBar(parseInt(get(auth, "data.user.role_id"))), [auth])
  useEffect(() => {
    if (pathname) {
      list_sidebar.forEach(item => {
        if (get(item, "children_collapse", []).length) {
          setAccordion(!!get(item, "children_collapse", []).find(fnd => fnd.match(pathname)))
        }
      })
    }
  }, [auth, pathname, list_sidebar])
  
  return (
    <div className={`admin-aside-container ${isOpen ? "active" : ""}`}>
      <aside className={`admin-aside ${isOpen ? "active" : ""}`}>
        <div
          className={[3, 5].includes(parseInt(get(auth, "data.user.role_id"))) ? "d-flex-align-center" : "d-flex-between-center"}
          id="admin-menu">
          {
            [3, 5].includes(parseInt(get(auth, "data.user.role_id")))
              ? <>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    border: "2px solid #D1B64C"
                  }}
                  className={"rounded-circle overflow-hidden me-2"}
                >
                  <img src={avatar} className={"w-100"} alt="avatar"/>
                </div>
                
                <div>
                  <p className={"fs-14 lh-15 text-141316 mb-0"}>Кабинет {parseInt(get(auth, "data.user.role_id")) === 5 ? "курьера" : "покупателя"}</p>
                  
                  <p className={"fs-14 text-141316 fw-700 mb-0"}>Анвар Мухторов</p>
                </div>
              </>
              : <>
                <button onClick={() => setOpen(!isOpen)} type="button"
                        className="h-100 btn focus-none p-0 text-decoration-none">
                  <img src={logo_sidebar} className="admin-aside_logo" alt="logo"/>
                </button>
                
                
                <button onClick={() => setOpen(!isOpen)} type="button" className="btn fs-20 focus-none px-0">
                  <i className="far fa-bars"/>
                </button>
              </>
          }
        </div>
        
        <ul className="admin-aside_list">
          {
            list_sidebar.map((item, number) =>
              get(item, "children_collapse", []).length
                ? <li
                  key={number}
                  onClick={get(item, "clickOn")}
                  className={"admin-aside_list__i accord text-nowrap"}>
                  <div className="accordion">
                    <div className={`accordion-item`}>
                      <h2 className="accordion-header" onClick={() => setAccordion(!isAccordion)}>
                        <button className={`accordion-button focus-none ${!isAccordion ? "collapsed" : ""}`}
                                type="button">
                          {get(item, "icon")}
                          
                          <span>{get(item, "title")}</span>
                        </button>
                      </h2>
                      
                      <Collapse className={"accordion-collapse"}
                                classNameChildren={`accordion-body ${isAccordion ? "" : ""} p-0`}
                                isOpen={isAccordion}>
                        <ul className="p-0 m-0">
                          {
                            get(item, "children_collapse", []).map((child, num) =>
                              <li
                                key={num}
                                className={`admin-aside_list__a ${child.match(pathname) ? "active" : ""}`}>
                                <Link
                                  state={get(item, "state")}
                                  to={get(child, "path")}
                                  className={`d-block text-reset text-decoration-none`}>
                                  {get(child, "title")}
                                </Link>
                              </li>
                            )
                          }
                        </ul>
                      </Collapse>
                    </div>
                  </div>
                </li>
                : <li key={number} onClick={get(item, "clickOn")}
                      className={`admin-aside_list__i text-nowrap ${item.match(pathname) ? "active" : ""}`}>
                  {
                    get(item, "path")
                      ? <Link state={get(item, "state")} to={get(item, "path")}
                              className="text-decoration-none d-flex-align-center">
                        {get(item, "icon")}
                        <span className="admin-aside_list__i_t  ms-2">{get(item, "title")}</span>
                      </Link>
                      : <div className={"d-flex-align-center cursor-pointer"}>
                        {get(item, "icon")}
                        <span className="admin-aside_list__i_t  ms-2">{get(item, "title")}</span>
                      </div>
                  }
                
                </li>
            )
          }
          
          {/*<li className={`admin-aside_list__i text-nowrap ${pathname === "/dashboard/products" ? "active" : ""}`}>
            <Link to={"/dashboard/products"} className="text-decoration-none d-flex-align-center">
              <i className="fi fi-sr-hand-holding-box fs-20 lh-18 me-1"/>
              <span className="admin-aside_list__i_t  ms-2">Товары</span>
            </Link>
          </li>
          
          <li className={"admin-aside_list__i accord text-nowrap"}>
            <div className="accordion" id="accordionMenu">
              <div className={`accordion-item`}>
                <h2 className="accordion-header" id="headingMenu" onClick={() => setAccordion(!isAccordion)}>
                  <button className={`accordion-button focus-none ${!isAccordion ? "collapsed" : ""}`} type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseMenu" aria-expanded="true"
                          aria-controls="collapseMenu">
                    <i className="fi fi-sr-order-history fs-20 lh-18 me-1"/>
                    
                    <span>Заказы</span>
                  </button>
                </h2>
                
                <Collapse className={"accordion-collapse"}
                          classNameChildren={`accordion-body ${isAccordion ? "" : ""} p-0`}
                          isOpen={isAccordion}>
                  <ul className="p-0 m-0">
                    <li className={`admin-aside_list__a ${pathname === "/dashboard/orders" ? "active" : ""}`}>
                      <Link to={"/dashboard/orders"} className="d-block text-75758b text-decoration-none">
                        Активные
                      </Link>
                    </li>
                    
                    <li className="admin-aside_list__a">
                      <Link to={"/dashboard/orders"} className="d-block text-75758b text-decoration-none">
                        Активные
                      </Link>
                    </li>
                    
                    <li className="admin-aside_list__a">
                      <Link to={"/dashboard/orders"} className="d-block text-75758b text-decoration-none">
                        Активные
                      </Link>
                    </li>
                  </ul>
                </Collapse>
              </div>
            </div>
          </li>
          
          <li className={`admin-aside_list__i text-nowrap ${pathname === "/dashboard/reviews" ? "active" : ""}`}>
            <Link to={"/dashboard/reviews"} className="text-decoration-none d-flex-align-center">
              <i className="fi fi-sr-feedback-review fs-20 lh-18 me-1"/>
              <span className="admin-aside_list__i_t  ms-2">Отзывы</span>
            </Link>
          </li>
          
          <li className={`admin-aside_list__i text-nowrap ${pathname === "/dashboard/personal" ? "active" : ""}`}>
            <Link to={"/dashboard/personal"} className="text-decoration-none d-flex-align-center">
              <i className="fi fi-sr-dashboard-monitor fs-20 lh-18 me-1"/>
              <span className="admin-aside_list__i_t  ms-2">Личные данные</span>
            </Link>
          </li>*/}
        </ul>
      </aside>
    </div>
  );
};

export default CustomSidebar;
