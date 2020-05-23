import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import fetch from 'node-fetch';

require('custom-env').env('dev');

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_PRESET,
  APP_SECRET_CODE,
  MESSAGEBIRD_BASE_URL,
  MESSAGEBIRD_API_KEY,
  NUMERO
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

const authentication_step_one = async (numero) => {
  const opts = {
    //TODO change this number
    recipient: NUMERO ? NUMERO : numero,
    originator: 'Yoko App',
    timeout: 60,
    template:
      'Votre code de vérification est %token. Veuillez ne pas le communiquer à une tierce entité.'
  };

  const response = await fetch(`${MESSAGEBIRD_BASE_URL}verify`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `AccessKey test_${MESSAGEBIRD_API_KEY}`
    },
    mode: 'cors',
    body: JSON.stringify(opts)
  });
  const { id, status } = await response.json();
  return { id, status };
};

const authentication_step_two = async (id, token) => {
  const response = await fetch(
    `${MESSAGEBIRD_BASE_URL}verify/${id}/?token=${token}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AccessKey test_${MESSAGEBIRD_API_KEY}`
      }
    }
  );
  const { status, errors } = await response.json();
  return { status, errors };
};

export {
  APP_SECRET_CODE,
  getUserId,
  processUpload,
  authentication_step_one,
  authentication_step_two
};
