import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-share-editor',
  templateUrl: './share-editor.component.html',
  styleUrls: ['./share-editor.component.sass']
})
export class ShareEditorComponent implements OnInit {
  emailFormatValid = true;
  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  myControl = new UntypedFormControl();
  emails: string[] = [];
  filteredOptions: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA , SPACE];
  members: any[] = [];
  choices = ['Microservice'];
  microserviceLink;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ShareEditorComponent> , private toaster: ToastrService, private translateService: AppTranslateService,private editorService: EditorService) { }

  ngOnInit(): void {
    this.microserviceLink =  location.origin + '/editor/' + this.data.container.id;
  }
  remove(member: any): void {
    this.emailFormatValid = true;
    const index = this.members.indexOf(member);
    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }


  add(event: MatChipInputEvent): void {
    this.emailFormatValid = true;
    const input = event.input;
    const value = event.value;
    // Add our member
    if ((value || '').trim()) {
      const patt = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}');
      if (!patt.test(value.trim())) {
        this.emailFormatValid = false;
        return;
      }

      this.members.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addOption(option) {
    this.emailFormatValid = true;
    if ((option || '').trim() && (!this.members.some(member => member.name === option))) {
      this.members.push({ name: option.trim() });
      this.memberInput.nativeElement.value = '';
    } else {
      this.memberInput.nativeElement.value = '';
    }
  }
  save() {
    const mailsAndChoices = {
      projectName : this.data.projectName,
      emails : this.members.map(el => el.name),
      microservice : this.choices.some(el => el === 'Microservice') ? location.origin + '/editor/' + this.data.container.id : null,
      swagger : this.choices.some(el => el === 'Swagger') ? location.origin +  '/api/swagger/V2/' + this.data.container.id + '/' + this.data.container.swaggerUuid : null,
      openAPI : this.choices.some(el => el === 'OpenAPI') ? location.origin + '/api/swagger/V3/' + this.data.container.id + '/' + this.data.container.swaggerUuid : null
    };
    this.editorService.share(mailsAndChoices , this.data.container.id).subscribe(res => {
      this.toaster.success(this.translateService.getMessage('toaster.editor.shared'));
      this.dialogRef.close();

    });
  }

manageChoice($event) {
  const index = this.choices.findIndex(el => el === $event.target.parentElement.outerText);
  if(index >= 0) {
    this.choices.splice(index , 1);
  } else {
    this.choices.push($event.target.parentElement.outerText);
  }
}

shareMs() {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  const url = location.origin + '/editor/' + this.data.container.id;
  selBox.value = url;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
  this.toaster.success(this.translateService.getMessage('editor.copy'));
}

}
