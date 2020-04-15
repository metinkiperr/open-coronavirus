import { Injectable, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Injectable()
export class PermissionsService {

    public permissionsRequested = false;
    public requiredPermissions: Array<string>;

    constructor(
        @Inject('settings') protected settings,
        protected router: Router,
        protected navCtrl: NavController
    ) {
        this.requiredPermissions = [];
    }

    async requestFirstPermission() {
        this.permissionsRequested = true;
        this.requiredPermissions = this.getRequiredPermissions();
        this.goToNextPermission();
    }

    goToNextPermissionIfPermissionsRequested() {
        if (this.permissionsRequested) {
            console.debug('Go to next permission');
            if (this.requiredPermissions.length === 0) {
                this.permissionsRequested = false;
                this.navCtrl.navigateRoot(['app/home']);
            } else {
                this.navCtrl.navigateRoot(['permissions', this.requiredPermissions.shift()]);
            }
        }
    }

    goToNextPermission() {
        if (this.requiredPermissions.length === 0) {
            this.navCtrl.navigateRoot(['app/home']);
        } else {
            this.navCtrl.navigateRoot(['permissions', this.requiredPermissions.shift()]);
        }
    }

    getRequiredPermissions(): Array<string> {
        const requiredPermissions = [];

        for (const type in this.settings.enabled) {
            if (this.settings.enabled[type]) {
                requiredPermissions.push(type);
            }
        }

        return requiredPermissions;
    }

}
