import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { DetallePedido, Pedido } from '../../../shared/models/pedido.model';

@Component({
  selector: 'app-checkout-identificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout-identificacion.html',
  styleUrl: './checkout-identificacion.css',
})
export class CheckoutIdentificacion {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);
  carritoService = inject(CarritoService);

  pedidoForm: FormGroup = this.fb.group({
    clienteNombre: ['', [Validators.required, Validators.minLength(3)]],
    celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
  });

  confirmarPedido() {
    if (this.pedidoForm.invalid || this.carritoService.items().length === 0)
      return;

    // PASO 1: Sincronizar el carrito local con la BD del Backend
    this.carritoService.sincronizarCarritoConBackend().subscribe({
      next: () => {
        // Mapeo de CarritoItem a DetallePedidoDTO para el Backend
        const detalles: DetallePedido[] = this.carritoService
          .items()
          .map((item) => ({
            productoId: item.producto.id!,
            productoNombre: item.producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
            subtotal: item.subtotal,
          }));

        const nuevoPedido: Pedido = {
          ...this.pedidoForm.value,
          total: this.carritoService.total(),
          detalles: detalles,
        };

        this.pedidoService.registrarPedido(nuevoPedido).subscribe({
          next: (pedidoCreado) => {
            // Navegación con el ID generado por Spring Boot
            this.router.navigate(['/checkout/confirmacion'], {
              queryParams: { id: pedidoCreado.id },
            });
          },
          error: (err) => {
            console.error('Error al procesar la compra:', err);
            alert(
              'Ocurrió un error al procesar tu pedido. Intenta nuevamente.',
            );
          },
        });
      },
      error: (err: any) => {
        console.error('Error al sincronizar el carrito:', err);
        alert(
          'No se pudo sincronizar tu carrito con el servidor. Intenta de nuevo.',
        );
      },
    });
  }
}
