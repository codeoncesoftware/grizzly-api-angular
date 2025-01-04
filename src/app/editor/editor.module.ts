import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { ResourceGroupModule } from '../resource-group/resource-group.module';
import { ContainerModule } from '../container/container.module';
import { HeaderComponent } from './header/header.component';
import { GroupComponent } from './group/group.component';
import { ApiComponent } from './api/api.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { SwaggerInfosModalComponent } from './swagger-infos-modal/swagger-infos-modal.component';
import { SwaggerModalService } from '../container/swagger-modal/swagger-modal.service';
import { ExportSwaggerModalComponent } from './export-swagger-modal/export-swagger-modal.component';
import { AddModelComponent } from './add-model/add-model.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ResourceModule } from '../resource/resource.module';
import { EditorRedirectionComponent } from './editor-redirection/editor-redirection.component';
import { GenerateModalComponent } from './generate-modal/generate-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ContactChatComponent } from './contact-chat/contact-chat.component';
import { ShareEditorComponent } from './share-editor/share-editor.component';
import { ShareModalComponent } from '../project/share-modal/share-modal.component';
import { EditorHistoryModalComponent } from './editor-history-modal/editor-history-modal.component';




@NgModule({
    declarations: [EditorComponent, HeaderComponent, ContactChatComponent, GroupComponent, ApiComponent, JsonViewerComponent, SwaggerInfosModalComponent, ExportSwaggerModalComponent, AddModelComponent, EditorRedirectionComponent, GenerateModalComponent, ShareEditorComponent, EditorHistoryModalComponent],
    imports: [
        NgxJsonViewerModule,
        FormsModule,
        CommonModule,
        RouterModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTreeModule,
        FileUploadModule,
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatTooltipModule,
        MatStepperModule,
        MatTreeModule,
        NgJsonEditorModule,
        SharedModule,
        ResourceGroupModule,
        ContainerModule,
        ResourceModule,
        CodemirrorModule,
        CKEditorModule
    ],
    providers: [SwaggerModalService],
    exports: [SwaggerInfosModalComponent, ExportSwaggerModalComponent]
})
export class EditorModule { }
