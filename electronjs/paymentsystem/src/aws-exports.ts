import { environment } from './environments/environment';

export const pubsub = {
  aws_pubsub_region: 'eu-central-1',
  aws_pubsub_endpoint: 'wss://a3dtjrh1oco8co-ats.iot.eu-central-1.amazonaws.com/mqtt',
}

export const auth = {  
  accessKeyId: environment.accessKeyId,
  secretAccessKey: environment.secretAccessKey
 
}