import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'detallepedido', loadChildren: './detallepedido/detallepedido.module#DetallepedidoPageModule' },
  { path: 'nuevopedido', loadChildren: './nuevopedido/nuevopedido.module#NuevopedidoPageModule' },
  { path: 'listaproductos', loadChildren: './listaproductos/listaproductos.module#ListaproductosPageModule' },
  { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'ruta', loadChildren: './ruta/ruta.module#RutaPageModule' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
