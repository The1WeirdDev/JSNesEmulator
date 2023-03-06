class UInt8 {
    constructor(value) {
        this.value = new Uint8Array(1);

        if (value != NaN)
            this.value[0] = value;
        else
            this.value[0] = 0;
    }

    Inc() {
        this.value[0]++;
    }

    Dec() {
        this.value[0]--;
    }

    Add(value){
        this.value[0] += value;
    }

    Sub(value){
        this.value[0] -= value;
    }

    Get() {
        return this.value[0];
    }

    Set(value) {
        this.value[0] = value;
    }
}

class UInt16 {
    constructor(value) {
        this.value = new Uint16Array(1);

        if (value != NaN)
            this.value[0] = value;
        else
            this.value[0] = 0;
    }

    Inc() {
        this.value[0]++;
    }

    Dec() {
        this.value[0]--;
    } 
    
    Add(value){
        this.value[0] += value;
    }

    Sub(value){
        this.value[0] -= value;
    }

    Get() {
        return this.value[0];
    }

    Set(value) {
        this.value[0] = value;
    }
}