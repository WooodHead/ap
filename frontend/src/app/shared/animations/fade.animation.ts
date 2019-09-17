import { animate, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('fade', [
  transition(
    ':enter',
    [
      style({ opacity: 0 }),
      animate('{{ duration }}ms ease-in-out', style({ opacity: 1 })),
    ],
    {
      params: {
        duration: 400,
      },
    },
  ),
  transition(
    ':leave',
    [
      animate('{{ duration }}ms ease-in-out', style({ opacity: 0 })),
    ],
    {
      params: {
        duration: 400,
      },
    },
  ),
]);
