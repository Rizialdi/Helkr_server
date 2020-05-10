import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

require('custom-env').env('dev');

const APP_SECRET_CODE = 'HSfg5sdAkLS65DNlfsk4KL45qdSdf5DE';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_PRESET
} = process.env;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const getUserId = (context) => {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET_CODE);
    return userId;
  }

  throw new Error('Not authenticated');
};

const processUpload = async (upload) => {
  const dataInBase64 = await upload.uri;
  let resultUrl = '';
  const cloudinaryUpload = async (data) => {
    try {
      const results = await cloudinary.v2.uploader.upload(data, {
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
        transformation: { width: 300 }
      });
      resultUrl = await results.url;
    } catch (err) {
      throw new Error(`Failed to upload profile picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload(dataInBase64);
  return resultUrl;
};

export { APP_SECRET_CODE, getUserId, processUpload };
