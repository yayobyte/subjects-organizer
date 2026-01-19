/**
 * Prerequisites mapping for curriculum subjects
 * Maps subject IDs to their prerequisite subject IDs
 */
export const PREREQUISITES_MAP: Record<string, string[]> = {
    // Basic Sciences
    "CB2A3": ["CB1B3"], // Diff Calc -> Math Fund
    "CB3A4": ["CB2A3"], // Int Calc -> Diff Calc
    "CB4A4": ["CB3A4", "CB223"], // Multi Calc -> Int Calc & Lin Alg
    "CB4A3": ["CB3A4"], // Diff Eq -> Int Calc
    "CB334": ["CB234"], // Phys II -> Phys I
    "CB434": ["CB334"], // Phys III -> Phys II
    "CB242": ["CB234"], // Lab I -> Phys I
    "CB342": ["CB334"],
    "CB442": ["CB434"],

    // Programming / CS Core
    "IS105": ["IS193"], // Prog I -> Intro Info
    "IS284": ["IS105"], // Prog II -> Prog I
    "IS304": ["IS284", "IS142"], // Data Struct -> Prog II & Logic
    "IS453": ["IS304"], // Prog III -> Data Struct
    "IS553": ["IS453"], // Prog IV -> Prog III
    "IS644": ["IS304"], // DB I -> Data Struct
    "IS614": ["IS634"], // Comp Arch -> Digital Elec
    "IS634": ["IS474"], // Digital Elec -> Fund Elec
    "IS734": ["IS614", "IS304"], // OS -> Arch & Data Struct
    "IS784": ["IS323", "IS304"], // AI -> Logic & Data Struct
    "IS753": ["IS405", "IS304"], // Compilers -> Grammars & Data Struct
    "IS714": ["IS644", "IS453"], // SE I -> DB & Prog III
    "IS884": ["IS714"], // SE II -> SE I
    "IS924": ["IS893", "IS553"], // Client-Server -> Dist Sys & Prog IV
    "IS893": ["IS734", "IS723"], // Dist Sys -> OS & Comms I
    "IS723": ["CB242", "IS474"], // Comms I -> Phys & Elec
    "IS823": ["IS723"], // Comms II -> Comms I

    // Other
    "BA372": ["BA170"], // Humanities II -> I
    "IS962": ["IS714"], // Project I -> SE I
    "IS066": ["IS962"], // Project II -> I
};

/**
 * Helper function to get all semesters (1-10)
 * Returns all semesters regardless of whether they have subjects
 */
export function getSortedSemesters(): string[] {
    // Always return all 10 semesters
    return [
        'Semestre 1',
        'Semestre 2',
        'Semestre 3',
        'Semestre 4',
        'Semestre 5',
        'Semestre 6',
        'Semestre 7',
        'Semestre 8',
        'Semestre 9',
        'Semestre 10',
    ];
}
