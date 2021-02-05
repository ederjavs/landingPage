import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core'
import { trackItem, StatusTrack, MenuItems } from '@core/interfaces/interfaces'
import { MusicProvider } from '@core/providers/music.provider'
import { AudioService } from '@core/services/audio.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ViewportScroller } from '@angular/common'
import { menuItems } from '@core/shared/menu-items'
declare var anime: any
import { lorem1, lorem2 } from '@core/shared/lorem'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'landingPage'

  center = { lat: 24, lng: 12 }
  zoom = 16
  display?: google.maps.LatLngLiteral
  nuevaSuscripcion: FormGroup
  tracks: any[] = []
  filteredTraks: any
  formEnviado = false
  querySearch: string = ''
  statusTrack: StatusTrack = {
    play: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  }
  enCurso: trackItem = {
    indice: 0,
    id: '',
    name: '',
    albumName: '',
    artistId: '',
    albumId: '',
    artistName: '',
    previewURL: '',
    playbackSeconds: '',
  }

  menuItems: MenuItems[] = menuItems

  lorem1: string = lorem1
  lorem2: string = lorem2

  constructor(
    private viewportScroller: ViewportScroller,
    private elementRef: ElementRef,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public audioService: AudioService,
    private mp: MusicProvider,
  ) {
    this.nuevaSuscripcion = this.formBuilder.group({
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      email: ['', Validators.required],
      notas: [''],
    })
    this.mp.getFiles().subscribe((data: any) => {
      console.log(data)

      this.tracks = data.tracks.map((dato: any, index: number) => {
        return {
          indice: index,
          id: dato.id,
          artistId: dato.artistId,
          name: dato.albumName,
          albumName: dato.albumName,
          albumId: dato.albumId,
          artistName: dato.artistName,
          previewURL: dato.previewURL,
          playbackSeconds: dato.playbackSeconds,
        }
      })
      this.filteredTraks = this.tracks

      this.enCurso = this.tracks[0]
    })
    this.audioService.getStatus().subscribe((statusTrack: StatusTrack) => {
      this.statusTrack = statusTrack
    })
  }

  onChangeEvent(query: string) {
    this.filteredTraks = this.tracks.filter((track) =>
      track.name.toLowerCase().includes(query.toLowerCase()),
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {
      
      this.initStream(this.enCurso.previewURL)
    }, 2000)
  }
  ngOnInit() {
    const dom: HTMLElement = this.elementRef.nativeElement
    const elements = dom.querySelectorAll('.ml2')

    if (elements[0].textContent != null) {
      elements[0].innerHTML = elements[0].textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>",
      )
      anime
        .timeline({ loop: true })
        .add({
          targets: '.ml2 .letter',
          scale: [4, 1],
          opacity: [0, 1],
          translateZ: 0,
          loop: false,
          easing: 'easeOutExpo',
          duration: 950,
          delay: (el: any, i: number) => 70 * i,
        })
        .add({
          targets: '.ml2',
          opacity: 0,
          duration: 1000,
          easing: 'easeOutExpo',
          delay: 1000,
        })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocatio(position)
      })
    } else {
      alert('Tu navegador no sorpota geolocalizaciónn')
    }
  }
  scrollTo(seccion: string) {
    console.log(seccion);
    
    this.viewportScroller.scrollToAnchor(seccion)
  }
  currentLocatio(position: any) {
    let location = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude,
    )
    this.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
  }

  guardar() {
    console.log(this.nuevaSuscripcion)

    if (this.nuevaSuscripcion.valid) {
      this.formEnviado = true
      setTimeout(() => {
        this._snackBar.open(
          'Tus datos fueron guardados correctamente, gracias.',
          'Ok',
          {
            duration: 3000,
          },
        )
        this.formEnviado = false
        for (var name in this.nuevaSuscripcion.controls) {
          this.nuevaSuscripcion.controls[name].setValue('')
          this.nuevaSuscripcion.controls[name].setErrors(null)
        }
      }, 3000)
    }
  }

  initStream(previewURL: string) {
    this.audioService.initStream(previewURL).subscribe((events) => {
     
    })
  }

  playOrPause() {
    if (this.statusTrack.play) {
      this.audioService.pauseTrack()
    } else {
      this.audioService.playTrack()
    }
  }

  next() {
    const index = this.enCurso.indice + 1
    console.log(index)

    if (index < this.tracks.length) {
      this.enCurso = this.tracks[index]
      this.changeTrack(this.enCurso)
    }
  }

  back() {
    const index = this.enCurso.indice - 1
    console.log(index)
    if (index >= 0) {
      this.enCurso = this.tracks[index]
      this.changeTrack(this.enCurso)
    }
  }

  changeTrack(track: trackItem) {
    this.enCurso = track
    this.audioService.stopTrack()
    this.initStream(track.previewURL)
  }
  seek(change: any) {
    this.audioService.seek(change.value)
  }
}
