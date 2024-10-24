import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-editor-redirection',
  template: `<div myPreloader class="preloaderbar hide"><span class="bar"></span></div>`,
  styles: [
  ]
})
export class EditorRedirectionComponent implements OnInit {

  constructor(private router: Router, private editorService: EditorService
    ) { }

  ngOnInit(): void {
    const id = localStorage.getItem('containerIdEditor');
    if (id) {
      this.router.navigate(['editor/' + id]);
    } else {
      this.editorService.generateExample().subscribe(container => {
        localStorage.setItem('containerIdEditor', container.id);
        const containerId = container.id;
        this.router.navigate(['editor/' + containerId ]);
      });
    }
  }

}
