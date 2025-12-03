import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';
import { ScannerOverlay } from './ScannerOverlay';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
    onScan: (code: string) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [isFound, setIsFound] = useState(false);

    useEffect(() => {
        const scannerId = "reader";
        // Use verbose=false to reduce console noise
        const html5QrCode = new Html5Qrcode(scannerId, false);

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                // Success callback
                setIsFound(true);
                // Play a subtle success sound or vibration if possible
                if (navigator.vibrate) navigator.vibrate(200);

                // Delay slightly to show the "Target Acquired" animation
                setTimeout(() => {
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    }).catch(err => console.error("Failed to stop scanner", err));
                }, 800);
            },
            (errorMessage) => {
                // Error callback (called for every frame where QR is not found)
                // console.log(errorMessage); 
            }
        ).catch((err) => {
            setError("Não foi possível acessar a câmera. Verifique as permissões.");
            console.error("Error starting scanner:", err);
        });

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().catch((e) => console.error("Cleanup error:", e));
            }
        };
    }, [onScan]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Header / Close Button */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent h-24">
                    <div className="text-white/80 text-sm font-medium px-2 py-1 rounded-md bg-black/20 backdrop-blur-sm border border-white/10">
                        <Camera size={16} className="inline mr-2" />
                        Scanner Ativo
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all active:scale-95"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <div id="reader" className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full"></div>

                    {/* Overlay Component */}
                    {!error && <ScannerOverlay isFound={isFound} />}

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-8 text-center">
                            <AlertCircle size={48} className="text-red-500 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">Erro na Câmera</h3>
                            <p className="text-white/70 mb-6">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Fechar Scanner
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
