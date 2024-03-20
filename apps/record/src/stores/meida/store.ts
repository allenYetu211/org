import { create } from 'zustand';

type State = {
  openCamera: boolean;
  shareScreenState: boolean;
  openRecordState: boolean;
};

type Action = {
  updateMediaStore: (value: Partial<State>) => void;
};

export type MediaStateType = State & Action;

export const useMediaStore = create<MediaStateType>((set) => ({
  openCamera: false,
  shareScreenState: false,
  openRecordState: false,
  updateMediaStore: (val) => set(() => val),
}));
