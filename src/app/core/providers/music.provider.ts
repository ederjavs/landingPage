import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class MusicProvider {
  files: any = []

  constructor(private http: HttpClient) {
    
  }
  getFiles() {
    return this.http
      .get(
        'https://api.napster.com/v2.1/tracks/top?limit=10&apikey=ODU2ZjZmYTctZjEzOS00MWU4LWFiY2ItYTMyNTUwNDEzNmY4',
      )
      
  }
}
