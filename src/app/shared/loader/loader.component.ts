import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { Subject } from 'rxjs';
import { ProjectsState } from 'src/app/store/project/project.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  show = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {

  }

}
