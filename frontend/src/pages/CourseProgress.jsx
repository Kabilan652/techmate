import React, { useState, useEffect } from 'react';
import { 
    Loader2, AlertCircle, ChevronLeft, ChevronDown, ChevronRight, 
    BookOpen, Video, FileText, HelpCircle, Code, Bookmark, Edit3, 
    CheckCircle, Play, Trophy, Terminal, Send, Save, Check, Menu, X, Cpu, Globe, Database
} from 'lucide-react';
import { useAuth } from "../context/AuthContext"; // Import Auth
import { supabase } from "../lib/supabase"; // Import Supabase (Adjust path if needed)

// 1. STATIC DATA: CATALOG & SYLLABI

const POPULAR_LANGUAGES = [
    { id: 'py', name: "Python", category: "Backend", icon: Terminal, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 'js', name: "JavaScript", category: "Web", icon: Globe, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: 'java', name: "Java", category: "Backend", icon: Database, color: "text-red-500", bg: "bg-red-50" },
    { id: 'c', name: "C Programming", category: "Systems", icon: Cpu, color: "text-gray-700", bg: "bg-gray-100" },
    { id: 'cpp', name: "C++", category: "Systems", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: 'go', name: "Go", category: "Backend", icon: Terminal, color: "text-cyan-500", bg: "bg-cyan-50" },
    { id: 'rs', name: "Rust", category: "Systems", icon: Cpu, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 'ts', name: "TypeScript", category: "Web", icon: Code, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'cs', name: "C#", category: "Backend", icon: Database, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 'rb', name: "Ruby", category: "Backend", icon: Terminal, color: "text-red-600", bg: "bg-red-50" },
    { id: 'php', name: "PHP", category: "Web", icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: 'sw', name: "Swift", category: "Mobile", icon: Code, color: "text-orange-600", bg: "bg-orange-50" }
];

