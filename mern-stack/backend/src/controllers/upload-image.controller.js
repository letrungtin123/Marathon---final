import { HTTP_STATUS } from '../common/http-status.common.js';
import cloudinary from '../configs/cloudinary.config.js';

export const uploadImage = async (req, res) => {
  const files = req.files;

  if (!Array.isArray(files)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'File is not correct' });
  }

  // Multer CloudinaryStorage đã upload rồi, chỉ cần map kết quả
  const uploadedFiles = files.map((file) => ({
    url: file.path, // path sẽ là Cloudinary secure_url
    public_id: file.filename, // hoặc file.public_id nếu có
  }));

  return res.status(HTTP_STATUS.OK).send({ urls: uploadedFiles });
};

export const deleteImage = async (req, res) => {
  const publicId = req.params.public_id;
  if (!publicId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Public id is not correct' });
  }
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Delete image is not correct', urls: result });
  }
  return res.status(HTTP_STATUS.OK).send({ message: 'Delete image successfully' });
};
