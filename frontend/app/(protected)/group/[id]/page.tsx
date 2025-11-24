"use client"
import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {ROLES} from '@/lib/roles';
import {useGroupStore} from "@/store/useGroupStore";
import Loader from "@/components/Loader";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {IdCardIcon, Search, Trash, UserPlus, Users} from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from '@/components/ui/button';
import {Input} from "@/components/ui/input";
import {Checkbox} from '@/components/ui/checkbox';
import {useUsersStore} from "@/store/useUsersStore";

const Page = () => {
    const {authUser} = useAuthStore()
    const {fetchSingleGroup, singleGroup, loading, removeStudentFromGroup, addStudentsToGroup} = useGroupStore()
    const {getUsersWithoutGroup, usersWithoutGroup} = useUsersStore()
    const router = useRouter()

    const [addStudentSearch, setAddStudentSearch] = useState("")
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    if (authUser?.role !== ROLES.TEACHER && authUser?.role !== ROLES.ROOT) {
        router.replace("/home")
        return null;
    }

    const params = useParams();
    const groupId = params.id as string;

    useEffect(() => {
        if (!groupId) return;
        fetchSingleGroup(groupId);
    }, [groupId]);

    useEffect(() => {
        getUsersWithoutGroup();
    }, []);

    const filteredStudents = usersWithoutGroup.filter(student => {
        const searchLower = addStudentSearch.toLowerCase()
        return (
            student?.firstName?.toLowerCase().includes(searchLower) ||
            student?.lastName?.toLowerCase().includes(searchLower) ||
            student.username.toLowerCase().includes(searchLower)
        )
    })

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const handleAddStudents = async () => {
        if (selectedStudentIds.length === 0) return

        await addStudentsToGroup( groupId,selectedStudentIds)

        setSelectedStudentIds([])
        setAddStudentSearch("")
        setIsDialogOpen(false)

        getUsersWithoutGroup()
    }

    const getStudentWord = (count: number) => {
        if (count === 1) return "ucznia"
        if (count >= 2 && count <= 4) return "uczniów"
        return "uczniów"
    }

    if (loading) return <Loader/>

    return (
        <div className="w-full flex justify-center">
            <Card className="shadow-custom mb-8 w-[900px]">
                <CardHeader className="gap-y-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Zarządzanie grupą: {singleGroup?.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-5 h-5"/>
                            <span className="text-2xl font-bold">{singleGroup?.students.length}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Uczniowie w grupie</CardTitle>
                            <CardDescription>Zarządzaj uczniami przypisanymi do tej grupy</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="w-4 h-4 mr-2"/>
                                    Dodaj ucznia
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Dodaj uczniów do grupy</DialogTitle>
                                    <DialogDescription>
                                        Zaznacz uczniów, których chcesz dodać do grupy {singleGroup?.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                        <Input
                                            placeholder="Szukaj ucznia..."
                                            className="pl-10"
                                            value={addStudentSearch}
                                            onChange={(e) => setAddStudentSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                                        {filteredStudents.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                {addStudentSearch
                                                    ? "Nie znaleziono uczniów"
                                                    : "Wszyscy uczniowie mają przydzieloną grupę"}
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {filteredStudents.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                                        onClick={() => toggleStudentSelection(student.id)}
                                                    >
                                                        <Checkbox
                                                            checked={selectedStudentIds.includes(student.id)}
                                                            onCheckedChange={() => toggleStudentSelection(student.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium">
                                                                {student.firstName} {student.lastName}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <IdCardIcon className="size-4"/>
                                                                {student.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {selectedStudentIds.length > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            Zaznaczono: {selectedStudentIds.length} {getStudentWord(selectedStudentIds.length)}
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedStudentIds([])
                                                setAddStudentSearch("")
                                            }}
                                        >
                                            Anuluj
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={handleAddStudents}
                                        disabled={selectedStudentIds.length === 0}
                                    >
                                        Dodaj ({selectedStudentIds.length})
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {singleGroup?.students.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                            W tej grupie nie ma żadnych uczniów
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Imię i nazwisko</TableHead>
                                    <TableHead>Nr indeksu</TableHead>
                                    <TableHead className="text-right">Usuń z grupy</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {singleGroup?.students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.firstName} {student.lastName}
                                        </TableCell>
                                        <TableCell>{student.username}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeStudentFromGroup([student.id])}
                                            >
                                                <Trash className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Page