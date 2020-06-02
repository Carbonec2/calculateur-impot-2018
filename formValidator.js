function FormValidator(container){
    
    this.container = container;
    
    this.actualBackground = this.container.css('backgroundColor');
}

FormValidator.prototype.notValid = function(){

    this.container.css('backgroundColor', '#ff6666');
    
}

FormValidator.prototype.valid = function(){
    
    var thisValidator = this;

    this.container.css('backgroundColor', this.thisValidator);
    
}