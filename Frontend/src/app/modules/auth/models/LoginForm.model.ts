import { FormControl } from "@angular/forms"


export type LoginFormModel = {
    email: FormControl<string>,
    password: FormControl<string>
}