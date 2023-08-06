import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { PlayMetaComponent } from './pages/play-meta-demo/play-meta.component';
import { SplashComponent } from './pages/splash/splash.component';
import { HomeComponent } from './pages/home/home.component';
import { PlayGuestComponent } from './pages/play-guest/play-guest.component';

const routes: Routes = [
    { path: '', redirectTo: '/splash', pathMatch: 'full' },
    { path: 'splash', component: SplashComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    // { path: 'home/:meta_name', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'guest', component: PlayGuestComponent },
    {
        path: 'play',
        component: PlayMetaComponent,
        children: [],
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
