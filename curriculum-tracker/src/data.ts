import type { StudentData } from './types';

export const INITIAL_DATA: StudentData = {
    "studentName": "Cristian Gutierrez Gonzalez",
    "subjects": [
        { "semester": "Semestre 1", "id": "BA170", "name": "Humanidades I (Base)", "credits": 2, "status": "missing" },
        { "semester": "Semestre 1", "id": "BU101", "name": "Deportes I (Base)", "credits": 1, "status": "completed", "grade": "Aprobada" },
        { "semester": "Semestre 1", "id": "CB1B3", "name": "Matemáticas Fundamentales", "credits": 3, "status": "completed", "grade": 3.4 },
        { "semester": "Semestre 1", "id": "IS142", "name": "Desarrollo del Pensamiento Lógico", "credits": 2, "status": "missing" },
        { "semester": "Semestre 1", "id": "IS193", "name": "Introducción a La Informatica", "credits": 3, "status": "completed", "grade": 3.3 },
        { "semester": "Semestre 2", "id": "IS105", "name": "Programación I", "credits": 5, "status": "completed", "grade": 3.3 },
        { "semester": "Semestre 2", "id": "CB2A3", "name": "Cálculo Diferencial", "credits": 3, "status": "completed", "grade": 3.5 },
        { "semester": "Semestre 2", "id": "CB234", "name": "Física I", "credits": 4, "status": "completed", "grade": 3.8 },
        { "semester": "Semestre 2", "id": "CB242", "name": "Laboratorio de Física I", "credits": 2, "status": "completed", "grade": 4.3 },
        { "semester": "Semestre 2", "id": "BA372", "name": "Humanidades II", "credits": 2, "status": "completed", "grade": 4.2 },
        { "semester": "Semestre 3", "id": "CB223", "name": "Álgebra Lineal", "credits": 3, "status": "completed", "grade": 3.1 },
        { "semester": "Semestre 3", "id": "CB334", "name": "Física II", "credits": 4, "status": "completed", "grade": 3.4 },
        { "semester": "Semestre 3", "id": "CB342", "name": "Laboratorio de Física II", "credits": 2, "status": "completed", "grade": 3.1 },
        { "semester": "Semestre 3", "id": "IS284", "name": "Programación II", "credits": 4, "status": "completed", "grade": 5 },
        { "semester": "Semestre 3", "id": "CB3A4", "name": "Cálculo Integral", "credits": 4, "status": "missing" },
        { "semester": "Semestre 4", "id": "CB4A4", "name": "Cálculo Multivariado", "credits": 4, "status": "completed", "grade": 3.9 },
        { "semester": "Semestre 4", "id": "IS304", "name": "Estructura de Datos", "credits": 4, "status": "completed", "grade": 3.1 },
        { "semester": "Semestre 4", "id": "IS474", "name": "Fundamentos de Electrónica", "credits": 3, "status": "completed", "grade": 3.3 },
        { "semester": "Semestre 4", "id": "IS482", "name": "Teoría de Sistemas", "credits": 2, "status": "completed", "grade": 3 },
        { "semester": "Semestre 4", "id": "IS543", "name": "Laboratorio de Electrónica", "credits": 2, "status": "completed", "grade": 3.1 },
        { "semester": "Semestre 5", "id": "CB4A3", "name": "Ecuaciones Diferenciales Ordinarias", "credits": 3, "status": "missing" },
        { "semester": "Semestre 5", "id": "IS323", "name": "Lógica", "credits": 3, "status": "completed", "grade": 3.1 },
        { "semester": "Semestre 5", "id": "IS453", "name": "Programación III", "credits": 3, "status": "missing" },
        { "semester": "Semestre 5", "id": "IS503", "name": "Administración de Empresas", "credits": 3, "status": "completed", "grade": 3.7 },
        { "semester": "Semestre 5", "id": "IS634", "name": "Electrónica Digital", "credits": 3, "status": "completed", "grade": 3.7 },
        { "semester": "Semestre 5", "id": "IS773", "name": "Laboratorio De Electrónica Digital", "credits": 2, "status": "missing" },
        { "semester": "Semestre 6", "id": "CB434", "name": "Física III", "credits": 4, "status": "completed", "grade": 3 },
        { "semester": "Semestre 6", "id": "CB442", "name": "Laboratorio de Física III", "credits": 2, "status": "completed", "grade": 3.5 },
        { "semester": "Semestre 6", "id": "IS405", "name": "Gramáticas y Lenguajes Formales", "credits": 4, "status": "completed", "grade": 3 },
        { "semester": "Semestre 6", "id": "IS512", "name": "Estadistica", "credits": 2, "status": "missing" },
        { "semester": "Semestre 6", "id": "IS553", "name": "Programación IV", "credits": 3, "status": "completed", "grade": 4.4 },
        { "semester": "Semestre 7", "id": "IS184", "name": "Tecnicas De La Comunicación", "credits": 2, "status": "completed", "grade": 4.1 },
        { "semester": "Semestre 7", "id": "IS614", "name": "Arquitectura de Computadores", "credits": 4, "status": "completed", "grade": 3.9 },
        { "semester": "Semestre 7", "id": "IS623", "name": "Computación Gráfica", "credits": 3, "status": "missing" },
        { "semester": "Semestre 7", "id": "IS644", "name": "Base De Datos I", "credits": 4, "status": "missing" },
        { "semester": "Semestre 7", "id": "IS692", "name": "Estadística Especial", "credits": 2, "status": "missing" },
        { "semester": "Semestre 8", "id": "IS653", "name": "Investigación de Operaciones", "credits": 3, "status": "missing" },
        { "semester": "Semestre 8", "id": "IS714", "name": "Ingeniería de Sofware I", "credits": 4, "status": "missing" },
        { "semester": "Semestre 8", "id": "IS723", "name": "Comunicaciones I", "credits": 3, "status": "completed", "grade": 4.1 },
        { "semester": "Semestre 8", "id": "IS734", "name": "Sistemas Operativos I", "credits": 4, "status": "missing" },
        { "semester": "Semestre 9", "id": "IS753", "name": "Compiladores", "credits": 3, "status": "missing" },
        { "semester": "Semestre 9", "id": "IS784", "name": "Inteligencia Artificial", "credits": 3, "status": "missing" },
        { "semester": "Semestre 9", "id": "IS884", "name": "Ingeniería de Software II", "credits": 4, "status": "missing" },
        { "semester": "Semestre 9", "id": "IS842", "name": "Legislación, Ética y Contratación", "credits": 2, "status": "missing" },
        { "semester": "Semestre 9", "id": "IS053", "name": "Gerencia De Proyectos", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS823", "name": "Comunicaciones II", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS845", "name": "Computación Blanda", "credits": 4, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS873", "name": "Laboratorio Del Software", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS893", "name": "Sistemas Distribuidos", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS953", "name": "Administración De Proyectos de Software", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS924", "name": "Arquitectura Cliente-Servidor", "credits": 4, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS962", "name": "Proyecto de Grado I", "credits": 2, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS023", "name": "Auditoría de Sistemas", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS9A0", "name": "Electiva A1", "credits": 6, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS031", "name": "Constitución Política", "credits": 1, "status": "missing" },
        { "semester": "Semestre 12", "id": "IS066", "name": "Proyecto De Grado II", "credits": 6, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS073", "name": "Emprendimiento", "credits": 3, "status": "missing" },
        { "semester": "Semestre 10", "id": "IS0A0", "name": "Electiva A2", "credits": 6, "status": "missing" }
    ]
};

// Map of Prerequisites: "SubjectID" -> ["PrereqID1", "PrereqID2"]
// Inferred based on typical Engineering curriculum structure
const PREREQUISITES_MAP: Record<string, string[]> = {
    // Basic Sciences
    "CB2A3": ["CB1B3"], // Diff Calc -> Math Fund
    "CB3A4": ["CB2A3"], // Int Calc -> Diff Calc
    "CB4A4": ["CB3A4", "CB223"], // Multi Calc -> Int Calc & Lin Alg
    "CB4A3": ["CB3A4"], // Diff Eq -> Int Calc
    "CB334": ["CB234"], // Phys II -> Phys I
    "CB434": ["CB334"], // Phys III -> Phys II
    "CB242": ["CB234"], // Lab I -> Phys I (Concurrent usually, but lets link)
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
    "IS784": ["IS323", "IS304"], // AI -> Logic & Data Struct (Example)
    "IS753": ["IS405", "IS304"], // Compilers -> Grammars & Data Struct
    "IS714": ["IS644", "IS453"], // SE I -> DB & Prog III
    "IS884": ["IS714"], // SE II -> SE I
    "IS924": ["IS893", "IS553"], // Client-Server -> Dist Sys & Prog IV
    "IS893": ["IS734", "IS723"], // Dist Sys -> OS & Comms I
    "IS723": ["CB242", "IS474"], // Comms I -> Phys & Elec (Guess)
    "IS823": ["IS723"], // Comms II -> Comms I

    // Other
    "BA372": ["BA170"], // Humanities II -> I
    "IS962": ["IS714"], // Project I -> SE I
    "IS066": ["IS962"], // Project II -> I
};

// Hydrate the raw data with prerequisites
export const HYDRATED_DATA: StudentData = {
    ...INITIAL_DATA,
    subjects: INITIAL_DATA.subjects.map(sub => ({
        ...sub,
        prerequisites: PREREQUISITES_MAP[sub.id] || []
    }))
};

export const SEMESTERS = Array.from(new Set(INITIAL_DATA.subjects.map(s => s.semester))).sort((a, b) => {
    // Sort logic to ensure Semestre 1, 2, 10 order correct
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
});
