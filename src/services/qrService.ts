import QRCode from 'qrcode'

export class QrService {
  /**
   * Generates a QR code data URL for opening the current route/destination on a mobile phone.
   */
  public static async generateRouteQrCode(
    destinationId: string,
    currentCoords?: { latitude: number; longitude: number } | null
  ): Promise<string> {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://info-campus-nav.ac.in'
    let url = `${origin}?destination=${encodeURIComponent(destinationId)}`

    if (currentCoords) {
      url += `&lat=${currentCoords.latitude.toFixed(6)}&lng=${currentCoords.longitude.toFixed(6)}&nav=true`
    }

    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
      return qrDataUrl
    } catch (err) {
      console.error('Failed to generate QR code', err)
      return ''
    }
  }
}
