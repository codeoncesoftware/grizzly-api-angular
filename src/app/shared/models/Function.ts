import { AWSCredentials } from './AWSCredentials';
import { OpenFaasInfo } from './OpenFassInfo';

export class Function {
   id: string;
   function: string;
   logs: string;
   language: string;
   name: string;
   version: string;
   projectId: string;
   className: string;
   methodName: string;
   model: string;
   modelName: string;
   awsCredentials:AWSCredentials;
   awsFunctionName:string;
   openFaasBody:string;
	openFaasURI:string;
	openFaasHeaders : any;
   openFaasInfo : OpenFaasInfo;
}
