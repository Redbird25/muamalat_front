import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

const Collapse = ({
                    children,
                    isOpen=true,
                    defaultHeight,
                    height,
                    changeHeight,
                    defaultWidth,
                    defaultMaxWidth,
                    defaultStyle,
                    className = '',
                    classNameChildren = '',
                    view
                  }) => {
  
  const filterRef = useRef(null);
  useEffect(() => {
    if (filterRef.current) {
      if (defaultHeight) {
        filterRef.current.style.overflow = 'hidden';
      }
      if (!isOpen) {
        // filterRef.current.style.maxHeight = filterRef.current.scrollHeight + 'px';
        filterRef.current.style.maxHeight = defaultHeight + 'px';
        filterRef.current.style.overflow = 'hidden';
      } else {
        if (changeHeight || view) {
          filterRef.current.style.maxHeight = filterRef.current.scrollHeight + 'px';
          setTimeout(() => {
            filterRef.current.style.overflow = 'unset';
          }, 100)
        } else {
          
          setTimeout(() => {
            filterRef.current.style.maxHeight = filterRef.current.scrollHeight + 'px';
            filterRef.current.style.overflow = 'unset';
          }, 100)
        }
      }
    }
  }, [isOpen, defaultHeight, changeHeight, view]);
  return (
    <div
      ref={filterRef}
      className={`collapse-wrapper ${className}`}
      style={{
        overflowY: 'hidden',
        overflowX: 'hidden',
        transition: 'all 0.2s linear',
        maxHeight: defaultHeight,
        height: height,
        width: defaultWidth,
        maxWidth: defaultMaxWidth,
        ...defaultStyle
      }}
    >
      <div className={classNameChildren}>
        {children}
      </div>
    </div>
  );
};

Collapse.defaultProps = {
  isOpen: false,
  defaultHeight: 0,
  defaultWidth: 'unset',
  defaultMaxWidth: 'unset',
  defaultStyle: null,
  height: 'unset'
};

Collapse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  defaultHeight: PropTypes.number,
  defaultWidth: PropTypes.any,
  defaultMaxWidth: PropTypes.any,
  defaultStyle: PropTypes.object,
  height: PropTypes.any
};

export default Collapse;