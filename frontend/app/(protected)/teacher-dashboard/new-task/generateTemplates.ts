import {Task} from "@/app/(protected)/teacher-dashboard/new-task/page";

export const generateTemplates = (task: Task): Task => {
    const {name, params, return_type, return_element_type} = task.function_signature;

    if (!name) {
        throw new Error("Function name is required");
    }

    if (params.length === 0) {
        throw new Error("Najpierw dodaj przynajmniej jeden parametr funkcji");
    }

    // ------------------------------------------------------
    // PARAMS PREPROCESSING
    // ------------------------------------------------------

    let allParams: any[] = [];
    params.forEach((param) => {
        allParams.push(param);

        if (param.type === 'array' && param.size_param) {
            const sizeExists = allParams.some(p => p.name === param.size_param);
            if (!sizeExists) {
                allParams.push({
                    name: param.size_param,
                    type: 'int'
                });
            }
        }
    });

    const arrayParam = allParams.find(p => p.type === 'array');
    const sizeParam = arrayParam ? allParams.find(p => p.name === arrayParam.size_param) : null;
    const isVoid = return_type === 'void';
    const isReturningArray = return_type === 'array';

    // ------------------------------------------------------
    // STUDENT CODE (templates)
    // ------------------------------------------------------

    // --------- C++ ---------
    const cppParams = allParams.map(p =>
        p.type === 'array'
            ? `${getCppType(p.element_type)} ${p.name}[]`
            : `${getCppType(p.type)} ${p.name}`
    ).join(', ');

    let cppReturnType = 'void';
    if (isReturningArray) {
        cppReturnType = `vector<${getCppType(return_element_type || 'int')}>`;
    } else if (!isVoid) {
        cppReturnType = getCppType(return_type);
    }

    let cppFunctionBody = '';
    if (isReturningArray) {
        cppFunctionBody = `\n    return vector<${getCppType(return_element_type || 'int')}>();`;
    } else if (!isVoid) {
        cppFunctionBody = `\n    return ${getDefaultValue(return_type)};`;
    }

    let cppIncludes = '#include <iostream>\n';
    if (arrayParam || isReturningArray) cppIncludes += '#include <vector>\n';
    if (allParams.some(p => p.type === 'string')) cppIncludes += '#include <string>\n';
    cppIncludes += 'using namespace std;\n\n';

    const cppStudentCode = `${cppIncludes}${cppReturnType} ${name}(${cppParams}) {
    // Twoja funkcja${cppFunctionBody}
}`;

    // --------- PYTHON ---------
    const pyParams = allParams
        .filter(p => !(sizeParam && p.name === sizeParam.name))
        .map(p => p.name)
        .join(', ');

    const pyFunctionBody = isVoid ? '' : '\n    pass';

    const pythonStudentCode = `def ${name}(${pyParams}):
    # Twoja funkcja${pyFunctionBody}`;

    // --------- JAVASCRIPT ---------
    const jsParams = allParams
        .filter(p => !(sizeParam && p.name === sizeParam.name))
        .map(p => p.name)
        .join(', ');

    let jsFunctionBody = '';
    if (!isVoid && !isReturningArray) {
        jsFunctionBody = `\n    return ${getDefaultValue(return_type)};`;
    }

    const javascriptStudentCode = `function ${name}(${jsParams}) {
    // Twoja funkcja${jsFunctionBody}
}`;

    // ------------------------------------------------------
    // BOILERPLATES (hidden on FE)
    // ------------------------------------------------------

    // --------- C++ BOILERPLATE ---------
    let cppInput = '';

    if (arrayParam && sizeParam) {
        const regularParams = allParams.filter(p => p.type !== 'array' && p.name !== sizeParam.name);
        cppInput = `    int ${sizeParam.name};
    cin >> ${sizeParam.name};
    vector<${getCppType(arrayParam.element_type)}> ${arrayParam.name}(${sizeParam.name});
    for(int i = 0; i < ${sizeParam.name}; i++) {
        cin >> ${arrayParam.name}[i];
    }`;

        regularParams.forEach(p => {
            cppInput += `\n    ${getCppType(p.type)} ${p.name};
    cin >> ${p.name};`;
        });

    } else {
        const declarations = allParams
            .map(p => `    ${getCppType(p.type)} ${p.name};`)
            .join('\n');

        const cinParams = allParams.map(p => p.name).join(' >> ');

        cppInput = `${declarations}
    cin >> ${cinParams};`;
    }

    const cppCallParams = allParams.map(p =>
        p.type === 'array' ? `${p.name}.data()` : p.name
    ).join(', ');

    let cppOutput = '';
    if (isVoid && arrayParam && sizeParam) {
        cppOutput = `    ${name}(${cppCallParams});
    for(int i = 0; i < ${sizeParam.name}; i++) {
        if(i > 0) cout << " ";
        cout << ${arrayParam.name}[i];
    }
    cout << endl;`;
    } else if (isReturningArray) {
        cppOutput = `    vector<${getCppType(return_element_type || 'int')}> result = ${name}(${cppCallParams});
    for(int i = 0; i < result.size(); i++) {
        if(i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;`;
    } else {
        cppOutput = isVoid
            ? `    ${name}(${cppCallParams});`
            : `    cout << ${name}(${cppCallParams}) << endl;`;
    }

    const cppBoilerplate = `
int main() {
${cppInput}
${cppOutput}
    return 0;
}`;

    // --------- PYTHON BOILERPLATE ---------
    let pyInput = '';
    let pyCallParams = '';

    if (arrayParam && sizeParam) {
        const regularParams = allParams.filter(p => p.type !== 'array' && p.name !== sizeParam.name);
        pyInput = `    ${sizeParam.name} = int(input())
    ${arrayParam.name} = list(map(${getPythonConversion(arrayParam.element_type)}, input().split()))`;

        regularParams.forEach(p => {
            pyInput += `\n    ${p.name} = ${getPythonConversion(p.type)}(input())`;
        });

        pyCallParams = allParams
            .filter(p => p.name !== sizeParam.name)
            .map(p => p.name)
            .join(', ');

    } else {
        const paramNames = allParams.map(p => p.name).join(', ');

        if (allParams.length === 1) {
            pyInput = `    ${allParams[0].name} = ${getPythonConversion(allParams[0].type)}(input())`;

        } else if (allParams.every(p => p.type === 'int' || p.type === 'float')) {
            const conv = allParams[0].type === 'float' ? 'float' : 'int';
            pyInput = `    ${paramNames} = map(${conv}, input().split())`;

        } else {
            pyInput = `    values = input().split()`;
            allParams.forEach((p, i) => {
                pyInput += `\n    ${p.name} = ${getPythonConversion(p.type)}(values[${i}])`;
            });
        }

        pyCallParams = paramNames;
    }

    let pyOutput = '';

    if (isVoid && arrayParam) {
        pyOutput = `    ${name}(${pyCallParams})
    print(' '.join(map(str, ${arrayParam.name})))`;

    } else if (isReturningArray) {
        pyOutput = `    result = ${name}(${pyCallParams})
    print(' '.join(map(str, result)))`;

    } else {
        pyOutput = `    print(${name}(${pyCallParams}))`;
    }

    const pythonBoilerplate = `
if __name__ == "__main__":
${pyInput}
${pyOutput}`;

    // --------- JAVASCRIPT BOILERPLATE ---------
    let jsParseCode = '';

    if (arrayParam && sizeParam) {
        const regularParams = allParams.filter(p => p.type !== 'array' && p.name !== sizeParam.name);
        const totalLines = 2 + regularParams.length;

        jsParseCode = `const lines = [];
let count = 0;

rl.on('line', (line) => {
    lines.push(line);
    count++;

    if (count === ${totalLines}) {
        const ${sizeParam.name} = parseInt(lines[0]);
        const ${arrayParam.name} = lines[1].split(' ').map(${getJsConversion(arrayParam.element_type)});`;

        regularParams.forEach((p, i) => {
            jsParseCode += `\n        const ${p.name} = ${getJsConversion(p.type)}(lines[${i + 2}]);`;
        });

        const jsCallParams = allParams
            .filter(p => p.name !== sizeParam.name)
            .map(p => p.name)
            .join(', ');

        if (isVoid) {
            jsParseCode += `\n        ${name}(${jsCallParams});
        console.log(${arrayParam.name}.join(' '));`;

        } else if (isReturningArray) {
            jsParseCode += `\n        const result = ${name}(${jsCallParams});
        console.log(result.join(' '));`;

        } else {
            jsParseCode += `\n        console.log(${name}(${jsCallParams}));`;
        }

        jsParseCode += `
        rl.close();
    }
});`;

    } else {
        jsParseCode = `rl.on('line', (input) => {
    const parts = input.split(' ');

${allParams
            .map((p, i) => `    const ${p.name} = ${getJsConversion(p.type)}(parts[${i}]);`)
            .join('\n')}

    ${isReturningArray
            ? `const result = ${name}(${allParams.map(p => p.name).join(', ')});\n    console.log(result.join(' '));`
            : `console.log(${name}(${allParams.map(p => p.name).join(', ')}));`}

    rl.close();
});`;
    }

    const javascriptBoilerplate = `
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
${jsParseCode}`;

    // ------------------------------------------------------
    // RETURN FINAL TASK ✔️
    // ------------------------------------------------------

    return {
        ...task,
        templates: {
            cpp: cppStudentCode,
            python: pythonStudentCode,
            javascript: javascriptStudentCode
        },
        boilerplates: {
            cpp: cppBoilerplate,
            python: pythonBoilerplate,
            javascript: javascriptBoilerplate
        }
    };
};


// ========================================================================
// HELPERS
// ========================================================================

function getCppType(type: string): string {
    const map: Record<string, string> = {
        int: "int",
        float: "float",
        double: "double",
        string: "string",
        bool: "bool",
    };
    return map[type] ?? "int";
}

function getDefaultValue(type: string): string {
    const defaults: Record<string, string> = {
        int: "0",
        float: "0.0",
        double: "0.0",
        string: '""',
        bool: "false",
    };
    return defaults[type] ?? "0";
}

function getPythonConversion(type: string): string {
    const map: Record<string, string> = {
        int: 'int',
        float: 'float',
        string: 'str',
        bool: 'bool'
    };
    return map[type] || 'str';
}

function getJsConversion(type: string): string {
    if (type === 'int' || type === 'float' || type === 'double') return 'Number';
    if (type === 'bool') return 'val => val === "true"';
    return 'val => val';
}
