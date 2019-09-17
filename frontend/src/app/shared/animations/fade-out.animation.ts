import { animate, style, transition, trigger } from '@angular/animations';

export const fadeOutAnimation = trigger('fadeOut', [
  transition(':leave', [
    style({ opacity: 0 }),
    animate('400ms ease-in-out', style({ opacity: 1 })),
  ]),
]);
