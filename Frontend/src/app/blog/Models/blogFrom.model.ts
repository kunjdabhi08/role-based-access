import { FormControl } from "@angular/forms"



export type BlogFormModel = {
    blogId?:  FormControl<number>;
    title: FormControl<string>,
    content: FormControl<string>,
    isPremium: FormControl<boolean>,
    authorId: FormControl<number>,
}