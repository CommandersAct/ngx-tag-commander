import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.scss']
})
export class IndexPageComponent implements OnInit {
  markdown: string | undefined;
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.markdown = await firstValueFrom(this.http.get('/assets/Documentation.md', {responseType: 'text'}));
  }
}
