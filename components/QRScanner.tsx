import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerProps {
    onScan: (code: string) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const scannerId = "reader";
        const html5QrCode = new Html5Qrcode(scannerId);

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                html5QrCode.stop().then(() => {
                    onScan(decodedText);
                });
            },
            (errorMessage) => {
                // console.log(errorMessage); // Ignore parse errors
            }
        ).catch((err) => {
            setError("Erro ao iniciar câmera. Permita o acesso.");
            console.error(err);
        });

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().catch((e) => console.error(e));
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 z-10">
                <X size={32} />
            </button>

            <div className="relative w-full max-w-sm aspect-square bg-black overflow-hidden mb-8">
                <div id="reader" className="w-full h-full"></div>
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center p-4">
                        {error}
                    </div>
                )}
            </div>

            <p className="text-white text-center px-8">Aponte a câmera para o código QR do ativo.</p>
        </div>
    );
};
