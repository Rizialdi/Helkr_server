import jwt, { Secret } from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import fetch from 'node-fetch';
import { Context, ProcessUpload } from './api/context';
require('custom-env').env('prod');

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

const getUserId = (context: Context): string => {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');

    const { userId } = jwt.verify(token, APP_SECRET_CODE as Secret) as {
      userId: string;
    };
    return userId;
  }

  throw new Error('Not authenticated');
};

const processUpload: ProcessUpload = async upload => {
  const dataInBase64 = await upload.uri;
  let resultUrl = '';
  const cloudinaryUpload = async (data: string): Promise<void> => {
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

const authentication_step_one = async (
  numero: string
): Promise<{ id: string; status: string }> => {
  const opts = {
    //TODO change this number
    recipient: NUMERO ? NUMERO : numero,
    originator: 'HelpKr App',
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
    body: JSON.stringify(opts)
  });
  const { id, status } = await response.json();
  return { id, status };
};

const authentication_step_two = async (
  id: number,
  token: string
): Promise<{ status: string; errors: string }> => {
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

const addFunction = (a: number, b: number): number => a + b;

export {
  APP_SECRET_CODE,
  getUserId,
  processUpload,
  authentication_step_one,
  authentication_step_two,
  addFunction
};
