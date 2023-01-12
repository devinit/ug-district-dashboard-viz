// eslint-disable-next-line import/prefer-default-export
export const getTabOptions = (options, tabID) => {
  if (!tabID || !options) return null;

  return options.find((item) => item.id === tabID);
};

export const groupValuesByLocation = (data) => {
  const temp = {};
  for (let index = 0; index < data.length; index += 1) {
    if (temp[data[index].SubCounty]) {
      temp[data[index].SubCounty] = [...temp[data[index].SubCounty], parseInt(data[index].Value, 10)];
    } else {
      temp[data[index].SubCounty] = [];
    }
  }

  return temp;
};

export const aggregateValues = (data, aggregate) => {
  const groupedData = groupValuesByLocation(data);

  return Object.keys(groupedData).map((key) => {
    const sum = groupedData[key].reduce((partialSum, a) => parseInt(partialSum, 10) + a, 0);
    const avg = sum / groupedData[key].length;

    return {
      SubCounty: key,
      Value: aggregate === 'sum' ? sum : avg,
    };
  });
};

