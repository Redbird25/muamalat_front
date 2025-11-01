const session = {
  get: key => {
    return (window.sessionStorage && window.sessionStorage.getItem(key)) || null
  },
  set: (key, data) => {
    if(window.sessionStorage && data){
      window.sessionStorage.setItem(key, data);
      return true
    }
  },
  remove: key => {
    if(window.sessionStorage && window.sessionStorage[key]){
      window.sessionStorage.removeItem(key);
      return true
    }
  }
};

export default session;