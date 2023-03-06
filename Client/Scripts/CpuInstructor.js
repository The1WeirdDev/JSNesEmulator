class CpuInstructor {
    /*
        This class is just for instructions and executes them on the cpu
    */

    XXX() {
        console.log(`Illegal Opcode ${NumToHex(cpu.opcode, 2)} at ${cpu.pc.Get()}`);
        can_clock = false;
    }

    BRK() {
        cpu.SetFlag(cpu.status_flags.B, true);
        cpu.pc.Add(1);
        //can_clock = false;
    }

    NOP() {
        cpu.pc.Inc();
    }

    //Clear Commands
    CLC() {
        cpu.SetFlag(cpu.status_flags.C, false);
        cpu.pc.Inc();
    }

    CLD() {
        cpu.SetFlag(cpu.status_flags.D, false);
        cpu.pc.Inc();
    }

    CLI() {
        cpu.SetFlag(cpu.status_flags.I, false);
        cpu.pc.Inc();
    }

    CLV() {
        cpu.SetFlag(cpu.status_flags.V, false);
        cpu.pc.Inc();
    }

    SEC() {
        cpu.SetFlag(cpu.status_flags.C, true);
        cpu.pc.Inc();
    }

    SEI() {
        cpu.SetFlag(cpu.status_flags.I, true);
        cpu.pc.Inc();
    }

    SED() {
        cpu.SetFlag(cpu.status_flags.D, true);
        cpu.pc.Inc();
    }

    static GetValAndLen(addr_mode) {
        var _val, _len;

        switch (addr_mode) {
            case cpu.addr_modes.Immediate: {
                _val = cpu.GetMemVal(cpu.pc.Get() + 1);
                _len = 2;

                break;
            }
            case cpu.addr_modes.ZeroPage: {
                _val = cpu.GetMemVal(cpu.GetMemVal(cpu.pc.Get() + 1));
                _len = 2;

                break;
            }
            case cpu.addr_modes.ZeroPageX: {
                _val = cpu.GetMemVal(cpu.GetMemVal(cpu.pc.Get() + 1) + cpu.X.Get());
                _len = 2;

                break;
            }
            case cpu.addr_modes.Absolute: {
                var addr = (cpu.GetMemVal(cpu.pc.Get() + 2) << 8) | cpu.GetMemVal(cpu.pc.Get() + 1);
                _val = cpu.GetMemVal(addr);
                _len = 3;

                break;
            }
            case cpu.addr_modes.AbsoluteX: {
                var addr = (cpu.GetMemVal(cpu.pc.Get() + 2) << 8) | cpu.GetMemVal(cpu.pc.Get() + 1);

                //Checking if page is crossed
                if (Math.floor(cpu.pc.Get() % 256) != Math.floor(addr % 256))
                    cpu.cycles++;

                _val = cpu.GetMemVal(addr + cpu.X.Get() + cpu.GetFlag(cpu.status_flags.C));
                _len = 3;

                break;
            }
            case cpu.addr_modes.AbsoluteY: {
                var addr = (cpu.GetMemVal(cpu.pc.Get() + 2) << 8) | cpu.GetMemVal(cpu.pc.Get() + 1);

                if (Math.floor(cpu.pc.Get() % 256) != Math.floor(addr % 256))
                    cpu.cycles++; //Check for page boundry crossed

                _val = cpu.GetMemVal(addr + cpu.Y.Get() + cpu.GetFlag(cpu.status_flags.C));
                _len = 3;

                break;
            }
            case cpu.addr_modes.IndirectX: {
                //Getting location of address
                var addr = cpu.GetMemVal(cpu.pc.Get() + 1);
                var nv = new UInt8(addr + cpu.X.Get());

                _val = cpu.GetMemVal(nv.Get());
                _len = 2;
                break;
            }
            case cpu.addr_modes.IndirectY: {
                //Getting location of address
                var addr = cpu.GetMemVal(cpu.pc.Get() + 1);
                var un_addr = addr + cpu.Y.Get();
                var nv = new UInt8(un_addr);

                if (Math.floor(addr % 256) != Math.floor(un_addr % 256))
                    cpu.cycles++;

                _val = cpu.GetMemVal(nv.Get());
                _len = 2;
                break;
            }
        }

        return { val: _val, len: _len };
    }

    //Comparing
    CMP(addr_mode) {
        var val, len;

        //Getting the compared value and length
        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        //svar subtracted_value = new UInt8(cpu.A.Get() - val);

        cpu.SetFlag(cpu.status_flags.N, cpu.A.Get() < val);
        cpu.SetFlag(cpu.status_flags.Z, cpu.A.Get() == val);
        cpu.SetFlag(cpu.status_flags.C, cpu.A.Get() > val);

        cpu.pc.Add(len);
    }
    CPX(addr_mode) {
        var val, len;

        //Getting the compared value and length
        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetFlag(cpu.status_flags.N, cpu.X.Get() < val);
        cpu.SetFlag(cpu.status_flags.Z, cpu.X.Get() == val);
        cpu.SetFlag(cpu.status_flags.C, cpu.X.Get() > val);

        cpu.pc.Add(len);
    }
    CPY(addr_mode) {
        var val, len;

        //Getting the compared value and length
        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetFlag(cpu.status_flags.N, cpu.Y.Get() < val);
        cpu.SetFlag(cpu.status_flags.Z, cpu.Y.Get() == val);
        cpu.SetFlag(cpu.status_flags.C, cpu.Y.Get() > val);

        cpu.pc.Add(len);
    }

    //Bitwise Math
    AND(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;
        
        var new_a = cpu.A.Get() & val;

        cpu.A.Set(new_a);
        cpu.SetFlag(cpu.status_flags.N, (new_a >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, new_a == 0);
        cpu.pc.Add(len);
    }
    
    //Basic Math
    ADC(addr_mode) {
        var before_a = cpu.A.Get();
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        var c_bit = cpu.GetFlag(cpu.status_flags.C);
        cpu.A.Add(val + c_bit);

        //Setting Flags
        var n_status = (cpu.A.Get() >> 7) & 1;
        var v_status = cpu.A.Get() < val;
        var z_status = cpu.A.Get() == 0;
        var c_status = ((before_a + val + c_bit) >> 8) & 1;

        cpu.SetFlag(cpu.status_flags.N, n_status);
        cpu.SetFlag(cpu.status_flags.V, v_status);
        cpu.SetFlag(cpu.status_flags.Z, z_status);
        cpu.SetFlag(cpu.status_flags.C, c_status);

        cpu.pc.Add(len);
    }

    SBC(addr_mode) {
        var before_a = cpu.A.Get();
        var val = 0;
        var len = 0;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        var c_bit = cpu.GetFlag(cpu.status_flags.C);
        cpu.A.Sub(val + c_bit);

        //Setting Flags
        var n_status = (cpu.A.Get() >> 7) & 1;
        var v_status = cpu.A.Get() < val;
        var z_status = cpu.A.Get() == 0;
        var c_status = ((before_a - (val + c_bit)) >> 8) & 1;

        cpu.SetFlag(cpu.status_flags.N, n_status);
        cpu.SetFlag(cpu.status_flags.V, v_status);
        cpu.SetFlag(cpu.status_flags.Z, z_status);
        cpu.SetFlag(cpu.status_flags.C, c_status);

        cpu.pc.Add(len);
    }
    //Branches
    Branch() {
        var offset = cpu.GetMemVal(cpu.pc.Get() + 1);
        var start_page = Math.floor((cpu.pc.Get() % 256));

        //Checking if the offset is going to be negative or positive
        if ((offset >> 7 & 1) == 0)
            cpu.pc.Add((offset & 127) + 2);
        else
            cpu.pc.Sub((offset & 127) + 2);

        //Checking if page boundry is crossed
        var end_page = Math.floor((cpu.pc.Get() % 256));
        if (start_page != end_page)
            cpu.cycles++;

        //Branches taken require a extra cycle
        cpu.cycles++;
    }
    BCC() {
        if (cpu.GetFlag(cpu.status_flags.C) == 0) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BCS() {
        if (cpu.GetFlag(cpu.status_flags.C) == 1) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BEQ() {
        if (cpu.GetFlag(cpu.status_flags.Z) == 1) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BNE() {
        if (cpu.GetFlag(cpu.status_flags.Z) == 0) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BMI() {
        if (cpu.GetFlag(cpu.status_flags.N) == 1) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BPL() {
        if (cpu.GetFlag(cpu.status_flags.N) == 0) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BVC() {
        if (cpu.GetFlag(cpu.status_flags.V) == 0) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }
    BVS() {
        if (cpu.GetFlag(cpu.status_flags.V) == 1) {
            cpu.cpu_instructor.Branch();
            return;
        }

        cpu.pc.Add(2);
    }

    //Jumps
    JMP(addr_mode) {
        var addr = null;
        var addr_1 = null;
        var addr_2 = null;

        switch (addr_mode) {
            case cpu.addr_modes.Absolute: {
                addr = (cpu.GetMemVal(cpu.pc.Get() + 2) << 8) | cpu.GetMemVal(cpu.pc.Get() + 1);
                break;
            }
            case cpu.addr_modes.Indirect: {
                //Getting location of address
                addr_1 = cpu.GetMemVal(cpu.pc.Get() + 1);
                addr_2 = cpu.GetMemVal(cpu.pc.Get() + 2);
                addr = (addr_2 << 8) | addr_1;

                addr_1 = cpu.GetMemVal(addr);
                addr_2 = cpu.GetMemVal(addr + 1);
                addr = (addr_2 << 8) | addr_1;
                break;
            }
        }

        cpu.pc.Set(addr);
    }

    JSR() {
        cpu.SetMemVal(0x100 + cpu.sp.Get(), cpu.pc.Get() & 0x00FF);
        cpu.SetMemVal(0x100 + cpu.sp.Get() - 1, cpu.pc.Get() & 0xFF00);
        cpu.sp.Sub(2);

        var addr = null;
        var addr_1 = null;
        var addr_2 = null;

        addr_1 = cpu.GetMemVal(cpu.pc.Get() + 1);
        addr_2 = cpu.GetMemVal(cpu.pc.Get() + 2);
        cpu.pc.Set((addr_2 << 8) | addr_1);
    }

    RTS() {
        var addr = null;
        var addr_1 = null;
        var addr_2 = null;

        cpu.sp.Add(2);
        addr_1 = cpu.GetMemVal(0x100 + cpu.sp.Get());
        addr_2 = cpu.GetMemVal(0x100 + cpu.sp.Get() - 1);
        addr = (addr_2 << 8) | addr_1;
        cpu.pc.Set(addr + 3);
    }

    //Register Commands
    TAX() {
        cpu.X.Set(cpu.A);
        cpu.SetFlag(cpu.status_flags.N, (cpu.X.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.X.Get() == 0);
        cpu.pc.Inc();
    }

    TXA() {
        cpu.A.Set(cpu.X);
        cpu.SetFlag(cpu.status_flags.N, (cpu.A.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.A.Get() == 0);
        cpu.pc.Inc();
    }

    TAY() {
        cpu.Y.Set(cpu.A);
        cpu.SetFlag(cpu.status_flags.N, (cpu.Y.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.Y.Get() == 0);
        cpu.pc.Inc();
    }

    TYA() {
        cpu.A.Set(cpu.Y);
        cpu.SetFlag(cpu.status_flags.N, (cpu.A.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.A.Get() == 0);
        cpu.pc.Inc();
    }

    //Memory Instructions
    LDA(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.A.Set(val);
        cpu.pc.Add(len);
    }
    LDX(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.X.Set(val);
        cpu.pc.Add(len);
    }
    LDY(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.Y.Set(val);
        cpu.pc.Add(len);
    }
    
    STA(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetMemVal(val, cpu.A.Get())
        cpu.pc.Add(len);
    }
    
    STX(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetMemVal(val, cpu.X.Get())
        cpu.pc.Add(len);
    }
    
    STY(addr_mode){
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetMemVal(val, cpu.Y.Get())
        cpu.pc.Add(len);
    }
    
    DEC(addr_mode) {
        var val, len;

        var data = CpuInstructor.GetValAndLen(addr_mode);
        val = data.val;
        len = data.len;

        cpu.SetMemVal(val, cpu.GetMemVal(val) - 1);
        cpu.pc.Add(len);
    }

    INC(addr_mode) {
        var addr, len;

        switch (addr_mode) {
            case cpu.addr_modes.ZeroPage: {
                addr = cpu.GetMemVal(cpu.GetMemVal(cpu.pc.Get() + 1));
                len = 2;
                break;
            }
            case cpu.addr_modes.ZeroPageX: {
                addr = cpu.GetMemVal(cpu.GetMemVal(cpu.pc.Get() + 1) + cpu.X.Get());
                len = 2;
                break;
            }
            case cpu.addr_modes.Absolute: {
                var addr_1 = cpu.GetMemVal(cpu.pc.Get() + 1);
                var addr_2 = cpu.GetMemVal(cpu.pc.Get() + 2);
                addr = (addr_2 << 8) | addr_1;
                len = 2;
                break;
            }
            case cpu.addr_modes.AbsoluteX: {
                var addr_1 = cpu.GetMemVal(cpu.pc.Get() + 1);
                var addr_2 = cpu.GetMemVal(cpu.pc.Get() + 2);
                addr = ((addr_2 << 8) | addr_1) + cpu.X.Get();
                len = 2;
                break;
            }
        }

        cpu.SetMemVal(addr, cpu.GetMemVal(addr) + 1);
        cpu.pc.Add(len);
    }

    INX() {
        cpu.X.Inc();
        cpu.SetFlag(cpu.status_flags.N, (cpu.X.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.X.Get() == 0);
        cpu.pc.Inc();
    }

    INY() {
        cpu.Y.Inc();
        cpu.SetFlag(cpu.status_flags.N, (cpu.Y.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.Y.Get() == 0);
        cpu.pc.Inc();
    }

    DEX() {
        cpu.X.Dec();
        cpu.SetFlag(cpu.status_flags.N, (cpu.X.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.X.Get() == 0);
        cpu.pc.Inc();
    }

    DEY() {
        cpu.Y.Dec();
        cpu.SetFlag(cpu.status_flags.N, (cpu.Y.Get() >> 7) & 1);
        cpu.SetFlag(cpu.status_flags.Z, cpu.Y.Get() == 0);
        cpu.pc.Inc();
    }
}