import cloudinary from 'cloudinary';
require('custom-env').env('dev');

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const processUpload = async (upload) => {
  const dataInBase64 = await upload.uri;
  let resultUrl = '',
    resultSecureUrl = '';
  const cloudinaryUpload = async (data) => {
    try {
      const results = await cloudinary.v2.uploader.upload(data, {
        upload_preset: 'usul87o6'
      });
      resultUrl = await results.url;
      resultSecureUrl = await results.secure_url;
    } catch (err) {
      throw new Error(`Failed to upload profile picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload(dataInBase64);
  console.log('resultUrl', resultUrl);
  return resultUrl;
};

export { processUpload };