const COURSE_SYLLABI = {
    'py': [
        { id: 'py-m1', title: "Module 1: Python Basics", isExpanded: true, lessons: [
            { id: 'py-l1', title: "Introduction to Python", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'py-l2', title: "Installing Python", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'py-l3', title: "Python Syntax", type: "lesson", duration: "20m", completed: false, xp: 50 },
            { id: 'py-l4', title: "Variables & Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'py-l5', title: "Basic Operators", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'py-m2', title: "Module 2: Control Structures", isExpanded: false, lessons: [
            { id: 'py-l6', title: "If–Else Statements", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'py-l7', title: "For Loops", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'py-l8', title: "While Loops", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'py-l9', title: "Break and Continue", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'py-m3', title: "Module 3: Functions & Modules", isExpanded: false, lessons: [
            { id: 'py-l10', title: "Defining Functions", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'py-l11', title: "Arguments & Return Values", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'py-l12', title: "Lambda Functions", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'py-l13', title: "Importing Modules", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'py-m4', title: "Module 4: Data Structures", isExpanded: false, lessons: [
            { id: 'py-l14', title: "Lists & List Comprehensions", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'py-l15', title: "Tuples", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'py-l16', title: "Sets", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'py-l17', title: "Dictionaries", type: "assignment", duration: "45m", completed: false, xp: 250 }
        ]},
        { id: 'py-m5', title: "Module 5: Advanced Concepts", isExpanded: false, lessons: [
            { id: 'py-l18', title: "File Handling", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'py-l19', title: "Exception Handling (try/except)", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'py-l20', title: "OOP Basics (Classes & Objects)", type: "assignment", duration: "30m", completed: false, xp: 200 }
        ]}
    ],
    'js': [
        { id: 'js-m1', title: "Module 1: JS Basics", isExpanded: true, lessons: [
            { id: 'js-l1', title: "Intro to JS", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'js-l2', title: "Variables (var, let, const)", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'js-l3', title: "Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'js-l4', title: "Basic Operators", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'js-m2', title: "Module 2: Control Flow", isExpanded: false, lessons: [
            { id: 'js-l5', title: "If–Else & Switch", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'js-l6', title: "For Loops", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'js-l7', title: "While Loops", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'js-l8', title: "Loop Iteration Tasks", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'js-m3', title: "Module 3: Functions & Objects", isExpanded: false, lessons: [
            { id: 'js-l9', title: "Function Declarations", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'js-l10', title: "Arrow Functions", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'js-l11', title: "Object Literals", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'js-l12', title: "Arrays & Array Methods", type: "assignment", duration: "35m", completed: false, xp: 200 }
        ]},
        { id: 'js-m4', title: "Module 4: DOM Manipulation", isExpanded: false, lessons: [
            { id: 'js-l13', title: "Selecting Elements", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'js-l14', title: "Modifying the DOM", type: "lesson", duration: "25m", completed: false, xp: 100 },
            { id: 'js-l15', title: "Event Listeners", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'js-l16', title: "Event Delegation", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'js-m5', title: "Module 5: Async JS", isExpanded: false, lessons: [
            { id: 'js-l17', title: "Callbacks & Promises", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'js-l18', title: "Async / Await", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'js-l19', title: "Fetch API", type: "assignment", duration: "40m", completed: false, xp: 250 }
        ]}
    ],
    'java': [
        { id: 'java-m1', title: "Module 1: Java Fundamentals", isExpanded: true, lessons: [
            { id: 'java-l1', title: "Intro to the JVM", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'java-l2', title: "Variables & Primitive Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'java-l3', title: "Operators", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'java-l4', title: "Type Casting", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'java-m2', title: "Module 2: Flow Control", isExpanded: false, lessons: [
            { id: 'java-l5', title: "Conditional Statements", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'java-l6', title: "Switch Case", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'java-l7', title: "Loops (For, While, Do-While)", type: "lesson", duration: "25m", completed: false, xp: 75 },
            { id: 'java-l8', title: "Pattern Printing", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'java-m3', title: "Module 3: Object-Oriented Java", isExpanded: false, lessons: [
            { id: 'java-l9', title: "Classes & Objects", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'java-l10', title: "Constructors & This Keyword", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'java-l11', title: "Inheritance & Polymorphism", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'java-l12', title: "Encapsulation & Abstraction", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'java-m4', title: "Module 4: Advanced Concepts", isExpanded: false, lessons: [
            { id: 'java-l13', title: "Arrays & Strings", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'java-l14', title: "Exception Handling", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'java-l15', title: "Java Collections Framework", type: "lesson", duration: "30m", completed: false, xp: 150 },
            { id: 'java-l16', title: "ArrayList & HashMap", type: "assignment", duration: "40m", completed: false, xp: 250 }
        ]}
    ],
    'c': [
        { id: 'c-m1', title: "Module 1: C Basics", isExpanded: true, lessons: [
            { id: 'c-l1', title: "Introduction to C", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'c-l2', title: "Structure of C Program", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'c-l3', title: "Variables & Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'c-l4', title: "I/O (printf & scanf)", type: "assignment", duration: "15m", completed: false, xp: 100 }
        ]},
        { id: 'c-m2', title: "Module 2: Control Flow", isExpanded: false, lessons: [
            { id: 'c-l5', title: "If–Else Statements", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'c-l6', title: "Switch Case", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'c-l7', title: "Loops (For, While, Do-While)", type: "lesson", duration: "25m", completed: false, xp: 75 },
            { id: 'c-l8', title: "Control Flow Logic", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'c-m3', title: "Module 3: Functions & Arrays", isExpanded: false, lessons: [
            { id: 'c-l9', title: "Functions & Scope", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'c-l10', title: "Recursion", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'c-l11', title: "1D & 2D Arrays", type: "lesson", duration: "25m", completed: false, xp: 100 },
            { id: 'c-l12', title: "String Handling", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'c-m4', title: "Module 4: Pointers & Memory", isExpanded: false, lessons: [
            { id: 'c-l13', title: "Pointer Basics", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'c-l14', title: "Pointers and Arrays", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'c-l15', title: "Dynamic Memory (malloc/free)", type: "lesson", duration: "25m", completed: false, xp: 200 },
            { id: 'c-l16', title: "Structures (struct)", type: "assignment", duration: "45m", completed: false, xp: 300 }
        ]}
    ],
    'cpp': [
        { id: 'cpp-m1', title: "Module 1: Getting Started", isExpanded: true, lessons: [
            { id: 'cpp-l1', title: "Intro to C++ & I/O Streams", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cpp-l2', title: "Variables & Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cpp-l3', title: "Operators & Expressions", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cpp-l4', title: "Namespaces", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'cpp-m2', title: "Module 2: Flow & Functions", isExpanded: false, lessons: [
            { id: 'cpp-l5', title: "Control Structures", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'cpp-l6', title: "Loops", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'cpp-l7', title: "Functions & Overloading", type: "lesson", duration: "25m", completed: false, xp: 100 },
            { id: 'cpp-l8', title: "Pass by Value vs Reference", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'cpp-m3', title: "Module 3: Object-Oriented C++", isExpanded: false, lessons: [
            { id: 'cpp-l9', title: "Classes & Objects", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'cpp-l10', title: "Constructors & Destructors", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'cpp-l11', title: "Inheritance & Polymorphism", type: "lesson", duration: "30m", completed: false, xp: 150 },
            { id: 'cpp-l12', title: "Virtual Functions", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'cpp-m4', title: "Module 4: Advanced & STL", isExpanded: false, lessons: [
            { id: 'cpp-l13', title: "Pointers & Memory Management", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'cpp-l14', title: "Intro to STL (Vectors, Maps)", type: "lesson", duration: "30m", completed: false, xp: 200 },
            { id: 'cpp-l15', title: "Exception Handling", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'cpp-l16', title: "STL Implementation Task", type: "assignment", duration: "45m", completed: false, xp: 250 }
        ]}
    ],
    'go': [
        { id: 'go-m1', title: "Module 1: Go Fundamentals", isExpanded: true, lessons: [
            { id: 'go-l1', title: "Introduction to Go", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'go-l2', title: "Packages & Imports", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'go-l3', title: "Variables & Constants", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'go-l4', title: "Basic Data Types", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'go-m2', title: "Module 2: Flow & Functions", isExpanded: false, lessons: [
            { id: 'go-l5', title: "If/Else & Switch", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'go-l6', title: "For Loops (The only loop)", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'go-l7', title: "Functions & Multiple Returns", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'go-l8', title: "Defer, Panic, and Recover", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'go-m3', title: "Module 3: Data Structures", isExpanded: false, lessons: [
            { id: 'go-l9', title: "Arrays & Slices", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'go-l10', title: "Maps", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'go-l11', title: "Structs & Methods", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'go-l12', title: "Interfaces", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'go-m4', title: "Module 4: Concurrency", isExpanded: false, lessons: [
            { id: 'go-l13', title: "Goroutines", type: "lesson", duration: "25m", completed: false, xp: 200 },
            { id: 'go-l14', title: "Channels", type: "lesson", duration: "25m", completed: false, xp: 200 },
            { id: 'go-l15', title: "Select Statement", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'go-l16', title: "Concurrent Worker Pool", type: "assignment", duration: "50m", completed: false, xp: 300 }
        ]}
    ],
    'rs': [
        { id: 'rs-m1', title: "Module 1: Rust Foundations", isExpanded: true, lessons: [
            { id: 'rs-l1', title: "Hello, Cargo!", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'rs-l2', title: "Variables & Mutability", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'rs-l3', title: "Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'rs-l4', title: "Functions & Control Flow", type: "assignment", duration: "20m", completed: false, xp: 100 }
        ]},
        { id: 'rs-m2', title: "Module 2: Memory & Ownership", isExpanded: false, lessons: [
            { id: 'rs-l5', title: "Understanding Ownership", type: "lesson", duration: "30m", completed: false, xp: 150 },
            { id: 'rs-l6', title: "References & Borrowing", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'rs-l7', title: "The Slice Type", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'rs-l8', title: "Ownership Challenges", type: "assignment", duration: "40m", completed: false, xp: 200 }
        ]},
        { id: 'rs-m3', title: "Module 3: Structs & Enums", isExpanded: false, lessons: [
            { id: 'rs-l9', title: "Defining & Instantiating Structs", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'rs-l10', title: "Enums & Pattern Matching", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'rs-l11', title: "The Option Enum", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'rs-l12', title: "Match Control Flow", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'rs-m4', title: "Module 4: Advanced Features", isExpanded: false, lessons: [
            { id: 'rs-l13', title: "Error Handling (Result)", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'rs-l14', title: "Generic Types & Traits", type: "lesson", duration: "30m", completed: false, xp: 200 },
            { id: 'rs-l15', title: "Lifetimes", type: "lesson", duration: "25m", completed: false, xp: 200 },
            { id: 'rs-l16', title: "Building a CLI Tool", type: "assignment", duration: "60m", completed: false, xp: 350 }
        ]}
    ],
    'ts': [
        { id: 'ts-m1', title: "Module 1: TS Fundamentals", isExpanded: true, lessons: [
            { id: 'ts-l1', title: "Why TypeScript?", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'ts-l2', title: "Basic Types & Inferences", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'ts-l3', title: "Arrays & Tuples", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'ts-l4', title: "Any, Unknown, Never", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'ts-m2', title: "Module 2: Custom Types", isExpanded: false, lessons: [
            { id: 'ts-l5', title: "Type Aliases", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'ts-l6', title: "Interfaces vs Types", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'ts-l7', title: "Union & Intersection Types", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'ts-l8', title: "Typing Functions", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'ts-m3', title: "Module 3: Classes & Generics", isExpanded: false, lessons: [
            { id: 'ts-l9', title: "Classes & Access Modifiers", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'ts-l10', title: "Implementing Interfaces", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'ts-l11', title: "Introduction to Generics", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'ts-l12', title: "Generic Functions", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'ts-m4', title: "Module 4: Advanced Patterns", isExpanded: false, lessons: [
            { id: 'ts-l13', title: "Type Assertions & Casting", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'ts-l14', title: "Utility Types (Partial, Pick)", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'ts-l15', title: "Decorators Overview", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'ts-l16', title: "Typed API Service", type: "assignment", duration: "45m", completed: false, xp: 250 }
        ]}
    ],
    'cs': [
        { id: 'cs-m1', title: "Module 1: C# & .NET Basics", isExpanded: true, lessons: [
            { id: 'cs-l1', title: "Intro to C# and .NET", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cs-l2', title: "Variables & Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cs-l3', title: "Console I/O & Formatting", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'cs-l4', title: "Basic Syntax", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'cs-m2', title: "Module 2: Flow Control", isExpanded: false, lessons: [
            { id: 'cs-l5', title: "If/Else & Switch", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'cs-l6', title: "Loops (For, Foreach, While)", type: "lesson", duration: "25m", completed: false, xp: 75 },
            { id: 'cs-l7', title: "Methods & Parameters", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'cs-l8', title: "Building a Calculator", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'cs-m3', title: "Module 3: Object-Oriented C#", isExpanded: false, lessons: [
            { id: 'cs-l9', title: "Classes & Properties", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'cs-l10', title: "Constructors & Namespaces", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'cs-l11', title: "Inheritance & Interfaces", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'cs-l12', title: "OOP Principles", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'cs-m4', title: "Module 4: Advanced C#", isExpanded: false, lessons: [
            { id: 'cs-l13', title: "Lists & Collections", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'cs-l14', title: "Exception Handling", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'cs-l15', title: "LINQ Basics", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'cs-l16', title: "Async/Await Tasks", type: "assignment", duration: "45m", completed: false, xp: 250 }
        ]}
    ],
    'rb': [
        { id: 'rb-m1', title: "Module 1: Ruby Basics", isExpanded: true, lessons: [
            { id: 'rb-l1', title: "Introduction to Ruby", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'rb-l2', title: "Variables & Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'rb-l3', title: "Strings & Interpolation", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'rb-l4', title: "Ruby Syntax", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'rb-m2', title: "Module 2: Flow & Methods", isExpanded: false, lessons: [
            { id: 'rb-l5', title: "If, Unless, and Case", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'rb-l6', title: "Loops & Iterators", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'rb-l7', title: "Defining Methods", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'rb-l8', title: "Method Arguments", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'rb-m3', title: "Module 3: Data Structures", isExpanded: false, lessons: [
            { id: 'rb-l9', title: "Arrays", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'rb-l10', title: "Hashes", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'rb-l11', title: "Blocks, Procs & Lambdas", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'rb-l12', title: "Enumerables", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'rb-m4', title: "Module 4: Object-Oriented Ruby", isExpanded: false, lessons: [
            { id: 'rb-l13', title: "Classes & Instances", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'rb-l14', title: "Instance Variables & Accessors", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'rb-l15', title: "Inheritance & Modules", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'rb-l16', title: "Building a Class Structure", type: "assignment", duration: "40m", completed: false, xp: 250 }
        ]}
    ],
    'php': [
        { id: 'php-m1', title: "Module 1: PHP Basics", isExpanded: true, lessons: [
            { id: 'php-l1', title: "What is PHP?", type: "lesson", duration: "10m", completed: false, xp: 50 },
            { id: 'php-l2', title: "Syntax & Variables", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'php-l3', title: "Data Types & Constants", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'php-l4', title: "Operators", type: "assignment", duration: "10m", completed: false, xp: 100 }
        ]},
        { id: 'php-m2', title: "Module 2: Control Flow", isExpanded: false, lessons: [
            { id: 'php-l5', title: "If/Else & Switch", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'php-l6', title: "While & For Loops", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'php-l7', title: "Foreach Loops", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'php-l8', title: "Custom Functions", type: "assignment", duration: "30m", completed: false, xp: 150 }
        ]},
        { id: 'php-m3', title: "Module 3: Advanced Concepts", isExpanded: false, lessons: [
            { id: 'php-l9', title: "Arrays & Superglobals", type: "lesson", duration: "25m", completed: false, xp: 120 },
            { id: 'php-l10', title: "Forms Handling (GET/POST)", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'php-l11', title: "Sessions & Cookies", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'php-l12', title: "Web Security Basics", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'php-m4', title: "Module 4: Database Integration", isExpanded: false, lessons: [
            { id: 'php-l13', title: "Intro to MySQL", type: "lesson", duration: "20m", completed: false, xp: 100 },
            { id: 'php-l14', title: "Connecting with PDO", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'php-l15', title: "Prepared Statements", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'php-l16', title: "Build a Login System", type: "assignment", duration: "50m", completed: false, xp: 300 }
        ]}
    ],
    'sw': [
        { id: 'sw-m1', title: "Module 1: Swift Basics", isExpanded: true, lessons: [
            { id: 'sw-l1', title: "Intro to Swift & Playgrounds", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'sw-l2', title: "Variables (var & let)", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'sw-l3', title: "Basic Data Types", type: "lesson", duration: "15m", completed: false, xp: 50 },
            { id: 'sw-l4', title: "Optionals", type: "assignment", duration: "15m", completed: false, xp: 120 }
        ]},
        { id: 'sw-m2', title: "Module 2: Flow & Functions", isExpanded: false, lessons: [
            { id: 'sw-l5', title: "Control Flow (If/Guard)", type: "lesson", duration: "20m", completed: false, xp: 75 },
            { id: 'sw-l6', title: "Switch Statements", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'sw-l7', title: "Loops (For-In, While)", type: "lesson", duration: "15m", completed: false, xp: 75 },
            { id: 'sw-l8', title: "Functions & Closures", type: "assignment", duration: "35m", completed: false, xp: 150 }
        ]},
        { id: 'sw-m3', title: "Module 3: Collections", isExpanded: false, lessons: [
            { id: 'sw-l9', title: "Arrays", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'sw-l10', title: "Dictionaries", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'sw-l11', title: "Sets", type: "lesson", duration: "15m", completed: false, xp: 100 },
            { id: 'sw-l12', title: "Collection Manipulation", type: "assignment", duration: "15m", completed: false, xp: 150 }
        ]},
        { id: 'sw-m4', title: "Module 4: Object-Oriented Swift", isExpanded: false, lessons: [
            { id: 'sw-l13', title: "Classes vs Structs", type: "lesson", duration: "20m", completed: false, xp: 150 },
            { id: 'sw-l14', title: "Properties & Methods", type: "lesson", duration: "20m", completed: false, xp: 120 },
            { id: 'sw-l15', title: "Protocols & Extensions", type: "lesson", duration: "25m", completed: false, xp: 150 },
            { id: 'sw-l16', title: "Build a Data Model", type: "assignment", duration: "45m", completed: false, xp: 250 }
        ]}
    ]
};

// 2. COMPONENT LOGIC

const CourseProgress = () => {
    const { user } = useAuth(); // Import from AuthContext

    // --- Global & UI States ---
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseData, setCourseData] = useState([]); 
    const [activeLesson, setActiveLesson] = useState(null);
    
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
    const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Interactive Feature States ---
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState({}); 
    const [bookmarks, setBookmarks] = useState(new Set()); 
    const [codeContent, setCodeContent] = useState(""); 
    const [quizSelection, setQuizSelection] = useState(null);

    // --- API: Load Catalog ---
    useEffect(() => {
        setTimeout(() => {
            setCourses(POPULAR_LANGUAGES);
            setIsLoadingCatalog(false);
        }, 800);
    }, []);

    // --- FETCH USER PROGRESS FROM SUPABASE ---
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user || !selectedCourse) return;

            const { data, error } = await supabase
                .from('user_progress')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('course_id', selectedCourse.id)
                .eq('completed', true);

            if (error) {
                console.error("Error fetching progress:", error);
                return;
            }

            if (data && data.length > 0) {
                const completedLessonIds = new Set(data.map(p => p.lesson_id));
                
                setCourseData(prev => prev.map(module => ({
                    ...module,
                    lessons: module.lessons.map(lesson => ({
                        ...lesson,
                        completed: completedLessonIds.has(lesson.id) ? true : lesson.completed
                    }))
                })));
            }
        };

        fetchProgress();
    }, [user, selectedCourse]);

    // --- Action: Open Course & Load Syllabus ---
    const handleOpenCourse = async (course) => {
        setIsGeneratingSyllabus(true);
        setSelectedCourse(course);
        setCourseData([]);
        setActiveLesson(null);
        
        // Simulate API loading the syllabus structure
        setTimeout(() => {
            const syllabus = COURSE_SYLLABI[course.id] || [];
            setCourseData(syllabus);
            setIsGeneratingSyllabus(false);
            
            if (syllabus.length > 0 && syllabus[0].lessons.length > 0) {
                handleSelectLesson(syllabus[0].lessons[0]);
            }
        }, 1200);
    };

    // --- Action: Select Topic & Generate Dynamic Content ---
    const handleSelectLesson = async (lesson) => {
        setActiveLesson(lesson);
        setIsSidebarOpen(false); 
        setQuizSelection(null);
        setIsNotesOpen(false);
        
        if (lesson.contentGenerated) {
            if (lesson.type === 'assignment') setCodeContent(lesson.codePrompt || "");
            return;
        }

        setIsGeneratingContent(true);
        
        // Simulate AI generating rich content specifically for this lesson
        setTimeout(() => {
            let generatedData = { contentGenerated: true };

            if (lesson.type === 'lesson' || lesson.type === 'video') {
                generatedData.textContent = `
### Deep Dive: ${lesson.title}

Welcome to this comprehensive, in-depth guide on **${lesson.title}** within the context of ${selectedCourse.name}. Mastering this concept is an absolute necessity for writing professional, scalable, and maintainable software. In this lesson, we will cover the theoretical foundations, practical implementations, and industry best practices.

#### Introduction to the Concept
In software engineering, understanding ${lesson.title.toLowerCase()} is crucial because it dictates how we structure our logic and handle data flow. Whether you are building high-frequency trading systems, massive web applications, or simple automation scripts in ${selectedCourse.name}, these principles remain universally applicable. 

When developers first learn ${selectedCourse.name}, they often overlook the nuances of ${lesson.title.toLowerCase()}. However, taking the time to deeply understand how the compiler/interpreter handles these operations under the hood will save you countless hours of debugging down the line.

#### Why Does This Matter?
To truly appreciate ${lesson.title}, let's look at what happens when you *don't* use it correctly:
* **Performance Bottlenecks:** Poorly structured logic can lead to exponential time complexity (O(n^2) or worse), causing your application to freeze under heavy loads.
* **Memory Leaks:** Improper resource management often results in applications consuming unbounded amounts of RAM until they eventually crash.
* **Spaghetti Code:** Without the structured approach provided by ${lesson.title.toLowerCase()}, codebases quickly become unreadable, making team collaboration nearly impossible.

#### Mechanics and Syntax
Let's look at the foundational syntax in ${selectedCourse.name}. Notice how the language design prioritizes clarity and explicitness.

\`\`\`${selectedCourse.id}
// Basic Implementation of ${lesson.title}
// Note: This is a foundational example meant for understanding the syntax.

function basicExample(data) {
    // Initialization
    let result = null;
    
    // Processing core logic related to ${lesson.title}
    if (data && data.isValid) {
        result = processData(data);
        console.log("Processing successful:", result);
    } else {
        console.warn("Invalid data encountered.");
    }
    
    return result;
}
\`\`\`

#### Advanced Implementation & Best Practices
In a production environment, a simple implementation is rarely enough. Senior engineers focus on edge cases, error handling, and type safety (where applicable). Let's refactor the basic concept into a robust, enterprise-ready pattern.

\`\`\`${selectedCourse.id}
// Enterprise-grade implementation pattern for: ${lesson.title}

class SystemProcessor {
    constructor(config) {
        this.config = config;
        this.logger = new Logger();
    }

    /**
     * Safely executes the core logic handling edge cases.
     * @param {Object} inputData - The raw payload.
     */
    executeCoreLogic(inputData) {
        // 1. Validation phase (Fail fast)
        if (!this.isValidPayload(inputData)) {
            this.logger.error("Validation failed for input.");
            throw new Error("Missing or malformed required input data");
        }
        
        try {
            // 2. Transformation phase
            const processed = this.transformData(inputData);
            
            // 3. Execution & formatting phase
            return this.finalizeProcess(processed);
        } catch (error) {
            // Graceful error degradation
            this.logger.error("Execution failed", error);
            return this.getFallbackState();
        }
    }
    
    isValidPayload(payload) {
        return payload !== null && typeof payload === 'object';
    }
}
\`\`\`

#### Common Pitfalls
As you practice ${lesson.title}, watch out for these common mistakes:
* **Ignoring Edge Cases:** Always ask yourself, "What happens if the input is null? What if it's an empty array? What if the network fails?"
* **Over-engineering:** Don't build a massive abstraction if a simple function will suffice. Keep it simple until complexity is warranted (KISS principle).
* **Forgetting to Clean Up:** If this operation opens a file, a network connection, or allocates heavy memory, ensure you have a mechanism to release those resources.

#### Next Steps
Review the code snippets above. Copy them into your local environment and try modifying the inputs. Once you feel comfortable with how **${lesson.title}** behaves in ${selectedCourse.name}, mark this lesson as complete to claim your XP and move on to the practical assignment!
                `;
            } else if (lesson.type === 'assignment') {
                generatedData.codePrompt = `// Assignment: ${lesson.title}\n// Language: ${selectedCourse.name}\n// Task: Complete the logic below to satisfy the requirements.\n\nfunction solution() {\n    // Write your code here\n    \n}\n\n// Run your test\nsolution();`;
                setCodeContent(generatedData.codePrompt);
            } else if (lesson.type === 'quiz') {
                generatedData.quizData = {
                    question: `Regarding "${lesson.title}", which of the following represents an industry best practice?`,
                    options: [
                        "Optimizing for fewest lines of code over readability.",
                        "Hardcoding values to improve compilation speed.",
                        "Validating inputs and keeping functions single-purpose.",
                        "Avoiding comments entirely to save file space."
                    ],
                    answerIndex: 2
                };
            }

            setActiveLesson(prev => ({ ...prev, ...generatedData }));
            setCourseData(prev => prev.map(m => ({
                ...m, lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, ...generatedData } : l)
            })));
            setIsGeneratingContent(false);
        }, 1800);
    };

    // --- General Actions ---
    const toggleModule = (moduleId) => setCourseData(prev => prev.map(m => m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m));
    
    const toggleBookmark = (lessonId) => {
        setBookmarks(prev => {
            const newBookmarks = new Set(prev);
            newBookmarks.has(lessonId) ? newBookmarks.delete(lessonId) : newBookmarks.add(lessonId);
            return newBookmarks;
        });
    };

    const handleCompleteLesson = async () => {
        if (activeLesson.type === 'quiz') {
            if (quizSelection === null) return alert("Please select an answer.");
            if (quizSelection !== activeLesson.quizData.answerIndex) return alert("Incorrect answer. Review the material and try again.");
        }
        if (activeLesson.type === 'assignment') {
            console.log(`Executing ${selectedCourse.id} Code:`, codeContent);
        }
        
        // --- SAVE TO SUPABASE ---
      if (user) {
            const { error } = await supabase
                .from('user_progress')
                .upsert({ 
                    user_id: user.id, 
                    course_id: selectedCourse.id, 
                    lesson_id: activeLesson.id, 
                    completed: true,
                    xp_earned: activeLesson.xp,
                    updated_at: new Date()
                }, { onConflict: 'user_id, lesson_id' });

            if (error) {
                console.error("Error saving progress:", error);
                // 👇 Change this alert so it prints the exact error!
                alert(`Could not sync progress: ${error.message}`);
                return;
            }
        }

        setCourseData(prev => prev.map(m => ({
            ...m, lessons: m.lessons.map(l => l.id === activeLesson.id ? { ...l, completed: true } : l)
        })));
        setActiveLesson(prev => ({ ...prev, completed: true }));
        alert(`Awesome job! +${activeLesson.xp} XP earned.`);
    };

    // --- NEW SMARTER RENDER PARSER ---
    const renderContent = (text) => {
        if (!text) return null;
        
        // Split text by code blocks first to protect formatting inside the block
        const sections = text.split(/(```[\s\S]*?```)/g);
        
        return sections.map((section, index) => {
            // Handle Code Blocks
            if (section.startsWith('```')) {
                // Remove the ```lang and the ending ```
                const codeContent = section.replace(/```.*\n/, '').replace(/```$/, '');
                return (
                    <div key={index} className="bg-[#0D1117] rounded-xl overflow-hidden shadow-lg my-6 border border-slate-800">
                        <div className="bg-[#161B22] px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <pre className="p-5 overflow-x-auto">
                            <code className="text-sm font-mono text-emerald-400 whitespace-pre">{codeContent}</code>
                        </pre>
                    </div>
                );
            }
            
            // Handle regular text paragraphs, headings, and lists
            const blocks = section.split('\n\n').filter(b => b.trim() !== '');
            return blocks.map((block, bIndex) => {
                const key = `${index}-${bIndex}`;
                const trimmedBlock = block.trim();
                
                if (trimmedBlock.startsWith('### ')) {
                    return <h3 key={key} className="text-2xl font-extrabold text-gray-900 mt-8 mb-4">{trimmedBlock.replace('### ', '')}</h3>;
                }
                if (trimmedBlock.startsWith('#### ')) {
                    return <h4 key={key} className="text-xl font-bold text-gray-800 mt-6 mb-3">{trimmedBlock.replace('#### ', '')}</h4>;
                }
                if (trimmedBlock.startsWith('* ')) {
                     const listItems = trimmedBlock.split('\n').filter(line => line.trim().startsWith('* '));
                     return (
                         <ul key={key} className="list-disc pl-6 space-y-2 my-4 text-gray-600">
                             {listItems.map((item, i) => {
                                 const content = item.replace(/^\* /, '');
                                 const parts = content.split('**');
                                 if(parts.length > 2) return <li key={i}><span className="font-bold text-gray-800">{parts[1]}</span>{parts[2]}</li>;
                                 return <li key={i}>{content}</li>;
                             })}
                         </ul>
                     )
                }
                
                // Bold parser for regular paragraphs
                const boldParsed = trimmedBlock.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} className="text-gray-900">{part}</strong> : part);
                return <p key={key} className="text-gray-600 leading-relaxed text-lg my-4">{boldParsed}</p>;
            });
        });
    };

    const getIcon = (type, completed) => {
        if (completed) return <CheckCircle className="text-green-500 w-4 h-4 shrink-0" />;
        switch(type) {
            case 'quiz': return <HelpCircle className="text-purple-500 w-4 h-4 shrink-0" />;
            case 'assignment': return <Code className="text-orange-500 w-4 h-4 shrink-0" />;
            case 'video': return <Video className="text-blue-500 w-4 h-4 shrink-0" />;
            default: return <BookOpen className="text-gray-400 w-4 h-4 shrink-0" />;
        }
    };

        // RENDER 1: COURSE LIBRARY
        if (!selectedCourse) {
        return (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900">Explore Technologies</h2>
                    <p className="text-gray-500 mt-1">Select a language to generate your custom AI curriculum.</p>
                </div>

                {isLoadingCatalog ? (
                    <div className="flex flex-col items-center justify-center h-64 text-indigo-600 gap-3">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {courses.map((course) => {
                            const Icon = course.icon;
                            return (
                                <div 
                                    key={course.id} onClick={() => handleOpenCourse(course)}
                                    className="group cursor-pointer border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all bg-white flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl ${course.bg} ${course.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={28} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                            {course.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
                                    <p className="text-sm text-gray-500 mb-6">Start coding instantly with an AI-guided syllabus.</p>
                                    <div className="mt-auto flex items-center justify-between text-indigo-600 font-bold text-sm">
                                        Start Course <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

        // RENDER 2: COURSE PLAYER
        const isBookmarked = activeLesson ? bookmarks.has(activeLesson.id) : false;

    // --- DYNAMIC PROGRESS CALCULATION ---
    const totalLessons = courseData.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessonsCount = courseData.reduce((acc, module) => acc + module.lessons.filter(l => l.completed).length, 0);
    const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessonsCount / totalLessons) * 100);

    return (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-[85vh] min-h-[600px] relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Top Navigation */}
            <div className="bg-slate-900 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0 z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-1.5 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <button onClick={() => setSelectedCourse(null)} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg hover:bg-slate-700">
                        <ChevronLeft size={16} /> Exit
                    </button>
                </div>
                <h2 className="font-extrabold text-sm md:text-base truncate max-w-[200px] md:max-w-md">{selectedCourse.name}</h2>
                <div className="flex items-center gap-2 text-xs font-bold bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
                    <span className="hidden sm:inline">Progress:</span> <span>{progressPercent}%</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* LEFT SIDEBAR: Syllabus */}
                <div className={`absolute lg:relative inset-y-0 left-0 z-10 w-72 bg-[#F8FAFC] border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="p-5 border-b border-slate-200 bg-white sticky top-0 z-10">
                        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-600"/> Syllabus
                        </h3>
                    </div>
                    
                    <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar pb-20">
                        {isGeneratingSyllabus ? (
                            <div className="flex flex-col items-center justify-center p-10 text-indigo-600 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p className="text-sm font-bold text-center text-slate-500">AI is structuring the course...</p>
                            </div>
                        ) : (
                            courseData.map(module => (
                                <div key={module.id} className="mb-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                    <button onClick={() => toggleModule(module.id)} className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100 text-left transition-colors">
                                        <span className="text-sm font-extrabold text-slate-800 pr-2">{module.title}</span>
                                        {module.isExpanded ? <ChevronDown size={16} className="text-slate-400 shrink-0"/> : <ChevronRight size={16} className="text-slate-400 shrink-0"/>}
                                    </button>
                                    
                                    {module.isExpanded && (
                                        <div className="p-2 space-y-1 bg-white">
                                            {module.lessons.map(lesson => {
                                                const isActive = activeLesson?.id === lesson.id;
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleSelectLesson(lesson)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all text-left group
                                                            ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}
                                                        `}
                                                    >
                                                        {getIcon(lesson.type, lesson.completed)}
                                                        <span className="truncate group-hover:text-slate-900 transition-colors">{lesson.title}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && <div className="absolute inset-0 bg-slate-900/50 z-0 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

                {/* RIGHT AREA: Interactive Content Viewer */}
                <div className="flex-1 flex flex-col bg-white overflow-y-auto relative w-full custom-scrollbar">
                    {isGeneratingContent ? (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-600 gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
                                <Cpu className="w-12 h-12 animate-pulse relative z-10" />
                            </div>
                            <p className="text-lg font-bold text-slate-600">AI is drafting educational content...</p>
                        </div>
                    ) : activeLesson ? (
                        <div className="p-5 md:p-10 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                            
                            {/* Content Toolbar */}
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                                    {activeLesson.type}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsNotesOpen(!isNotesOpen)} className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors ${isNotesOpen ? 'bg-amber-100 text-amber-700' : 'text-slate-600 bg-slate-50 hover:bg-amber-50 hover:text-amber-600'}`}>
                                        <Edit3 size={16} /> <span className="hidden sm:inline">Notes</span>
                                    </button>
                                    <button onClick={() => toggleBookmark(activeLesson.id)} className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors ${isBookmarked ? 'text-indigo-600 bg-indigo-50 border border-indigo-100' : 'text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                                        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} /> 
                                        <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Floating Notes */}
                            {isNotesOpen && (
                                <div className="mb-8 bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-4">
                                    <h4 className="text-amber-800 font-extrabold mb-3 flex items-center gap-2"><Edit3 size={18}/> My Study Notes</h4>
                                    <textarea 
                                        className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[120px] shadow-inner"
                                        placeholder={`Type your notes for ${activeLesson.title}...`}
                                        value={notes[activeLesson.id] || ""}
                                        onChange={(e) => setNotes({...notes, [activeLesson.id]: e.target.value})}
                                    ></textarea>
                                </div>
                            )}

                            {/* Main Title & XP */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{activeLesson.title}</h1>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-extrabold border border-yellow-200 shadow-sm shrink-0">
                                    <Trophy size={16} className="text-amber-500" /> +{activeLesson.xp} XP
                                </div>
                            </div>

                            {/* --- DYNAMIC CONTENT BLOCKS --- */}
                            
                            {/* 1. Theory / Video Text */}
                            {(activeLesson.type === 'lesson' || activeLesson.type === 'video') && (
                                <div className="max-w-none mb-10">
                                    {renderContent(activeLesson.textContent)}
                                    
                                    {activeLesson.type === 'video' && (
                                        <div className="mt-10 w-full aspect-video bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-white relative group cursor-pointer overflow-hidden shadow-2xl border border-slate-800">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 to-slate-900/80"></div>
                                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-10 hover:bg-white/30 transition-all border border-white/30 hover:scale-110">
                                                <Play size={40} fill="white" className="ml-2 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. Quiz Block */}
                            {activeLesson.type === 'quiz' && activeLesson.quizData && (
                                <div className="bg-indigo-50/50 rounded-3xl p-6 md:p-8 border border-indigo-100 mb-8 shadow-sm">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex gap-3">
                                        <span className="text-indigo-600">Q.</span> {activeLesson.quizData.question}
                                    </h3>
                                    <div className="space-y-4">
                                        {activeLesson.quizData.options.map((option, idx) => (
                                            <label key={idx} className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all bg-white
                                                ${quizSelection === idx ? 'border-indigo-500 shadow-md shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'}
                                            `}>
                                                <input 
                                                    type="radio" name="quiz" 
                                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-600 border-slate-300"
                                                    checked={quizSelection === idx}
                                                    onChange={() => setQuizSelection(idx)}
                                                />
                                                <span className={`ml-4 text-lg font-medium ${quizSelection === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Code Editor Block */}
                            {activeLesson.type === 'assignment' && (
                                <div className="bg-[#0D1117] rounded-3xl overflow-hidden shadow-2xl mb-8 border border-slate-800">
                                    <div className="bg-[#161B22] px-5 py-4 flex justify-between items-center border-b border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <span className="text-slate-400 text-xs font-mono font-bold tracking-wider ml-2">main.{selectedCourse.id}</span>
                                        </div>
                                        <button onClick={() => setCodeContent(activeLesson.codePrompt)} className="text-xs font-bold bg-slate-800 text-slate-300 px-4 py-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                                            Reset Context
                                        </button>
                                    </div>
                                    <textarea 
                                        value={codeContent}
                                        onChange={(e) => setCodeContent(e.target.value)}
                                        className="w-full bg-transparent p-6 font-mono text-[15px] text-emerald-400 min-h-[350px] focus:outline-none resize-y leading-relaxed"
                                        spellCheck="false"
                                    />
                                </div>
                            )}

                            {/* Footer Action */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                                <button 
                                    onClick={handleCompleteLesson}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-extrabold transition-all shadow-lg hover:-translate-y-1
                                        ${activeLesson.completed ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-none hover:translate-y-0' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50'}
                                    `}
                                >
                                    {activeLesson.completed ? (
                                        <>Completed <CheckCircle size={22} strokeWidth={3} /></>
                                    ) : activeLesson.type === 'assignment' ? (
                                        <>Run & Submit Code <Send size={20} /></>
                                    ) : activeLesson.type === 'quiz' ? (
                                        <>Submit Answer <Check size={22} strokeWidth={3} /></>
                                    ) : (
                                        <>Mark as Complete <CheckCircle size={20} /></>
                                    )}
                                </button>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;