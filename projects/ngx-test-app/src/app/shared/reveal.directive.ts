import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';

/**
 * Scroll-reveal: la primera vez que el elemento entra en el viewport le añade
 * la clase `reveal--in`, que dispara la animación de entrada (los estilos viven
 * en el SCSS de cada página). El host arranca con la clase `reveal` (estado
 * oculto). `appReveal` acepta un índice de escalonado (0, 1, 2…) que se traduce
 * en un retardo incremental para animar en cascada varios hermanos.
 *
 * Zoneless-safe: sólo toca clases/vars vía el DOM, no requiere detección de
 * cambios. Si no hay IntersectionObserver, revela de inmediato.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Índice de escalonado; cada unidad añade 80ms de retardo. */
  readonly appReveal = input<number | ''>('');

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const step = Number(this.appReveal()) || 0;
    if (step > 0) {
      node.style.setProperty('--dm-reveal-delay', `${step * 80}ms`);
    }

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('reveal--in');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--in');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
