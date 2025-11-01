import React, {useCallback, useEffect} from 'react';
import {CSSTransition} from "react-transition-group";
import './modal.scss';

const Modal = ({
                 isOpen,
                 closeOnBack,
                 className,
                 onClose,
                 children,
                 width,
                 minWidth,
                 maxWidth,
                 modalContentClass,
                 height,
                 minHeight,
                 defaultHeight,
                 position,
                 modalPaddingAuto = true,
                 order = 0
               }) => {
  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      onClose()
    }
  }, [onClose]);
  
  useEffect(() => {
    if (closeOnBack) {
      document.addEventListener("keydown", escFunction, false);
    }
    
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [closeOnBack, escFunction]);
  
  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={200}
        unmountOnExit
        classNames="my-modal"
      >
        {(status) => {
          const cls = status === 'entered' && status !== 'exiting' ? 'active' : '';
          
          return <>
            <div
              className={`my-modal ${className}`}
            >
              <div className={`modal-box ${cls} ${position === 'center' ? 'd-flex align-items-center justify-content-center' : ''}`} style={{
                width: width,
                minWidth: minWidth,
                maxWidth: maxWidth,
                maxHeight: minHeight ? "unset" : typeof height === "number" ? height + 'px' : height,
                minHeight: minHeight,
                height: defaultHeight,
                zIndex: 9998 + order
              }}
              >
                {
                  modalPaddingAuto
                    ? <div className={'px-2'}>
                      <div className={modalContentClass ?? 'bg-white custom-rounded-8'}>
                        {children}
                      </div>
                    </div>
                    : children
                }
              
              </div>
              <div tabIndex={-1} style={{zIndex: 9998 + order - 1}} className={`modal-mask ${cls}`}
                   onClick={() => closeOnBack ? onClose() : null}/>
            </div>
          </>
        }}
      </CSSTransition>
    </>
  );
};

Modal.defaultProps = {
  width: 900,
  minWidth: 0,
  maxWidth: null,
  height: 400,
  minHeight: 0,
  position: 'top',
  className: '',
  closeOnBack: true,
};

export default Modal;