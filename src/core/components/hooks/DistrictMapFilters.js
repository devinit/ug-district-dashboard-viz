const getTopicOptionsFromData = (topics) => topics.map((topic) => ({ value: topic.id, label: topic.name }));

const useData = (topics) => {
  console.log(topics);

  return { topicOptions: getTopicOptionsFromData(topics || []) };
};

export default useData;
