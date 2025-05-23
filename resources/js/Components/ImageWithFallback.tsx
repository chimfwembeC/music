import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
    src: string;
    fallbackSrc: string;
    alt: string;
    className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    fallbackSrc,
    alt,
    className = '',
}) => {
    const [imgSrc, setImgSrc] = useState<string>(src);
    const [imgError, setImgError] = useState<boolean>(false);

    // Reset error state when src changes
    useEffect(() => {
        setImgSrc(src);
        setImgError(false);
    }, [src]);

    // Handle image load error
    const handleError = () => {
        if (!imgError) {
            setImgError(true);
            setImgSrc(fallbackSrc);
        }
    };

    // Check if the image exists before rendering
    useEffect(() => {
        const checkImageExists = async () => {
            try {
                // Try to fetch the image with a HEAD request
                const response = await fetch(src, { method: 'HEAD' });
                if (!response.ok) {
                    handleError();
                }
            } catch (error) {
                handleError();
            }
        };

        // Only check if it's a full URL or a path that starts with /
        if (src && (src.startsWith('http') || src.startsWith('/'))) {
            checkImageExists();
        }
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
