'use client';

import { Button, Divider } from '@/components/base';
import { useCallback, useState } from 'react';
import { useMediaStore } from '@/stores';
// import { mediaSystem } from '@media';
import { mediaSystem } from '@/modules/media';
import { toast } from 'sonner';

export default function MediaView() {
  const { openCamera, shareScreenState, openRecordState, updateMediaStore } =
    useMediaStore((state) => ({
      openCamera: state.openCamera,
      shareScreenState: state.shareScreenState,
      openRecordState: state.openRecordState,
      updateMediaStore: state.updateMediaStore,
    }));

  const openCameraHandler = useCallback(async () => {
    try {
      await mediaSystem.startCameraAndMicrophone();
      updateMediaStore({
        openCamera: true,
      });
      toast.success('open camera success');
    } catch (e) {
      toast.error('open camera failed');
    }
  }, []);

  const closeCameraHandler = useCallback(async () => {
    try {
      await mediaSystem.closeCameraAndMicrophone();
      updateMediaStore({
        openCamera: false,
      });
      toast.success('close camera success');
    } catch (e) {
      toast.error('close camera failed');
    }
  }, []);

  const startScreenSharingHandler = useCallback(async () => {
    try {
      await mediaSystem.startScreenSharing();
      updateMediaStore({
        shareScreenState: true,
      });
      toast.success('screen sharing success');
    } catch (e) {
      toast.error('screen sharing failed');
    }
  }, []);

  const closeScreenSharingHandler = useCallback(async () => {
    try {
      await mediaSystem.closeScreenSharing();
      updateMediaStore({
        shareScreenState: false,
      });
      toast.success('close sharing success');
    } catch (e) {
      toast.error('close sharing failed');
    }
  }, []);

  return (
    <div className="p-4">
      <div className="pb-2 flex justify-between items-center">
        <div>XR</div>

        <div className="flex justify-end items-center">
          {!openCamera ? (
            <Button onClick={openCameraHandler}>Open Camera</Button>
          ) : (
            <Button onClick={closeCameraHandler}>Close Camera</Button>
          )}

          {openCamera && <Divider orientation="vertical" className="px-2" />}

          {openCamera && (
            <div className="flex justify-end items-center">
              {!shareScreenState ? (
                <Button onClick={startScreenSharingHandler}>
                  Share Screen
                </Button>
              ) : (
                <Button color="danger" onClick={closeScreenSharingHandler}>
                  Close Screen
                </Button>
              )}

              <Divider orientation="vertical" className="px-2" />

              {!openRecordState ? (
                <Button
                  onClick={async () => {
                    await mediaSystem.startRecordingScreen();
                    updateMediaStore({
                      openRecordState: true,
                    });
                  }}
                >
                  Start Record
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    await mediaSystem.stopRecordingScreen();
                    updateMediaStore({
                      openRecordState: false,
                    });
                  }}
                >
                  Close Record
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Divider />

      <div></div>
    </div>
  );
}
