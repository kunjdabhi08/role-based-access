import { Form, FormControl } from "@angular/forms"



export type signupFormModel = {
    name: FormControl<string>,
    email: FormControl<string>,
    password: FormControl<string>,
    confirmPassword: FormControl<string>,
    roleId: FormControl<number>
}