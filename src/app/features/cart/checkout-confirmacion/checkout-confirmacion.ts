import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-confirmacion.html',
  styleUrl: './checkout-confirmacion.css',
})
export class CheckoutConfirmacion implements OnInit {
  private route = inject(ActivatedRoute);
  pedidoId: string | null = null;

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.queryParamMap.get('id');
  }
}
