import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PessoasComponent } from './pessoas.component';

const routes: Routes = [{ path: '', component: PessoasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoasRoutingModule { }
