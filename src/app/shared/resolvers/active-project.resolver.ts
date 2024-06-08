import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectsState } from '../../store/project/project.state';
import * as projectActions from '../../store/project/project.actions';
import * as containerActions from '../../store/container/container.actions';
import * as functionActions from '../../store/function/function.actions';
import { ProjectService } from 'src/app/project/project.service';
import { ContainerState } from 'src/app/store/container/container.state';
import { ContainerService } from 'src/app/container/container.service';
import { FunctionState } from 'src/app/store/function/function.state';

@Injectable()
export class ActiveProjectResolver implements Resolve<any> {
    constructor(private projectService: ProjectService , private containerService: ContainerService , private functionStore: Store<FunctionState> , private projectStore: Store<ProjectsState> , private containerStore: Store<ContainerState>) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.projectService.getProjectByUid(route.params.id).subscribe(project => {
            this.projectStore.dispatch(new projectActions.UpdateProjectSuccess(project));
            this.functionStore.dispatch(new functionActions.GetAllFunctions(route.params.id));
            this.containerService.getAllContainers(route.params.id)//
                .subscribe(res => {
                    this.containerStore.dispatch(new containerActions.LoadAllContainersSuccess(res));
                    this.containerStore.dispatch(new containerActions.LoadActiveContainer(res[0]));
                });
        });
    }
}
