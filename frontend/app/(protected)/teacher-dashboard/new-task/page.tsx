"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { generateTemplates } from "@/app/(protected)/teacher-dashboard/new-task/generateTemplates";

import { CodePreviewCard } from './components/CodePreviewCard';
import FunctionSignatureCard from "@/app/(protected)/teacher-dashboard/new-task/components/FunctionSignatureCard";
import BasicInfoCard from "@/app/(protected)/teacher-dashboard/new-task/components/BasicInfoCard";
import TestCasesCard from "@/app/(protected)/teacher-dashboard/new-task/components/TestCasesCard";

interface FunctionParameter {
    name: string;
    type: string;
    element_type?: string;
    size_param?: string;
    allowSpaces?: boolean;
}

interface TestCase {
    input: string;
    expected_output: string;
}

export type Task = {
    title: string;
    description: string;
    function_signature: {
        name: string;
        params: FunctionParameter[];
        return_type: string;
        return_element_type: string | null;
    };
    test_cases: TestCase[];
    templates: {
        cpp: string;
        python: string;
        javascript: string;
    };
    boilerplates: {
        cpp: string;
        python: string;
        javascript: string;
    }
};

const Page = () => {
    const [task, setTask] = useState<Task>({
        title: '',
        description: '',
        function_signature: {
            name: '',
            params: [],
            return_type: 'int',
            return_element_type: null
        },
        test_cases: [],
        templates: {
            cpp: '',
            python: '',
            javascript: ''
        },
        boilerplates: {
            cpp: '',
            python: '',
            javascript: ''
        }
    });

    const [showCodeBluePrint, setShowCodeBluePrint] = useState(false);

    const handleGenerateTemplates = () => {
        generateTemplates(task, setTask, setShowCodeBluePrint);
    };

    return (
        <div className="flex flex-col gap-8">
            <BasicInfoCard
                title={task.title}
                description={task.description}
                onTitleChange={(title) => setTask({ ...task, title })}
                onDescriptionChange={(description) => setTask({ ...task, description })}
            />

            <FunctionSignatureCard
                functionSignature={task.function_signature}
                onSignatureChange={(function_signature) => setTask({ ...task, function_signature })}
                onGenerateTemplates={handleGenerateTemplates}
            />

            {showCodeBluePrint && (
                <CodePreviewCard
                    templates={task.templates}
                    boilerplates={task.boilerplates}
                    onHide={() => setShowCodeBluePrint(false)}
                />
            )}

            <TestCasesCard
                testCases={task.test_cases}
                functionSignature={task.function_signature}
                onTestCasesChange={(test_cases) => setTask({ ...task, test_cases })}
            />

            <Button onClick={() => console.log(task)}>cwl</Button>
            {/* TODO: Dodac test i zapis i anuluj */}
        </div>
    );
};

export default Page;