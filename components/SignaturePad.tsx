import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';

interface SignaturePadProps {
    onEnd?: (data: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onEnd }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = 128; // h-32
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#1e3a8a'; // Blue-900
            }
        }
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // @ts-ignore
            clientX = e.clientX;
            // @ts-ignore
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling on mobile
        setIsDrawing(true);
        setHasSignature(true);
        const ctx = canvasRef.current?.getContext('2d');
        const { x, y } = getPos(e);
        ctx?.beginPath();
        ctx?.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        const { x, y } = getPos(e);
        ctx?.lineTo(x, y);
        ctx?.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (onEnd && canvasRef.current) {
            onEnd(canvasRef.current.toDataURL());
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
        }
    };

    const saveAsImage = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'assinatura.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <div className="border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-white overflow-hidden touch-none">
            <div className="h-32 w-full bg-gray-50 relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair block"
                />
                {!hasSignature && (
                    <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs select-none pointer-events-none">
                        Assine aqui
                    </span>
                )}
            </div>
            <div className="border-t border-gray-200 p-2 flex justify-between bg-white">
                <button type="button" onClick={clear} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <RotateCcw size={12} /> Limpar
                </button>
                <div className="flex gap-2">
                    <button type="button" onClick={saveAsImage} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                        <Save size={12} /> Salvar Imagem
                    </button>
                </div>
            </div>
        </div>
    );
};
