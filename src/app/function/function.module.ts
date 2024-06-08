import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionComponent } from './function.component';
import { FunctionService } from './function.service';
import { RouterModule } from '@angular/router';
import { MatTreeModule } from '@angular/material/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MaterialAngularSelectModule } from 'material-angular-select';
import {  ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CloneFunctionModalComponent } from './clone-function-modal/clone-function-modal.component';
import { FunctionModalComponent } from './function-modal/function-modal.component';
import { OpenfaasHeaderModalComponent } from './function-modal/openfaas-header-modal/openfaas-header-modal.component';



@NgModule({
    declarations: [FunctionComponent, CloneFunctionModalComponent, FunctionModalComponent, OpenfaasHeaderModalComponent],
    imports: [
        FontAwesomeModule,
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        RouterModule,
        MatTreeModule,
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
        SharedModule,
        CodemirrorModule,
        MaterialAngularSelectModule,
        ReactiveFormsModule,
        MatSortModule,
        MatTableModule,
        MatButtonModule
    ],
    providers: [
        FunctionService
    ],
    exports: [FunctionComponent, OpenfaasHeaderModalComponent]
})
export class FunctionModule { }
