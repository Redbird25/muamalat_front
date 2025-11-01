const StatusFromID = (status, icon = false, styleClass) => {
  if (styleClass) {
    if (status === 3)
      return "danger"
    else if (status === 2)
      return "warning"
    else if (status === 1)
      return "primary"
    else
      return "secondary"
  } else if (icon) {
    if (status === 3)
      return "hgi-cancel-01"
    else if (status === 2)
      return "hgi-time-02"
    else if (status === 1)
      return "hgi-file-01"
    else
      return "hgi-license-draft"
  } else {
    if (status === 3)
      return "Rad etilgan"
    else if (status === 2)
      return "Jarayonda"
    else if (status === 1)
      return "Yangi"
    else
      return "Qoralama"
  }
};

export default StatusFromID;
