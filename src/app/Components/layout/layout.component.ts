import { Component } from '@angular/core';
import { SharedModule } from '../../Reusable/shared/shared.module';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [SharedModule, RouterOutlet, RouterLink],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {}
