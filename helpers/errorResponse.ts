const errResponse = (err: Error) => {
  const msg = {
    err: err.message,
    stack: err.stack,
  };

  return msg;
};

export default errResponse;
