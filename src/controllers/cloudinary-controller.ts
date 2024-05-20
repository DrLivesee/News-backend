import cloudinary from "@src/utils/cloudinary";

import { Request, Response } from "express";

async function postImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.json({
        success: false,
        message: "No image provided",
      });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Прикрепите картинку размером до 10мб",
      });
    }

    await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "users",
        max_bytes: 10000000,
        quality: "auto:good",
        width: 400,
        height: 400,
        crop: "fill",
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }

        res.status(200).json({
          success: true,
          message: "Uploaded!",
          data: result,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function deleteImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // const public_id = 'users/pthekbkxkys4kedkawsx'

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не указан public_id для удаления изображения",
      });
    }

    await cloudinary.uploader.destroy(`users/${id}`, function (error: any, result: any) {
      if (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
          success: false,
          message: "Ошибка при удалении изображения",
        });
      }

      if (result.result === "not found") {
        return res.status(404).json({
          success: false,
          message: "Изображение не найдено",
        });
      }

      res.status(200).json({
        success: true,
        message: "Изображение успешно удалено",
      });
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера",
    });
  }
}

// async function postImage(req: Request, res: Response): Promise<void> {
//   if (!req.file) return;
//   await cloudinary.uploader.upload(
//     req.file.path,
//     {
//       folder: "users",
//       max_bytes: 10000000,
//       quality: "auto:good",
//       width: 400,
//       height: 400,
//       crop: "fill",
//     },
//     function (err, result) {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           success: false,
//           message: "Error",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: "Uploaded!",
//         data: result,
//       });
//     }
//   );
// }

export { postImage, deleteImage };
