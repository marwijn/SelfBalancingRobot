import {inject, noView} from 'aurelia-framework';
//import your dependencies
import $ from 'jquery';
import ionRangeSlider from 'ion-rangeslider';

@noView()
@inject(Element)
export class Slider {

  constructor(element){
    this.element = element;
  }

  bind(){
    $(this.element).ionRangeSlider({min: 100, max: 1000, from: 550});
  }
}
