"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { generateTemplates } from "@/app/(protected)/teacher-dashboard/new-task/generateTemplates";

import { CodePreviewCard } from './components/CodePreviewCard';
import FunctionSignatureCard from "@/app/(protected)/teacher-dashboard/new-task/components/FunctionSignatureCard";
import BasicInfoCard from "@/app/(protected)/teacher-dashboard/new-task/components/BasicInfoCard";
import TestCasesCard from "@/app/(protected)/teacher-dashboard/new-task/components/TestCasesCard";
import {useTaskStore} from "@/store/useTaskStore";

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
    id?:string;
    title: string;
    description: string;
    function_signature: {
        name: string;
        params: FunctionParameter[];
        return_type: string;
        return_element_type: string | null;
    };
    isActive:boolean;
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
    groupIds: string[];
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
        isActive: false,
        groupIds: [],
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

    const {addTask,loading} = useTaskStore()

    const handleGenerateTemplates = () => {
        generateTemplates(task, setTask, setShowCodeBluePrint);
    };

    return (
        <div className="flex flex-col gap-8">
            <BasicInfoCard
                title={task.title}
                description={task.description}
                isActive = {task.isActive}
                groupIds={task.groupIds}

                onTitleChange={(title) => setTask({ ...task, title })}
                onDescriptionChange={(description) => setTask({ ...task, description })}
                onIsActiveChange={(isActive) => setTask({ ...task, isActive })}
                onGroupIdsChange={(groupIds) => setTask({ ...task, groupIds })}
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

            <Button disabled={loading} onClick={() => {
                generateTemplates(task, setTask, setShowCodeBluePrint);
                console.log(task)
                addTask(task)
            }}>Dodaj zadanie</Button>
             {/*TODO: Dodac test i zapis i anuluj
              TODO: Poprawic error handling i sprawdzenie formularza
              */}
        </div>
    );
};

export default Page;