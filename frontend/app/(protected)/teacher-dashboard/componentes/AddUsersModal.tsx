import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {usersFormSchema} from "@/form_schemas/form_schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ROLES} from "@/lib/roles";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useUsersStore} from "@/store/useUsersStore";

interface AddUsersModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const AddUsersModal = ({open, onOpenChange}: AddUsersModalProps) => {

    const {addUsers} = useUsersStore()
    const form = useForm<z.infer<typeof usersFormSchema>>({
        resolver: zodResolver(usersFormSchema),
        defaultValues: {
            users: [{username: "", role: ROLES.STUDENT}]
        }
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "users"
    })

    const onSubmit = async (values: z.infer<typeof usersFormSchema>) => {
        try {
            addUsers(values)
            onOpenChange(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-neutral-100">
                <DialogHeader>
                    <DialogTitle>Dodaj użytkowników</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {fields.map((field, index) => (
                            <div key={field.id} className=" p-3 rounded-md space-y-3 bg-neutral-50 shadow-custom"
                            >
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.username`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nazwa użytkownika</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Indeks ucznia/nauczyciela" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`users.${index}.role`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Rola</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Wybierz rolę"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={ROLES.STUDENT}>Uczeń</SelectItem>
                                                    <SelectItem value={ROLES.TEACHER}>Nauczyciel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => remove(index)}
                                    >
                                        Usuń
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({username: "", role:ROLES.STUDENT})}
                        >
                            Dodaj kolejnego
                        </Button>

                        <DialogFooter>
                            <Button type="submit">Zapisz</Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default AddUsersModal
