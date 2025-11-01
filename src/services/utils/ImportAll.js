import camelCase from "lodash/camelCase";

const ImportAll = (files, str='') => {
  return files
    .keys()
    .reduce((acc,file) => ({
      ...acc,
      [camelCase(file.replace(str, ''))]: files(file).default
    }), {});
};

export default ImportAll