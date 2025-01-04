import { AfterViewChecked, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ContainerService } from 'src/app/container/container.service';
import { Container } from 'src/app/shared/models/Container';
import { LayoutState } from 'src/app/store/layout/layout.state';
import * as containerActions from '../../store/container/container.actions';
import * as layoutActions from '../../store/layout/layout.actions';
import { ResourceGroupModalComponent } from 'src/app/resource-group/resource-group-modal/resource-group-modal.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ResourceGroup } from 'src/app/shared/models/ResourceGroup';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ResourceModalComponent } from 'src/app/resource/resource-modal/resource-modal.component';
import { Resource } from 'src/app/shared/models/Resource';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import { MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import SwaggerUI from 'swagger-ui';
@Component({
  selector: 'app-group-editor',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupComponent implements OnInit {
  @ViewChild('table', { static: false }) table: MatTable<Resource>;

  container: Container;
  resourceGroups: any;
  expanded: number[] = [0];
  groupsNumber = 0;
  containerToSave: Container = new Container();
  @ViewChildren('deleteBtn') deleteBtn: MatButton[];
  resourcesToDelete = [];
  showDeleteResources = true;
  groupToDeleteFrom = new ResourceGroup();
  connectedTo = [];

  @Input() refreshSwagger;
  @Input() swaggerBaseUrl;
  @Input() ui;
  @Input() el;

  constructor(private store: Store<ContainerState>, private containerService: ContainerService, private layoutStore: Store<LayoutState>, private dialog: MatDialog,
              private confirmModalService: ConfirmModalService) { }

  ngOnInit() {
    this.store.select('containers').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.container = resState['active'];
      this.groupsNumber = this.container.resourceGroups.length;
      this.container.resourceGroups.forEach(group => {
        this.connectedTo.push(group.name);
      });
    });

    this.layoutStore.select<any>('layout').subscribe(res => {
      if (res) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        res['containerGroups'].forEach(contRg => {
          if (contRg.containerId === this.container.id) {
            this.expanded = contRg.openGroupsIndexs;
          }

        });
      }
    });

  }

  openRg(containerId, index) {
    this.layoutStore.dispatch(new layoutActions.ToggleRg(containerId, index));
  }

  public openGroupModal() {
    return this.dialog.open(ResourceGroupModalComponent,
      { // Modal configuration
        width: '50%',
        position: {
          top: '15vh'
        },
        data: {
          resourceGroup: this.resourceGroups,
          container: this.container,
          action: {
            update: false,
            create: true,
            msg: 'editor.tag.add',
            editor: true
          }
        },
      });
  }

  public openEditGroupModal(group: ResourceGroup) {
    this.dialog.open(ResourceGroupModalComponent,
      { // Modal configuration
        width: '50%',
        position: {
          top: '15vh'
        },
        data: {
          resourceGroup: group,
          container: this.container,
          action: {
            update: true,
            create: false,
            msg: 'editor.tag.edit',
            editor: true
          }
        },
      });

  }

  public openDeleteGroupModal(group: ResourceGroup) {
    this.confirmModalService.openConfirm('editor.tag.delete.title', 'editor.tag.delete.msg', { name: group.name })
      .afterClosed().subscribe(res => {
        if (res) {
          this.containerToSave = JSON.parse(JSON.stringify(this.container));
          const msg = 'editor.msg.tagDeleted';
          const groupIndex = this.getGroupIndex(group);
          this.containerToSave.resourceGroups.splice(groupIndex, 1);
          this.store.dispatch(new containerActions.UpdateContainer(this.containerToSave, msg));
        }
      });
  }

  getGroupIndex(group: ResourceGroup) {
    return this.container.resourceGroups.findIndex((x: ResourceGroup) => x.name.toUpperCase() === group.name.toUpperCase());
  }

  public openAddApiModal(group: ResourceGroup): void {
    this.dialog.open(ResourceModalComponent,
      {
        position: {
          top: '10px',
          right: '10px'
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        data: {
          resource: new Resource(),
          Rgroup: group,
          container: this.container,
          editMode: false,
          editorMode: true,
          action: {
            msg: 'popups.resource.add'
          }
        }
      }).afterClosed().subscribe(res => {
        if (this.swaggerBaseUrl.substr(this.swaggerBaseUrl.lastIndexOf('/') + 1) !== 'null') {
          this.ui = SwaggerUI({
            url: this.swaggerBaseUrl,
            domNode: this.el.nativeElement.querySelector('.swagger-container'),
            deepLinking: true,
            presets: [
              SwaggerUI.presets.apis
            ],
          });
          // Back to Top
          window.scrollTo({ top: 0 });
        }
        setTimeout(() => this.refreshSwagger(), 1000);
      });
  }

  public openConfirmDeleteAllDialog(group: ResourceGroup) {
    this.confirmModalService.openConfirm('popups.resource.delete.title', 'popups.resource.delete.msg', { name: group.name })
      .afterClosed().subscribe(res => {
        if (res) {
          this.containerToSave = JSON.parse(JSON.stringify(this.container));
          this.groupToDeleteFrom = JSON.parse(JSON.stringify(group));
          const groupIndex = this.getGroupIndex(this.groupToDeleteFrom);
          this.resourcesToDelete.forEach((x: Resource) => {
            // DELETE RESOURCE FILES HERE
            // this.resourceService.deleteFile(x.fileId).subscribe();
            this.groupToDeleteFrom.resources = this.groupToDeleteFrom.resources.filter((ress: Resource) => (ress.httpMethod + ress.path) !== (x.httpMethod + x.path));
          });
          this.containerToSave.resourceGroups[groupIndex] = this.groupToDeleteFrom;
          const msg = 'editor.msg.deletedEndpoints';
          this.store.dispatch(new containerActions.UpdateContainer(this.containerToSave, msg));
        }
      });
  }

  updateResourcesToDelete(arrayOfResources: Resource[]) {
    this.resourcesToDelete = arrayOfResources;
    this.container.resourceGroups.forEach(group => {
      let emptyResourcesToDelete = true;


      group.resources.forEach(res => {
        this.resourcesToDelete.forEach(resource => {
          if (res.path === resource.resources.path && res.httpMethod === resource.resources.httpMethod && group.name === resource.group.name) {
            emptyResourcesToDelete = false;
            this.deleteBtn.forEach(btn => {
              if (btn._elementRef.nativeElement.id === group.name) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                btn['_disabled'] = false;
              }
            });
          }

        });
      });
      this.deleteBtn.forEach(btn => {
        if (btn._elementRef.nativeElement.id === group.name && emptyResourcesToDelete) {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          btn['_disabled'] = true;
        }
      });

    });
    // restore the new format of the array
    const newResources = [];
    this.resourcesToDelete.forEach(x => newResources.push(x.resources));
    this.resourcesToDelete = newResources;

  }

  public dropTable(event: CdkDragDrop<Resource[]>, currentGroup) {
    if (event.previousContainer === event.container) {
      const prevIndex = currentGroup.resources.findIndex((d) => d === event.item.data);
      moveItemInArray(currentGroup.resources, prevIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.store.dispatch(new containerActions.UpdateContainer(this.container, 'editor.msg.tagUpdated'));
  }

}
