import { IncomingMessage } from "http";

const reqDataHelper = async (req: IncomingMessage) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data: any = JSON.parse(Buffer.concat(buffers).toString());
  return data;
};

export default reqDataHelper;
