exports.publish = (topic, payload) => {
  console.log(`Kafka Topic: ${topic}`, JSON.stringify(payload));
};