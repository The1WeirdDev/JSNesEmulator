class Cpu {
    constructor() {
        this.Init();
    }
    Init() {
        this.cpu_instructor = new CpuInstructor(this);

        this.status_flags = {
            C: (1 << 0), // Carry Bit
            Z: (1 << 1), // Zero
            I: (1 << 2), // Disable Interrupts
            D: (1 << 3), // Decimal Mode
            B: (1 << 4), // Break
            U: (1 << 5), // Unused
            V: (1 << 6), // Overflow
            N: (1 << 7), // negative
        }

        this.addr_modes = {
            "Accumulator": 0,
            "Relative": 1,
            "Immediate": 2,
            "Implied": 3,
            "ZeroPage": 4,
            "ZeroPageX": 5,
            "ZeroPageY": 6,
            "Absolute": 7,
            "AbsoluteX": 8,
            "AbsoluteY": 9,
            "Indirect": 10,
            "IndirectX": 11,
            "IndirectY": 12,
            "NoneAddressing": 13,
        };

        this.opcode_handler = new Array(256);

        for (var i = 0; i < 256; i++) {
            this.opcode_handler[i] = { name: "XXX", operand: this.cpu_instructor.XXX, cycles: 1, address_mode: this.addr_modes.NoneAddressing };
        }

        this.opcode_handler[0x00] = { name: "BRK", operand: this.cpu_instructor.BRK, cycles: 7, address_mode: this.addr_modes.NoneAddressing };
        this.opcode_handler[0xEA] = { name: "NOP", operand: this.cpu_instructor.NOP, cycles: 2, address_mode: this.addr_modes.Implied };

        //Implied Status Instructions
        this.opcode_handler[0x18] = { name: "CLC", operand: this.cpu_instructor.CLC, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xD8] = { name: "CLD", operand: this.cpu_instructor.CLD, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x58] = { name: "CLI", operand: this.cpu_instructor.CLI, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xB8] = { name: "CLV", operand: this.cpu_instructor.CLV, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x38] = { name: "SEC", operand: this.cpu_instructor.CLD, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x78] = { name: "SEI", operand: this.cpu_instructor.CLI, cycles: 1, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xF8] = { name: "SED", operand: this.cpu_instructor.CLV, cycles: 1, address_mode: this.addr_modes.Implied };

        //Comparing
        this.opcode_handler[0xC9] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xC5] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xD5] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xCD] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xDD] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0xD9] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0xC1] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0xD1] = { name: "CMP", operand: this.cpu_instructor.CMP, cycles: 5, address_mode: this.addr_modes.IndirectY };
        this.opcode_handler[0xE0] = { name: "CPX", operand: this.cpu_instructor.CPX, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xE4] = { name: "CPX", operand: this.cpu_instructor.CPX, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xEC] = { name: "CPX", operand: this.cpu_instructor.CPX, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xC0] = { name: "CPY", operand: this.cpu_instructor.CPY, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xC4] = { name: "CPY", operand: this.cpu_instructor.CPY, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xCC] = { name: "CPY", operand: this.cpu_instructor.CPY, cycles: 4, address_mode: this.addr_modes.Absolute };

        //Bitwise math
        this.opcode_handler[0x29] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0x25] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0x35] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0x2D] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x3D] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0x39] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0x21] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0x31] = { name: "AND", operand: this.cpu_instructor.AND, cycles: 5, address_mode: this.addr_modes.IndirectY };


        //Basic Math
        this.opcode_handler[0x69] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0x65] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0x75] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0x6D] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x7D] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0x79] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0x61] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0x71] = { name: "ADC", operand: this.cpu_instructor.ADC, cycles: 5, address_mode: this.addr_modes.IndirectY };


        this.opcode_handler[0xE9] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xE5] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xF5] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xED] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xFD] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0xF9] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0xE1] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0xF1] = { name: "SBC", operand: this.cpu_instructor.SBC, cycles: 5, address_mode: this.addr_modes.IndirectY };

        //Memory Instructions
        this.opcode_handler[0xA9] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xA5] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xB5] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xAD] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xBD] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0xB9] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0xA1] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0xB1] = { name: "LDA", operand: this.cpu_instructor.LDA, cycles: 5, address_mode: this.addr_modes.IndirectY };
        this.opcode_handler[0xA2] = { name: "LDX", operand: this.cpu_instructor.LDX, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xA6] = { name: "LDX", operand: this.cpu_instructor.LDX, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xB6] = { name: "LDX", operand: this.cpu_instructor.LDX, cycles: 4, address_mode: this.addr_modes.ZeroPageY };
        this.opcode_handler[0xAE] = { name: "LDX", operand: this.cpu_instructor.LDX, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xBE] = { name: "LDX", operand: this.cpu_instructor.LDX, cycles: 4, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0xA0] = { name: "LDY", operand: this.cpu_instructor.LDY, cycles: 2, address_mode: this.addr_modes.Immediate };
        this.opcode_handler[0xA4] = { name: "LDY", operand: this.cpu_instructor.LDY, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xB4] = { name: "LDY", operand: this.cpu_instructor.LDY, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xAC] = { name: "LDY", operand: this.cpu_instructor.LDY, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xBC] = { name: "LDY", operand: this.cpu_instructor.LDY, cycles: 4, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0x85] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0x95] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0x8D] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x9D] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 5, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0x99] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 5, address_mode: this.addr_modes.AbsoluteY };
        this.opcode_handler[0x81] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 6, address_mode: this.addr_modes.IndirectX };
        this.opcode_handler[0x91] = { name: "STA", operand: this.cpu_instructor.STA, cycles: 6, address_mode: this.addr_modes.IndirectY };
        this.opcode_handler[0x86] = { name: "STX", operand: this.cpu_instructor.STX, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0x96] = { name: "STX", operand: this.cpu_instructor.STX, cycles: 4, address_mode: this.addr_modes.ZeroPageY };
        this.opcode_handler[0x8E] = { name: "STX", operand: this.cpu_instructor.STX, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x84] = { name: "STY", operand: this.cpu_instructor.STY, cycles: 3, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0x94] = { name: "STY", operand: this.cpu_instructor.STY, cycles: 4, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0x8C] = { name: "STY", operand: this.cpu_instructor.STY, cycles: 4, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xE6] = { name: "INC", operand: this.cpu_instructor.INC, cycles: 5, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xF6] = { name: "INC", operand: this.cpu_instructor.INC, cycles: 6, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xEE] = { name: "INC", operand: this.cpu_instructor.INC, cycles: 6, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xFE] = { name: "INC", operand: this.cpu_instructor.INC, cycles: 7, address_mode: this.addr_modes.AbsoluteX };
        this.opcode_handler[0xC6] = { name: "DEC", operand: this.cpu_instructor.INC, cycles: 5, address_mode: this.addr_modes.ZeroPage };
        this.opcode_handler[0xD6] = { name: "DEC", operand: this.cpu_instructor.INC, cycles: 6, address_mode: this.addr_modes.ZeroPageX };
        this.opcode_handler[0xCE] = { name: "DEC", operand: this.cpu_instructor.INC, cycles: 6, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0xDE] = { name: "DEC", operand: this.cpu_instructor.INC, cycles: 7, address_mode: this.addr_modes.AbsoluteX };

        //Register Instructions
        this.opcode_handler[0xAA] = { name: "TAX", operand: this.cpu_instructor.TAX, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x8A] = { name: "TXA", operand: this.cpu_instructor.TXA, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xA8] = { name: "TAY", operand: this.cpu_instructor.TAY, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x98] = { name: "TYA", operand: this.cpu_instructor.TYA, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xE8] = { name: "INX", operand: this.cpu_instructor.INX, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xC8] = { name: "INY", operand: this.cpu_instructor.INY, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0xCA] = { name: "DEX", operand: this.cpu_instructor.DEX, cycles: 2, address_mode: this.addr_modes.Implied };
        this.opcode_handler[0x88] = { name: "DEY", operand: this.cpu_instructor.DEY, cycles: 2, address_mode: this.addr_modes.Implied };

        //Branches
        this.opcode_handler[0x10] = { name: "BPL", operand: this.cpu_instructor.BPL, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0x30] = { name: "BMI", operand: this.cpu_instructor.BMI, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0x50] = { name: "BVC", operand: this.cpu_instructor.BVC, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0x70] = { name: "BVS", operand: this.cpu_instructor.BVS, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0x90] = { name: "BCC", operand: this.cpu_instructor.BCC, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0xB0] = { name: "BCS", operand: this.cpu_instructor.BCS, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0xD0] = { name: "BNE", operand: this.cpu_instructor.BNE, cycles: 2, address_mode: this.addr_modes.Relative };
        this.opcode_handler[0xF0] = { name: "BEQ", operand: this.cpu_instructor.BEQ, cycles: 2, address_mode: this.addr_modes.Relative };

        //Jumps
        this.opcode_handler[0x4C] = { name: "JMP", operand: this.cpu_instructor.JMP, cycles: 3, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x6C] = { name: "JMP", operand: this.cpu_instructor.JMP, cycles: 5, address_mode: this.addr_modes.Indirect };
        this.opcode_handler[0x20] = { name: "JSR", operand: this.cpu_instructor.JSR, cycles: 6, address_mode: this.addr_modes.Absolute };
        this.opcode_handler[0x60] = { name: "RTS", operand: this.cpu_instructor.RTS, cycles: 6, address_mode: this.addr_modes.Implied };


        this.Reset();
    }

    Reset() {
        //Special Registers
        this.pc = new UInt16(0x8000); //Program Counter
        this.sp = new UInt8(0xFF); //Stack Pointer
        this.p = new UInt8(); //Status

        this.opcode = 0x00;
        this.total_cycles = 0;
        this.cycles = 0;

        //Registers
        this.A = new UInt8();
        this.X = new UInt8();
        this.Y = new UInt8();

        //Memory
        this.RAM = new Uint8Array(0xFFFF);
        this.VRAM = new Uint8Array(2048);

        //this.test_rom = [0x4C, 0x03, 0x00, 0x20, 0x11, 0x00, 0xC0, 0x00, 0xF0, 0x03, 0x4C, 0x03, 0x00, 0xCA, 0x4C, 0x03, 0x00, 0x88, 0x60];
        //this.LoadRom(this.test_rom);
    }

    GetFlag(flag) {
        return ((this.p.value[0] & flag) > 0) ? 1 : 0
    }

    SetFlag(flag, value) {
        //If the value is there we | the status flag with the flag
        //If the value is false then we set the flag off
        if (value)
            this.p.value[0] |= flag;
        else
            this.p.value[0] &= ~flag;
    }

    Clock() {
        this.total_cycles++;

        if (this.cycles == 0) {
            var opcode = this.GetMemVal(cpu.pc.Get());

            //Setting Unused Flag to true because I seen somebody else do it
            this.SetFlag(this.status_flags.U, true);

            //Getting instruction
            var instruction = this.GetInstruction(opcode);
            this.opcode = opcode;

            AddCurrentInstructionToLogs(instruction);
            this.ExecuteInstruction(instruction);
            return;
        }

        this.cycles--;
    }

    GetInstruction(opcode) {
        return this.opcode_handler[opcode];
    }

    ExecuteInstruction(instruction) {
        //Executing Instruction and adding cycles
        instruction.operand(instruction.address_mode);
        this.cycles += instruction.cycles - 1;
    }

    DecodeOpcodeAsString(location, opcode) {
        var instruction = this.GetInstruction(opcode);
        var command = instruction.name;
        var params = "";

        switch (instruction.address_mode) {
            case cpu.addr_modes.Immediate: {
                var val = cpu.GetMemVal(location + 1);
                params = `#$${NumToHex(val, 2)}`;

                break;
            }
            case cpu.addr_modes.ZeroPage: {
                var val = cpu.GetMemVal(cpu.GetMemVal(location + 1));
                params = `$${NumToHex(val, 2)}`;

                break;
            }
            case cpu.addr_modes.ZeroPageX: {
                var val = cpu.GetMemVal(new UInt8(cpu.GetMemVal(location + 1) + cpu.X.Get()).Get());
                params = `$${NumToHex(val, 2)}, X`;

                break;
            }
            case cpu.addr_modes.ZeroPageY: {
                var val = cpu.GetMemVal(new UInt8(cpu.GetMemVal(location + 1) + cpu.Y.Get()).Get());
                params = `$${NumToHex(val, 2)}, Y`;

                break;
            }
            case cpu.addr_modes.Absolute: {
                var addr = (cpu.GetMemVal(location + 2) << 8) | cpu.GetMemVal(location + 1);
                params = `$${NumToHex(addr, 4)}`;

                break;
            }
            case cpu.addr_modes.AbsoluteX: {
                var addr = (cpu.GetMemVal(location + 2) << 8) | cpu.GetMemVal(location + 1);
                var val = cpu.GetMemVal(addr + cpu.X.Get() + cpu.GetFlag(cpu.status_flags.C));
                params = `$${NumToHex(val, 4)}, X`;

                break;
            }
            case cpu.addr_modes.AbsoluteY: {
                var addr = (cpu.GetMemVal(location + 2) << 8) | cpu.GetMemVal(location + 1);
                var val = cpu.GetMemVal(addr + cpu.Y.Get() + cpu.GetFlag(cpu.status_flags.C));

                params = `$${NumToHex(val, 4)}, Y`;
                break;
            }
            case cpu.addr_modes.Relative: {
                var addr = cpu.GetMemVal(location + 1);

                params = `$${NumToHex(addr, 2)}`;
                break;
            }
            case cpu.addr_modes.Indirect: {
                var addr = (cpu.GetMemVal(location + 2) << 8) | cpu.GetMemVal(location + 1);
                params = `$(${NumToHex(addr, 4)})`;

                break;
            }
            case cpu.addr_modes.IndirectX: {
                //Getting location of address
                var zero_page_pointer = cpu.GetMemVal((cpu.pc.Get() + 1));

                params = `(${NumToHex(zero_page_pointer, 2)}, X)`;
                break;
            }
            case cpu.addr_modes.IndirectY: {
                //Getting location of address
                var zero_page_pointer = cpu.GetMemVal(cpu.pc.Get() + 1);

                params = `(${NumToHex(zero_page_pointer, 2)}), Y`;
                break;
            }
        }

        return `${command} ${params}`;
    }

    LoadRom(data) {
        if (data[3] != 0x1A) {
            console.log("Invalid Nes Rom.");
            return;
        }

        var prg_rom_size = 16384 * data[4];
        var chr_rom_size = 8192 * data[5];

        console.log(prg_rom_size);

        for (var i = 0; i < prg_rom_size; i++) {
            this.RAM[0x8000 + i] = data[16 + i];
        }

        can_clock = true;
    }

    CheckForMirrors(loc) {
        if (loc >= 0x800 && loc <= 0xFFF)
            return loc - 0x800;
        else if (loc >= 0x1000 && loc <= 0x17FF)
            return loc - 0x1000;
        else if (loc >= 0x1800 && loc <= 0x1FFF)
            return loc - 0x1800;
        else
            return loc;
    }

    SetMemVal(loc, value) {
        this.RAM[this.CheckForMirrors(loc)] = value;
    }

    GetMemVal(loc) {
        return this.RAM[loc];
    }
}