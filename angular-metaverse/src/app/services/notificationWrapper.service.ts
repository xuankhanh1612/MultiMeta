import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NotificationWrapperService {
    constructor(private toastr: ToastrService) {
    }

    success(message: string = 'Success') {
        this.toastr.success( message);
    }

    infor(message: string) {
        this.toastr.info( message);
    }

    error(message: string = 'Failed') {
        this.toastr.error(message);
    }

    warning(message: string = 'Warning') {
        this.toastr.warning(message);
    }
}
