/**
 * MediaRecorder Canvas Video Exporter
 * Captures real-time or frame-by-frame 9:16 canvas playback and triggers a video download.
 */

export interface ExportProgress {
  progress: number; // 0 to 1
  currentTime: number;
  totalDuration: number;
  status: 'recording' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export function getSupportedMimeType(): { mimeType: string; extension: string } {
  const candidateTypes = [
    { type: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { type: 'video/mp4', ext: 'mp4' },
    { type: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { type: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { type: 'video/webm', ext: 'webm' },
  ];

  for (const candidate of candidateTypes) {
    if (MediaRecorder.isTypeSupported(candidate.type)) {
      return { mimeType: candidate.type, extension: candidate.ext };
    }
  }

  return { mimeType: 'video/webm', extension: 'webm' };
}

export class VideoExporter {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  public startRecording(
    canvas: HTMLCanvasElement,
    fps: number = 30
  ): { mimeType: string; extension: string } {
    this.recordedChunks = [];
    const canvasStream = canvas.captureStream(fps);
    const { mimeType, extension } = getSupportedMimeType();

    try {
      this.mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps high-quality motion
      });
    } catch {
      // Fallback without specific bits
      this.mediaRecorder = new MediaRecorder(canvasStream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(200); // 200ms slices
    this.isRecording = true;

    return { mimeType, extension };
  }

  public stopAndDownload(filename: string, extension: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Nenhuma gravação em andamento.'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(this.recordedChunks, {
            type: this.mediaRecorder?.mimeType || 'video/webm',
          });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${filename}.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          this.isRecording = false;
          resolve(url);
        } catch (err) {
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
      this.isRecording = false;
    }
  }

  public get recordingStatus(): boolean {
    return this.isRecording;
  }
}
