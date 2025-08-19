'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, RefreshCw } from 'lucide-react'

export default function ScanPage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const qrRegionId = 'qr-reader'

  const startScan = async () => {
    if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      return;
    }

    try {
      setError(null);
      setScannedResult(null);

      const config = { fps: 10, qrbox: { width: 250, height: 250 } }

      const qrCodeSuccessCallback = (decodedText: string) => {
        setScannedResult(decodedText)
        stopScan()
      }

      const qrCodeErrorCallback = (errorMessage: string) => {
        // console.warn('QR Error:', errorMessage)
      }
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrRegionId, {
          verbose: false
        });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      )
      setIsScanning(true);
    } catch (err: unknown) {
      console.error(err)
      setError('ไม่สามารถเปิดกล้องได้ หรือไม่พบกล้องในอุปกรณ์')
      setIsScanning(false);
    }
  }

  const stopScan = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setIsScanning(false);
      }).catch((err) => {
        console.error('หยุดกล้องล้มเหลว', err)
      })
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScan();
      }
    }
  }, [])

  const handleRescan = () => {
    setScannedResult(null);
    setError(null);
    setTimeout(() => {
      startScan();
    }, 100);
  }

  return (
    <div className="p-4 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">📷 สแกน QR Code</h1>

      {scannedResult ? (
        <Card className="w-full max-w-md mt-4 text-left">
          <CardHeader>
            <CardTitle className="text-green-500">✅ สแกนสำเร็จ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-all bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-gray-900 dark:text-gray-100">
              {scannedResult}
            </p>
            <Button onClick={handleRescan} className="mt-4 w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              สแกนใหม่
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-md">
          <div id={qrRegionId} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-900" />
          
          {!isScanning && (
            <Button onClick={startScan} className="mt-4 w-full">
              <QrCode className="mr-2 h-4 w-4" />
              เริ่มสแกน
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}