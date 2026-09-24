"use client"

import Image from "next/image";
import { useState } from "react";

interface ImageLoaderProps {
    image:string;
}

export default function ImageWithZoom({image}:ImageLoaderProps) {
    const [img, setImg] = useState<string | null>(null);

    return (
        <>
            <button type="button" onClick={() => setImg(image)}
            className="relative h-16 w-16 cursor-pointer">
                <Image src={image} alt="Product image"
                width={64} height={64}
                className="h-full w-full rounded-lg border object-cover"/>
            </button>

            {img && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                onClick={() => setImg(null)}>
                    <div className="relative max-h [90vh] max-w-[90vh]"
                    onClick={(e) => e.stopPropagation()}>
                        <Image src={img} alt="Full size Product image"
                        width={1200} height={1200}
                        className="max-h-[90vh] w-auto object-contain rounded-lg"/>
                        <button type="button" onClick={() => setImg(null)}
                        className="absolute -right-5 -top-5 flex h-10 w-10 items-center justify-between rounded-full bg-white text-xl font-semibold leading-none text-red-500 shadow-lg hover:bg-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}