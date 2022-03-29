const generateResponse = (
  status: number,
  data: Record<any, any>,
  json: Record<any, any> = {}
) => {
  const response = {
    status: status,
    message: { ...data, ...json },
  };

  return response;
};
export default generateResponse;
