import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';

@Injectable()
export class DomService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {}

  attachToBody(component: any, bindings: any) {
    const componentRef: ComponentRef<any> = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    Object.keys(bindings).forEach((i) => {
      componentRef.instance[i] = bindings[i];
    });

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    return componentRef;
  }

  disposeComponent(componentRef: ComponentRef<any>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
