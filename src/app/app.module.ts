import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
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
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { NgJsonEditorModule } from 'ang-jsoneditor';

// STATE
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { DbsourceListComponent } from './dbsource/dbsource-list/dbsource-list.component';
import { DBSourceModule } from './dbsource/dbsource.module';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { AppHeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { AutoCloseMobileNavDirective } from './layout/sidenav/auto-close-mobile-nav.directive';
import { AccordionNavDirective } from './layout/sidenav/sidenav-menu/accordion-nav.directive';
import { AppendSubmenuIconDirective } from './layout/sidenav/sidenav-menu/append-submenu-icon.directive';
import { HighlightActiveItemsDirective } from './layout/sidenav/sidenav-menu/highlight-active-items.directive';
import { AppSidenavMenuComponent } from './layout/sidenav/sidenav-menu/sidenav-menu.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { ToggleOffcanvasNavDirective } from './layout/sidenav/toggle-offcanvas-nav.directive';
import { OrganisationModalComponent } from './organization/organisation-modal/organisation-modal.component';
import { OrganizationMenuComponent } from './organization/organization-menu/organization-menu.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectModalComponent } from './project/project-modal/project-modal.component';
import { HttpErrorInterceptor } from './shared/handlers/http-error.interceptor';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';
import { LoaderService } from './shared/loader/loader.service';
import { SharedModule } from './shared/shared.module';
import { effects } from './store';
import { containerReducer } from './store/container/container.reducer';
import { dbsourceReducer } from './store/dbsource/dbsource.reducer';
import { layoutReducer } from './store/layout/layout.reducer';
import { authReducer } from './store/authentication/auth.reducer';
import { dashboardReducer } from './store/dashboard/dashboard.reducer';
import { functionReducer } from './store/function/function.reducer';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, NgxUiLoaderHttpConfig } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './loader.config';
import { EditorModule } from './editor/editor.module';
import { organizationReducer } from './store/organization/organization.reducer';
import { projectReducer } from './store/project/project.reducer';
import { teamReducer } from './store/team/team.reducer';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import 'codemirror/mode/javascript/javascript';
import { ShareModalComponent } from './project/share-modal/share-modal.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import { BillingComponent } from './layout/billing/billing.component';
import { IdentityproviderListComponent } from './identity-provider/identityprovider-list/identityprovider-list.component';
import { IdentityProviderModule } from './identity-provider/identityprovider.module';
import { IdentityProviderReducer } from './store/identityprovider/identityprovider.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GrizzlyAiComponent } from './grizzly-ai/grizzly-ai.component';


registerLocaleData(localeFr);
registerLocaleData(localeEn);

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json?cb=' + new Date().getTime());
}

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        SidenavComponent,
        AppHeaderComponent,
        AccordionNavDirective,
        AppendSubmenuIconDirective,
        HighlightActiveItemsDirective,
        ProjectModalComponent,
        ProjectListComponent,
        DbsourceListComponent,
        AppSidenavMenuComponent,
        AutoCloseMobileNavDirective,
        ToggleOffcanvasNavDirective,
        DashboardComponent,
        NotFoundComponent,
        SettingsComponent,
        OrganizationMenuComponent,
        OrganisationModalComponent,
        ShareModalComponent,
        BillingComponent,
        IdentityproviderListComponent,
        GrizzlyAiComponent,
    ],
    imports: [
        StoreModule.forRoot({
            projects: projectReducer,
            containers: containerReducer,
            dbsources: dbsourceReducer,
            layout: layoutReducer,
            auth: authReducer,
            dashboard: dashboardReducer,
            organization: organizationReducer,
            team: teamReducer,
            functions: functionReducer,
            identityproviders: IdentityProviderReducer
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 5
        }),
        NgxJsonViewerModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
        EffectsModule.forRoot(effects),
        SharedModule,
        NgJsonEditorModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
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
        CodemirrorModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatBadgeModule,
        MatStepperModule,
        AuthModule,
        MainLayoutModule,
        ToastrModule.forRoot(
        {timeOut: 2000
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        DBSourceModule,
        EditorModule,
        IdentityProviderModule,
        FontAwesomeModule
    ],
    providers: [
        LoaderService,
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, direction: 'ltr' } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
