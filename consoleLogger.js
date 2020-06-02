function ConsoleLogger(container) {

    this.container = container;

    container.hide();

}

ConsoleLogger.prototype.goodNotice = function(content, hide) {

    var thisConsoleLogger = this;

    this.container.empty();

    this.container.css('backgroundColor', 'palegreen');
    this.container.css('borderLeft', '4px solid green');
    this.container.css('borderRight', '1px solid green');
    this.container.css('borderTop', '1px solid green');
    this.container.css('borderBottom', '1px solid green');
    this.container.css('padding', '10px');
    this.container.css('cursor', 'pointer');

    this.container.append('<span>' + content + '</span>');

    this.container.click(function() {
        thisConsoleLogger.container.hide("fast");
    });


    if (typeof(hide) !== "undefined" && hide === true) {
        this.container.show(0).delay(5000).hide("fast");
    }
    else {
        this.container.show();
    }

}

ConsoleLogger.prototype.badNotice = function(content, hide) {

    var thisConsoleLogger = this;

    this.container.empty();

    this.container.css('backgroundColor', '#FF9999');
    this.container.css('borderLeft', '4px solid red');
    this.container.css('borderRight', '1px solid red');
    this.container.css('borderTop', '1px solid red');
    this.container.css('borderBottom', '1px solid red');
    this.container.css('padding', '10px');
    this.container.css('cursor', 'pointer');

    this.container.append('<span>' + content + '</span>');

    this.container.click(function() {
        thisConsoleLogger.container.hide("fast");
    });

    if (typeof(hide) !== "undefined" && hide === true) {
        this.container.show(0).delay(5000).hide("fast");
    }
    else {
        this.container.show();
    }

}