// eslint-disable-next-line import/prefer-default-export
export const getTabOptions = (options, tabID) => {
  if (!tabID || !options) return null;

  return options.find((item) => item.id === tabID);
};
