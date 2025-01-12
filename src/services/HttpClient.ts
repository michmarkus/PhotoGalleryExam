import { HTTP } from '@ionic-native/http/ngx';

export default class HttpClient {
  static isProduction: boolean = import.meta.env.MODE === 'production';
  private ionHttp: HTTP;

  constructor() {
    this.ionHttp = new HTTP();
    console.log("Http client constructor");
    console.log("Production?: " + HttpClient.isProduction);
  }

  async get(url: string, params: Record<string, string>): Promise<JSON> {
    if (HttpClient.isProduction) {
      // Production - Ionic Native HTTP plugin

      //console.log("HTTP request using Ionic native client (Production)");
      //console.log("URL: " + url);
      //console.log("Params: ", params);
      
      try {
        const response = await this.ionHttp.get(url, params, {});

        return JSON.parse(response.data);
      } catch (error) {
        console.error('HTTP request failed:', error);
        throw error;
      }
    } else {
      // Dev - Standard fetch
      console.log("HTTP request using fetch (Development)");
      const query = new URLSearchParams(params).toString();
      console.log("URL: " + url);
      console.log("Query: " + query);
      console.log("Params: ", params);
      try {
        const response = await fetch(`${url}?${query}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('HTTP request failed:', error);
        throw error;
      }
    }
  }
}
