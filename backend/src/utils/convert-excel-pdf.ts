import { HttpException } from '@/exceptions';
import axios from 'axios';
import FormData from 'form-data';

export const convertExcelToPdf = async (buffer: any) => {
  const formData = new FormData();
  formData.append(
    'instructions',
    JSON.stringify({
      parts: [
        {
          file: 'document',
        },
      ],
    }),
  );

  formData.append('document', buffer, {
    filename: 'document.xlsx',
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  try {
    const res = await axios.post(`https://api.pspdfkit.com/build`, formData, {
      headers: formData.getHeaders({
        Authorization: `Bearer pdf_live_a7YgWnVCy4S9AIoqWq41sniWtXBsnLhoxHE3hnKISqS`,
      }),
      responseType: 'arraybuffer',
    });

    return res.data;
  } catch (e) {
    throw new HttpException(e.response.status, 'Something went wrong while converting excel to pdf');
  }
};

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}
