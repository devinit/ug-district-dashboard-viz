import { useContext } from 'react';
import { DistrictMapContext } from '../../context';

const getTopicOptionsFromData = (topics) => topics.map((topic) => ({ value: topic.id, label: topic.name }));

const useData = (topics) => {
  const { filterOptions } = useContext(DistrictMapContext);
  console.log(filterOptions);

  return { topicOptions: getTopicOptionsFromData(topics || []) };
};

export default useData;
