var run_btn = document.getElementById('run_btn');
var originlog = console.log;
var logElement = document.querySelector('.terminal_div');
console.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    originlog.apply(console, args);
    var message = args.map(function (arg) { return typeof arg === 'object' ? JSON.stringify(arg) : arg; }).join(' ');
    logElement.innerHTML += "<div>".concat(message, "\n</div>");
};
run_btn.onclick = function () {
    var input = document.getElementById('code_input');
    var code = input.value.split('\n');
    for (var _i = 0, code_1 = code; _i < code_1.length; _i++) {
        var line = code_1[_i];
        eval(line);
    }
};
