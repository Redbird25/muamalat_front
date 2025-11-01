const storage = {
  get: key => {
    return (window.localStorage && window.localStorage.getItem(key)) || null
  },
  set: (key, data) => {
    if(window.localStorage && data){
      window.localStorage.setItem(key, data);
      return true
    }
  },
  remove: key => {
    if(window.localStorage && window.localStorage[key]){
      window.localStorage.removeItem(key);
      return true
    }
  }
};

export default storage;