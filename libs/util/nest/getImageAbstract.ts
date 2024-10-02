import axios from "axios";
import lqip from "lqip";
import sizeOf from "image-size";

export const getImageAbstract = async (
  url: string
): Promise<{ abstractData?: string; imageSize?: [number, number] }> => {
  const abstract: { abstractData?: string; imageSize?: [number, number] } = {};
  try {
    // base64encoded image string
    const abstractData = await (lqip as { base64: (data) => Promise<string> }).base64(encodeURI(url));
    abstract.abstractData = abstractData;
  } catch (e) {
    //
  }
  try {
    const response = await axios({ url, method: "GET", responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data as string, "binary");
    const { width, height } = sizeOf(buffer);
    abstract.imageSize = [width ?? 0, height ?? 0];
  } catch (e) {
    //
  }
  return abstract;
};
