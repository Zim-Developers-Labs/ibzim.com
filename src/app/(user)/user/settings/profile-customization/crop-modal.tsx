import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog } from "@headlessui/react";
import UploadProgressBar from "./progress-bar";

interface ImageCropModalProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  isUploading: boolean;
  progress: number;
}

export default function ImageCropModal({
  imageUrl,
  onClose,
  onSave,
  isUploading,
  progress,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onSave(croppedImage as string);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Crop Image
            </h3>
            <div className="relative w-full h-64 mb-4">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            {isUploading && <UploadProgressBar value={progress} />}
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-4 py-2 text-sm font-medium text-white bg-primaryColor rounded-md hover:bg-primaryColor/80"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
