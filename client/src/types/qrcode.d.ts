declare module 'qrcode' {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: string;
  }

  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions
  ): Promise<HTMLCanvasElement>;

  export function toString(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;
}