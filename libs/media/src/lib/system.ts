/**
 * 系统操作处理
 * 开启摄像头、
 */
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class MediaSystem {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordMediaStream: MediaStream | null = null;

  private cameraStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private videoEL: HTMLVideoElement | null = null;
  private ffmpeg: FFmpeg | null = null;
  private ffmpegReady: boolean = false;

  constructor() {
    // this.init();
  }

  private async initFFmpeg() {
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    this.ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    });
    this.ffmpegReady = true;
  }

  /**
   * 开启摄像头和麦克风
   */
  public async startCameraAndMicrophone(): Promise<void> {
    this.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // this.cameraStream.getVideoTracks().forEach((track) => {
    //   track.applyConstraints({ facingMode: 'user' }); // 应用镜像反转
    // });
    this.videoEL = document.createElement('video');
    this.videoEL.srcObject = this.cameraStream;

    this.videoEL.onloadedmetadata = () => {
      this.videoEL?.play();
      // 开启画中画
      this.videoEL?.requestPictureInPicture();
    };
  }

  /**
   *关闭摄像头和麦克风
   */
  public async closeCameraAndMicrophone(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cameraStream) {
        // 停止视频播放
        if (this.videoEL && !this.videoEL.paused) {
          this.videoEL.pause();
        }
        // 停止摄像头和麦克风的数据采集
        this.cameraStream.getTracks().forEach((track) => track.stop());
        this.cameraStream = null;
        // 退出画中画模式
        if (document.pictureInPictureElement) {
          document
            .exitPictureInPicture()
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve();
        }
      } else {
        reject();
      }
    });
  }

  /**
   *屏幕分享
   */
  public async startScreenSharing(): Promise<void> {
    this.screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
  }

  /**
   * 停止分享
   */
  public async closeScreenSharing(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.screenStream) {
        this.screenStream.getTracks().forEach((track) => track.stop());
        this.screenStream = null;
        resolve();
      } else {
        reject();
      }
    });
  }

  /**
   * 开始录制
   */
  public async startRecordingScreen() {
    try {
      this.recordMediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      this.mediaRecorder = new MediaRecorder(this.recordMediaStream);
      this.mediaRecorder.ondataavailable = this.recordOndataavailable;
      this.mediaRecorder.onstop = this.reacordOnstop;
      this.mediaRecorder.start();
    } catch (error) {
      console.error('无法录制屏幕', error);
    }
  }

  /**
   * 停止录制
   */
  public stopRecordingScreen() {
    if (this.mediaRecorder) {
      if (this.ffmpegReady) {
        this.mediaRecorder.stop();
      } else {
        console.log('ffmpeg not ready !');
      }
    }
  }

  async recordOndataavailable(event: BlobEvent) {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  }

  async reacordOnstop() {
    if (!this.ffmpeg) {
      await this.initFFmpeg();
    }
    // 停止屏幕分享
    this.recordMediaStream!.getTracks().forEach((track) => track.stop());
    this.screenStream = null;

    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const webBlob = URL.createObjectURL(blob);

    await this.ffmpeg!.writeFile('Record.webm', await fetchFile(webBlob));
    await this.ffmpeg!.exec(['-i', 'Record.webm', 'output.mp4']);
    const mp4Data = await this.ffmpeg!.readFile('output.mp4');
    const url = URL.createObjectURL(new Blob([mp4Data], { type: 'video/mp4' }));
    const a = document.createElement('a');

    a.href = url;
    a.download = 'output.mp4';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

const mediaSystem = new MediaSystem();

export { mediaSystem };
