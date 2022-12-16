import { useState } from 'react';

const getTopicOptionsFromData = (topics) => topics.map((topic) => ({ value: topic.id, label: topic.name }));

const useData = (topics) => {
  const [selectedTopic, setSelectedTopic] = useState();
  console.log(selectedTopic);

  return { topicOptions: getTopicOptionsFromData(topics || []), setSelectedTopic };
};

export default useData;
