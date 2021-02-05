export interface MenuItems {
  nombre: string
  icono: string
}

export interface trackItem {
  indice:number
  id:string
  name: string
  artistId: string
  albumName: string
  albumId: string
  artistName: string
  previewURL: string
  playbackSeconds: string
}

export interface StatusTrack {
  play: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  error: boolean;
}
