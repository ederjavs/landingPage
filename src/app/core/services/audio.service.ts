import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import * as moment from 'moment'
import { StatusTrack } from '@core/interfaces/interfaces'

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private stop = new Subject()
  private audioDom = new Audio()
  events = ['play', 'pause', 'timeupdate', 'canplay', 'error']
  private state: StatusTrack = {
    play: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  }

  private musicPlayer(previewURL: string) {
    return new Observable((observer) => {
      // Play audio
      this.audioDom.src = previewURL
      this.audioDom.load()
      this.audioDom.play()

      const handler = (event: Event) => {
        this.updateStateEvents(event)
        observer.next(event)
      }

      this.addEvent(this.audioDom, this.events, handler)
      return () => {
        this.audioDom.pause()
        this.audioDom.currentTime = 0

        this.removeEvent(this.audioDom, this.events, handler)

        this.resetState()
      }
    })
  }

  private addEvent(audio: any, events: any, handler: any) {
    events.forEach((event: any) => {
      audio.addEventListener(event, handler)
    })
  }

  private removeEvent(audio: any, events: any, handler: any) {
    events.forEach((event: any) => {
      audio.removeEventListener(event, handler)
    })
  }

  initStream(previewURL: string) {
    console.log(previewURL)

    return this.musicPlayer(previewURL).pipe(takeUntil(this.stop))
  }

  playTrack() {
    this.audioDom.play()
  }

  pauseTrack() {
    this.audioDom.pause()
  }

  stopTrack() {
    this.stop.next()
  }

  seek(seconds: number) {
    this.audioDom.currentTime = seconds
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000
    return moment.utc(momentTime).format(format)
  }

  private stateChange: BehaviorSubject<StatusTrack> = new BehaviorSubject(
    this.state,
  )

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioDom.duration
        this.state.readableDuration = this.formatTime(this.state.duration)
        this.state.canplay = true
        break
      case 'play':
        this.state.play = true
        break
      case 'pause':
        this.state.play = false
        break
      case 'timeupdate':
        this.state.currentTime = this.audioDom.currentTime
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime)
        break
      case 'error':
        this.resetState()
        this.state.error = true
        break
    }
    this.stateChange.next(this.state)
  }

  private resetState() {
    this.state = {
      play: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
    }
  }

  getStatus(): Observable<StatusTrack> {
    return this.stateChange.asObservable()
  }
}
