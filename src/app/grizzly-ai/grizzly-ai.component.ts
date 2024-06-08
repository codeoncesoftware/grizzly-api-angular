import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GrizzlyAiService } from './grizzly-ai.service';
import { DBSourceService } from '../../app/dbsource/dbsource.service';
import { ProjectService } from '../../app/project/project.service';
import { Store } from '@ngrx/store';
import { ProjectsState } from '../../app/store/project/project.state';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { Project } from 'src/app/shared/models/Project';
import { DBSource } from 'src/app/shared/models/DBSource';
import * as dbsourceActions from '../../app/store/dbsource/dbsource.actions';
import * as project from '../../app/store/project/project.actions';


@Component({
  selector: 'app-grizzly-ai',
  templateUrl: './grizzly-ai.component.html',
  styleUrls: ['./grizzly-ai.component.sass']
})
export class GrizzlyAiComponent {


  messages: { user: string, content: string }[] = [];
  queryFormGroup!: FormGroup;
  obj = new Project();
  dbSrc = new DBSource();

  constructor(
    private fb: FormBuilder,
    private grizzlyAiService: GrizzlyAiService,
    private dbSourceService: DBSourceService,
    private projectService: ProjectService,
    private store: Store<ProjectsState>,
    private dbstore: Store<DBSourcesState>,
  ) { }

  ngOnInit(): void {
    this.queryFormGroup = this.fb.group({ query: this.fb.control("") });
    const storedConversation = localStorage.getItem('conversation');
    if (storedConversation) {
      this.messages = JSON.parse(storedConversation);
    }
  }

  updateLocalStorage() {
    localStorage.setItem('conversation', JSON.stringify(this.messages));
  }



  handleAskGPT() {
    const userMessage = this.queryFormGroup.get('query')?.value;
    this.messages.push({ user: 'user', content: userMessage });
    this.updateLocalStorage();

    this.grizzlyAiService.chat(userMessage).subscribe(
      response => {
        this.messages.push({ user: 'bot', content: response.response });
        this.updateLocalStorage();

        // Refresh projects and dbSources when creating a new microservice
        if (response.response.includes("Microservice URL : ")) {
          this.refreshProjectsAndDbSources();
        }

      }, error => {
        console.log('Error !');
        this.messages.push({ user: 'bot', content: 'Une erreur s\'est produite chez OpenAI. Veuillez réessayer plus tard' });
        console.error('Error sending message:', error);
      }
    );
    this.queryFormGroup.reset();
  }

  refreshProjectsAndDbSources() {
    this.projectService.getAllProjects().subscribe(projects => {
      this.obj = projects[projects.length - 1];
      this.store.dispatch(new project.AddProject(this.obj));
    });

    this.dbSourceService.getAll().subscribe(dbs => {
      this.dbSrc = dbs[dbs.length - 1];
      this.dbstore.dispatch(new dbsourceActions.AddDBSource(this.dbSrc));
    });
  }



  formatText(line: string): string {
    const regex1 = /"([^"]+)"/g;
    line = line.replace(regex1, '<strong>$1</strong>');

    const regex2 = /\[([^[\]]+)\]\(([^)]+)\)/g;
    line = line.replace(regex2, '<a href="$2" target="_blank">$1</a>');

    const regexURL = /Project URL : (https?:\/\/[^\s]+)/;
    line = line.replace(regexURL, 'Project URL : <a href="$1">$1</a>');


    return line;
  }

  downloadConversation() {
    const conversation = localStorage.getItem('conversation');

    if (conversation) {
      const conversationArray = JSON.parse(conversation);
      const formattedConversation = conversationArray.map(entry => {
        const user = entry.user === 'user' ? 'User' : 'GrizzlyAI';
        return `- ${user} : ${entry.content}`;
      }).join('\n');

      const blob = new Blob([formattedConversation], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a');

      a.href = url;
      a.download = 'conversation.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Aucune conversation trouvée dans le localStorage.');
    }
  }
}
