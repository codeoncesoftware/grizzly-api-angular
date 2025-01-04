import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private isProjectAdded = new BehaviorSubject<boolean>(false);
  private show = new BehaviorSubject<string>('');
  currentMessage = this.isProjectAdded.asObservable();
  params = new BehaviorSubject<any>(false);
  dataTransferObservable = this.params.asObservable();
  constructor() {}

  // Send Event to inform about a project add failure
  showFormError(message: boolean): void {
    this.isProjectAdded.next(message);
  }
  emitPramas(params){
    this.params.next(params)
  }
}
