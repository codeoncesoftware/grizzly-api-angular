import { Component, OnInit } from '@angular/core';
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
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from '../shared/services/app-translate-service';


@Component({
  selector: 'app-grizzly-ai',
  templateUrl: './grizzly-ai.component.html',
  styleUrls: ['./grizzly-ai.component.scss']
})
export class GrizzlyAiComponent  implements OnInit {

  faProjectDiagram = faCube;
  messages: { user: string, content: string }[] = [];
  queryFormGroup!: FormGroup;
  obj = new Project();
  dbSrc = new DBSource();
  listeMS: { name: string; url: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private grizzlyAiService: GrizzlyAiService,
    private dbSourceService: DBSourceService,
    private projectService: ProjectService,
    private store: Store<ProjectsState>,
    private toaster: ToastrService,
    private translateService: AppTranslateService,
    private dbstore: Store<DBSourcesState>,
  ) { }

  ngOnInit(): void {
    this.queryFormGroup = this.fb.group({ query: this.fb.control("") });
    const storedConversation = localStorage.getItem('conversation');
    if (storedConversation) {
      this.messages = JSON.parse(storedConversation);
    }
    const storedData = localStorage.getItem('listeMS');
    if (storedData) {
      this.listeMS = JSON.parse(storedData);
    }
  }

  updateLocalStorage() {
    localStorage.setItem('conversation', JSON.stringify(this.messages));
  }
  clearConversation() {
    this.messages = [];
    this.updateLocalStorage();
    this.listeMS = [];

  }



  handleAskGPT() {
    const userMessage = this.queryFormGroup.get('query')?.value;
    this.messages.push({ user: 'user', content: userMessage });
    this.updateLocalStorage();

    this.grizzlyAiService.chat(userMessage).subscribe(
      response => {
        this.messages.push({ user: 'bot', content: response.response });
        this.updateLocalStorage();
        // Récupérer l'URL et le nom du microservice créé
        if (response.response.includes("Project URL")) {

          // Extraire le nom du MS de la réponse
          const regex1 = /"([^"]+)"/g;
          const matches = response.response.match(regex1);
          let extractedStrings: string[] = [];
          // Extraire le nom du MS de la réponse

          const regexName = /<strong>Microservice Name :<\/strong>\s*([\w\s]+)/;
          const matchName = response.response.match(regexName);

          let microserviceName = "";
          if (matchName) {
            microserviceName = matchName[1]; // Capture le nom du microservice

          }
          if (matches) {
            // Enlève les guillemets des résultats
            extractedStrings = matches.map(match => match.slice(1, -1));
            console.log(extractedStrings);
          }

          // Extraire l'URL de la réponse
          const regexURL = /<strong>Project URL : <\/strong>(https?:\/\/[^\s<]+)/;
          const matchesURL = response.response.match(regexURL);

          if (matchesURL) {
            const url = matchesURL[1];
            console.log("URL: ", url);

            // Ajouter le nom du microservice avec l'URL au tableau listeMS
            if (microserviceName && url) {
              const microservice = { name: microserviceName, url };
              if (!this.listeMS.some(ms => ms.url === url && ms.name === microserviceName)) {
                this.listeMS.push(microservice);
              }
            }
            // Sauvegarder les données dans le localStorage
            localStorage.setItem('listeMS', JSON.stringify(this.listeMS));
          }

        }



        // Refresh projects and dbSources when creating a new microservice
        if (response.response.includes("Project URL : ")) {
          //  console.log('RESPONSE - - - - - - - - ',response)
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
      this.store.dispatch(new project.AddProjectSuccessAI(this.obj));
      this.toaster.success(this.translateService.getMessage('toaster.project.added'));
    });

    this.dbSourceService.getAll().subscribe(dbs => {
      this.dbSrc = dbs[dbs.length - 1];
      this.dbstore.dispatch(new dbsourceActions.AddDBSourceSuccessAI(this.dbSrc));
      this.toaster.success(this.translateService.getMessage('toaster.datasource.added'));
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
