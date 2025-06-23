import { Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { RegisterComponent } from './Components/auth/register/register.component';
import { SettingComponent } from './Components/setting/setting.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { CustomerComponent } from './Components/customer/customer.component';
import { ThreeDViewerComponent } from './three-dviewer/three-dviewer.component';
import { CameraFaceDetectComponent } from './camera-detect-viewer/camera-detect-viewer.component';
import { FaceOverlayComponent } from './face-overlay/face-overlay.component';
import { GlassItemComponent } from './glass-item/glass-item.component';
import { GlassesViewerComponent } from './glasses-viewer/glasses-viewer.component';

export const routes: Routes = [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'setting-page', component: SettingComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'customer-page', component: CustomerComponent },
        { path: 'three', component: ThreeDViewerComponent},
        { path: 'detect', component: CameraFaceDetectComponent},
        { path: 'glass', component: FaceOverlayComponent},
        { path: 'item', component: GlassItemComponent},
        { path: 'viewer', component: GlassesViewerComponent},
        { path: '**', redirectTo: 'login' }
      
];
