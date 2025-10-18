import { Request, Response } from 'express';
import cloudinary from '../services/cloudinary.js';

interface CloudinaryUploadResult {
  secure_url: string;
}

export const uploadBoletim = async (req: Request, res: Response) => {
  const { alunoId } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0)
    return res.status(400).send('Nenhum arquivo enviado');

  const uploadedDocs: { nome: string; url: string }[] = [];

  try {
    for (const file of files) {
      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `matriculas/${alunoId}`,
              resource_type:
                file.mimetype === 'application/pdf' ? 'raw' : 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            },
          );
          stream.end(file.buffer); 
        },
      );

      uploadedDocs.push({ nome: file.originalname, url: result.secure_url });
    }

    res.json({ success: true, documentos: uploadedDocs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err });
  }
};
