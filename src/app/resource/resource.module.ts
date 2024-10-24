import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgJsonEditorModule } from 'ang-jsoneditor';

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

import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceModalComponent } from './resource-modal/resource-modal.component';
import { ResourceComponent } from './resource.component';
import { ResourceDetailsModalComponent } from './resource-details-modal/resource-details-modal.component';
import { MatDividerModule } from '@angular/material/divider';

import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from '../shared/shared.module';
import { ImportModalComponent } from '../container/import-modal/import-modal.component';
import { CDK_DRAG_CONFIG, DragDropModule } from '@angular/cdk/drag-drop';
import { ResourceProjectionComponent } from './resource-modal/resource-projection/resource-projection.component';
import { FileSearchComponent } from './resource-modal/select-files-modal/file-search/file-search.component';
import { SelectFilesModalComponent } from './resource-modal/select-files-modal/select-files-modal.component';
import { SelectFilesModalService } from './resource-modal/select-files-modal/select-files-modal.service';
import { ExecuteModalComponent } from './execute-modal/execute-modal.component';
import { ExecuteModalService } from './execute-modal/execute-modal.service';
import { RecapComponent } from './resource-modal/recap/recap.component';
import { CouchbaseQueryDetailsComponent } from './resource-modal/couchbase-query-details/couchbase-query-details.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import 'codemirror/mode/javascript/javascript';
import { ParamsModalComponent } from './params-modal/params-modal.component';
import { CodesModalComponent } from './codes-modal/codes-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ResourceInvalidModalComponent } from './resource-list/resource-invalid-modal/resource-invalid-modal.component';
import { ResourceFunctionModalComponent } from './resource-function-modal/resource-function-modal.component';
import { SearchPipe } from './resource-modal/search.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
    declarations: [
        ResourceComponent,
        ResourceListComponent,
        ResourceModalComponent,
        ResourceDetailsModalComponent,
        ImportModalComponent,
        ResourceProjectionComponent,
        SelectFilesModalComponent,
        FileSearchComponent,
        ExecuteModalComponent,
        RecapComponent,
        CouchbaseQueryDetailsComponent,
        ParamsModalComponent,
        CodesModalComponent,
        ResourceInvalidModalComponent,
        ResourceFunctionModalComponent,
        SearchPipe
    ],
    imports: [
        FileUploadModule,
        DragDropModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        DragDropModule,
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
        MatTooltipModule,
        MatStepperModule,
        MatTreeModule,
        NgJsonEditorModule,
        SharedModule,
        CodemirrorModule,
        CKEditorModule,
        MatDividerModule
    ],
    providers: [SelectFilesModalService, ExecuteModalService, ParamsModalComponent, CodesModalComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    exports: [
        ResourceComponent,
        ResourceListComponent,
        ResourceModalComponent,
        ExecuteModalComponent,
        SelectFilesModalComponent,
        ParamsModalComponent,
        CodesModalComponent
    ]
})
export class ResourceModule { }

