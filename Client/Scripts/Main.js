var update_loop = null;

var cpu = null;
var element = document.getElementById("sus");
var element1 = document.getElementById("sus1");
var element2 = document.getElementById("sus2");
var instruction_holder = document.getElementById("instructed");

var desired_frame_rate = 60;
var can_clock = false;
var continuous_run = true;

function NumToHex(num, digits) {
    return (parseInt(num, 10).toString(16).padStart(digits, "0").toUpperCase());
}
function AddToLogs(text) {
    var text_element = document.createElement("p");
    text_element.innerHTML = text;
    instruction_holder.appendChild(text_element);
    instruction_holder.scrollTop = instruction_holder.scrollHeight;
}

function AddCurrentInstructionToLogs() {
    AddToLogs("0x" + NumToHex(cpu.pc.Get(), 4) + " : " + cpu.DecodeOpcodeAsString(cpu.pc.Get(), cpu.GetMemVal(cpu.pc.Get())));
}

function OnLoadRomPressed() {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {
        var data = reader.result;
        cpu.LoadRom(new Uint8Array(data));
    };

    reader.readAsArrayBuffer(input.files[0]);
}
function OnButton1Pressed() {
    continuous_run = !continuous_run;
    button1 = document.getElementById("button1");
    button1.innerText = (continuous_run ? "Stop" : "Start");
    button2.className = !continuous_run ? "‌ShowClass" : "HideClass";
}

/*
TODO

I noticed that I did not implement All Indirect Adressing Moded correctly
*/

function Start() {
    Init();
    window.onbeforeunload = CleanUp();
    update_loop = setInterval(Update, 1000 / desired_frame_rate);
}
function Init() {
    cpu = new Cpu();

    document.addEventListener("keydown", Input.OnKeyDown);
    document.addEventListener("keyup", Input.OnKeyUp);

    var text = document.createElement("p");
    text.innerHTML = "Program Counter" + " : " + "Name";
    instruction_holder.appendChild(text);
    instruction_holder.scrollTop = instruction_holder.scrollHeight;
}
function Update() {
    if (continuous_run)
        Clock();

    element.innerHTML = `TotalCycles:${cpu.total_cycles} PC:${NumToHex(cpu.pc.Get(), 4)} SP:${NumToHex(cpu.sp.Get(), 2)} P:${NumToHex(cpu.p.Get(), 2)}`;
    element1.innerHTML = `C:${cpu.GetFlag(cpu.status_flags.C)} Z:${cpu.GetFlag(cpu.status_flags.Z)} I:${cpu.GetFlag(cpu.status_flags.I)} D:${cpu.GetFlag(cpu.status_flags.D)} B:${cpu.GetFlag(cpu.status_flags.B)} U:${cpu.GetFlag(cpu.status_flags.U)} V:${cpu.GetFlag(cpu.status_flags.V)} N:${cpu.GetFlag(cpu.status_flags.N)}`;
    element2.innerHTML = `A:${cpu.A.Get()} X:${cpu.X.Get()} Y:${cpu.Y.Get()}`;
}
function Clock() {
    if (!can_clock)
        return;

    cpu.Clock();
}
function CleanUp() {
    clearInterval(update_loop);
}

Start();