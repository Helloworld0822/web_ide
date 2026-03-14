const run_btn = document.getElementById('run_btn') as HTMLButtonElement;

const originlog = console.log;
const logElement = document.querySelector('.terminal_div') as HTMLDivElement;

console.log = function(...args) {
    originlog.apply(console,args);

    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    logElement.innerHTML += `<div>${message}\n</div>`;
}

run_btn.onclick = () => {
    const input = document.getElementById('code_input') as HTMLTextAreaElement;
    const code = input.value.split('\n');
    for (const line of code) {
        eval(line);
    }
}