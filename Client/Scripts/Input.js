class Input {
    static OnKeyDown(e){
        e.preventDefault();
        if(e.repeat)
            return;
        
        var keycode = e.keyCode;
        if(keycode == 32 && continuous_run == false)
            Clock();
        else if(keycode == 82)
            continuous_run = !continuous_run;
    }
    static OnKeyUp(e){
        e.preventDefault();
        if(e.repeat)
            return;
        
    }
}