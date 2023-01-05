import { useContext, useEffect } from 'react';
import { DistrictMapContext } from '../../context';

const getTopicOptionsFromData = (topics) => topics.map((topic) => ({ value: topic.id, label: topic.name }));
const getTopicIndicatorOptions = (topic, topics) => {
  const matchingTopic = topics.find((_topic) => _topic.id === topic);

  return matchingTopic
    ? matchingTopic.indicators.map((indicator) => ({ value: indicator.id, label: indicator.name }))
    : [];
};

const useData = (topics) => {
  const { filterOptions, updateFilterOptions } = useContext(DistrictMapContext);

  useEffect(() => {
    if (!filterOptions.topic && topics.length) {
      updateFilterOptions({ topic: topics[0].id });
    }
  }, []);

  return {
    topicOptions: getTopicOptionsFromData(topics || []),
    indicatorOptions: getTopicIndicatorOptions(filterOptions.topic, topics),
  };
};

export default useData;
