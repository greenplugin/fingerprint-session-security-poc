import {Injectable} from '@angular/core';
import {AsyncSubject, Observable, of, Subject, switchMap} from "rxjs";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

@Injectable({
  providedIn: 'root'
})
export class MonacoInitializerService {

  constructor() {
  }

  initialize(): Observable<any> {
    console.info('initializing monaco');
    const initializer: AsyncSubject<any> = new AsyncSubject();
    const onGotAmdLoader = () => {
      // Load monaco
      (window as any).require(["vs/editor/editor.main"], () => {
        console.info('monaco initialized');
        // @ts-ignore
        initializer.next(window.monaco);
        initializer.complete();
      });
    };

    // Load AMD loader if necessary
    if (!(window).require) {
      const loaderScript = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = "vs/loader.js";
      loaderScript.addEventListener("load", onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }

    return initializer.asObservable();
  }

  initWithModel(uri: string, type: string, element: HTMLElement, content: string): Observable<IStandaloneCodeEditor> {
    return this.initialize().pipe(switchMap((ed: any) => {
      console.info(ed)
      // @ts-ignore
      let model = monaco.editor.getModel(uri);
      if (!model) {
        // @ts-ignore
        const modelUri = monaco.Uri.parse(uri); // a made up unique URI for our model
        // @ts-ignore
        model = monaco.editor.createModel(content, type, modelUri);
      }

      // @ts-ignore
      const editor: IStandaloneCodeEditor = monaco.editor.create(element, {
        model: model,
        minimap: {
          enabled: true
        },
        theme: 'vs-dark',
        automaticLayout: true,
      });

      return of(editor);
    }));
    // @ts-ignore
  }
}
