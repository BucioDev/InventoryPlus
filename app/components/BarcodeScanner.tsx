"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {  Result } from "@zxing/library";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// Aspect ratio and crop size factor
const DESIRED_CROP_ASPECT_RATIO = 3 / 2;
const CROP_SIZE_FACTOR = 0.4;

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayCroppedCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropOverlayRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [barcodeResult, setBarcodeResult] = useState<string>("");
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            intervalId = setInterval(captureFrameAndCrop, 100);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Incapaz de accesar camara, por favor recargar y aceptar permisos");
      }
    };

    

    const captureFrameAndCrop = () => {
      if (!videoRef.current || !displayCroppedCanvasRef.current || !cropOverlayRef.current) return;

      const video = videoRef.current;
      const displayCanvas = displayCroppedCanvasRef.current;
      const displayContext = displayCanvas.getContext("2d");
      const overlayDiv = cropOverlayRef.current;

      if (!displayContext) return;

      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      if (!tempContext) return;

      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      tempContext.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

      let cropWidth, cropHeight;
      const videoRatio = video.videoWidth / video.videoHeight;

      if (videoRatio / DESIRED_CROP_ASPECT_RATIO > 1) {
        cropHeight = video.videoHeight * CROP_SIZE_FACTOR;
        cropWidth = cropHeight * DESIRED_CROP_ASPECT_RATIO;
      } else {
        cropWidth = video.videoWidth * CROP_SIZE_FACTOR;
        cropHeight = cropWidth / DESIRED_CROP_ASPECT_RATIO;
      }

      cropWidth = Math.min(cropWidth, video.videoWidth);
      cropHeight = Math.min(cropHeight, video.videoHeight);

      const MIN_CROP_WIDTH = 240;
      const MAX_CROP_WIDTH = 600;
      const MIN_CROP_HEIGHT = 80;
      const MAX_CROP_HEIGHT = 400;

      cropWidth = Math.max(MIN_CROP_WIDTH, Math.min(MAX_CROP_WIDTH, cropWidth));
      cropHeight = Math.max(MIN_CROP_HEIGHT, Math.min(MAX_CROP_HEIGHT, cropHeight));



      const cropX = (video.videoWidth - cropWidth) / 2;
      const cropY = (video.videoHeight - cropHeight) / 2;

      displayCanvas.width = cropWidth;
      displayCanvas.height = cropHeight;

      displayContext.drawImage(
        tempCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      overlayDiv.style.position = 'absolute';
      overlayDiv.style.left = `${(cropX / video.videoWidth) * 100}%`;
      overlayDiv.style.top = `${(cropY / video.videoHeight) * 100}%`;
      overlayDiv.style.width = `${(cropWidth / video.videoWidth) * 100}%`;
      overlayDiv.style.height = `${(cropHeight / video.videoHeight) * 100}%`;
      overlayDiv.style.border = '2px solid white';
      overlayDiv.style.borderRadius = '0.5rem';
      overlayDiv.style.pointerEvents = 'none';
      overlayDiv.style.boxSizing = 'border-box';

      const decodeCanvas = async () => {
        try {
          const result: Result = await codeReader.current.decodeFromCanvas(displayCanvas);
          console.log("Decoded barcode:", result.getText());
          setBarcodeResult(result.getText());
        } catch (err: unknown) {
           if (err instanceof Error && err.name !== "NotFoundException") {
                console.error("Decoding error:", err);
              }
        }
      };

      decodeCanvas(); // Call the async function
    };

    if (open) {
      startCamera();
    } else {
      // Stop camera when dialog closes
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (intervalId) clearInterval(intervalId);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="my-auto">
        📷 Scanear codigo de barras
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
          Camara activa. El borde blanco indica el area de escaneo del codigo de barras.
          </DialogTitle>
        </DialogHeader>
      
    <div className="flex flex-col items-center font-[sans-serif]" >
      <div className="relative w-full max-w-[400px] overflow-hidden" >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div
          ref={cropOverlayRef}
        ></div>
      </div>

      {error && <p className="mt-4 text-sm text-[#ef4444]">{error}</p>}


      <canvas
        ref={displayCroppedCanvasRef}
        style={{
          border: '2px solid #3b82f6',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '100%',
          height: 'auto',
          display: 'none',
          minWidth: '240px',
          minHeight: '80px',
        }}
      >
        Tu explorar no soporta el elemento canvas.
      </canvas>

        <div style={{
          padding: '1rem',
          border: '2px dashed #10b981',
          borderRadius: '0.5rem',
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          fontSize: '1rem',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          ✅ Barcode : {barcodeResult}
          
          <Input type="text" value={barcodeResult}  className="mt-2 w-full"/>
          
        </div>
    </div>
    </DialogContent>
    </Dialog>
  );
}