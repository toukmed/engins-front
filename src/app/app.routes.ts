import { Routes } from '@angular/router';
import { Users } from './components/users/users';
import { Demands } from './components/demands/demands';
import { Home } from './components/home/home';
import { Equipements } from './components/equipements/equipements';
import { DetailEquipement } from './components/equipements/detail-equipement/detail-equipement';
import { Layout } from './components/layout/layout';
import { Login } from './components/login/login';
import { Registration } from './components/login/registration';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Registration },
    { path: '', component: Layout, canActivate: [authGuard], children: [
        { path: 'equipements', component: Equipements  },
        { path: 'equipements/:id', component: DetailEquipement },
        { path: 'home', component: Home  },
        { path: 'users', component: Users  },
        { path: 'demands', component: Demands  },
    ] },
];
