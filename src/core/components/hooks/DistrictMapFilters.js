import { useContext, useEffect } from 'react';
import { getYearsFromRange } from '../../../utils/data';
import { DistrictMapContext } from '../../context';

const getTopicById = (topics, topicId) => topics.find((_topic) => _topic.id === topicId);
const getTopicOptionsFromData = (topics) => topics.map((topic) => ({ value: topic.id, label: topic.name }));
const getTopicIndicatorOptions = (topics, topic) => {
  const matchingTopic = getTopicById(topics, topic);

  return matchingTopic
    ? matchingTopic.indicators.map((indicator) => ({ value: indicator.id, label: indicator.name }))
    : [];
};
const getIndicatorYearOptions = (topics, selectedTopic, selectedIndicator) => {
  if (selectedTopic && selectedIndicator) {
    const topic = getTopicById(topics, selectedTopic);
    const indicator = topic && topic.indicators && topic.indicators.length ? topic.indicators[0] : null;
    if (indicator && indicator.yearRange) {
      return getYearsFromRange(indicator.yearRange).map((year) => ({ value: year, label: year }));
    }
  }

  return [];
};

const useData = (topics) => {
  const { filterOptions, updateFilterOptions } = useContext(DistrictMapContext);

  useEffect(() => {
    if (!filterOptions.topic && topics.length) {
      updateFilterOptions({ topic: topics[0].id });
    }
  }, []);
  useEffect(() => {
    if (filterOptions.topic) {
      const topic = getTopicById(topics, filterOptions.topic);
      const indicator = topic && topic.indicators && topic.indicators.length ? topic.indicators[0] : null;
      if (indicator) {
        updateFilterOptions({ indicator: indicator.id });
      }
    }
  }, [filterOptions.topic]);

  return {
    topicOptions: getTopicOptionsFromData(topics || []),
    indicatorOptions: getTopicIndicatorOptions(topics, filterOptions.topic),
    yearOptions: getIndicatorYearOptions(topics, filterOptions.topic, filterOptions.indicator),
  };
};

export default useData;
