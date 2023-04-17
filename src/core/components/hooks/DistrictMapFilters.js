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
    if (!(topic && topic.indicators && topic.indicators.length)) {
      return [];
    }

    let indicator = topic.indicators[0];
    indicator = topic.indicators.find((ind) => ind.id === selectedIndicator);
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
  useEffect(() => {
    if (filterOptions.indicator) {
      const yearOptions = getIndicatorYearOptions(topics, filterOptions.topic, filterOptions.indicator);
      // only change if the current year isn't one of the year options
      if (yearOptions.length && !yearOptions.find((optn) => optn.value === filterOptions.year)) {
        updateFilterOptions({ year: yearOptions[0].value });
      }
    }
  }, [filterOptions.indicator]);

  return {
    topicOptions: getTopicOptionsFromData(topics || []),
    indicatorOptions: getTopicIndicatorOptions(topics, filterOptions.topic),
    yearOptions: getIndicatorYearOptions(topics, filterOptions.topic, filterOptions.indicator),
  };
};

export default useData;
