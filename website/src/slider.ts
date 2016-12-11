import {autoinject, bindable, BindingEngine, Disposable, bindingMode} from 'aurelia-framework';
import "jquery";
import "rangeslider"

@autoinject
export class Slider {
  @bindable dataOrientation : string;
  @bindable ({ defaultBindingMode: bindingMode.twoWay }) value  : number;
  @bindable min;
  @bindable max;

  disposables: Disposable[] = [];
  bindingEngine: BindingEngine;
  slider : any;
  horizontalSlider : any;
  currentVal : number;

  element : Element;
  constructor(element: Element, bindingEngine: BindingEngine) {
    this.element = element;
    this.bindingEngine = bindingEngine;
  }

  attached() {
    this.slider = (<any>$(<any>this.element)).find('input[type="range"]');

    this.slider.rangeslider(
      {
        polyfill: false,
        onSlide: (pos, val) => this.slide(val)
      });
    this.horizontalSlider = (<any>$(<any>this.element)).find('.rangeslider--horizontal > .rangeslider__handle');

    (<any>$(<any>window)).on("resize", () => {
        console.debug("resize");
        this.horizontalSlider.css("width", "" + this.horizontalSlider.height() + "px");
      }
    );
    this.horizontalSlider.css("width", "" + this.horizontalSlider.height() + "px");
    this.slider.rangeslider('update', true);
    this.disposables.push(this.bindingEngine.propertyObserver(this, 'value').subscribe((n,o)=>this.onChanged(n)));
  }

  onChanged(val: number)
  {
    if ((val != this.currentVal) ||  (this.currentVal == null))
    {
      this.currentVal = val;
      this.slider.val(val).change();
    }
  }

  detach()
  {
    for (let x of this.disposables) {
      x.dispose();
    }
    this.disposables = [];
  }

  slide (val:number)
  {
    this.value = val;
  }
}
