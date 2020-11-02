import {
    transition,
    trigger,
    query,
    style,
    animate,
    group,
    animateChild,
    state
 } from '@angular/animations';

 export const slideDownAnimation = trigger('slideDownAnimation', [
     transition(':enter', [
          style({ transform: 'translateY(-50px)', opacity: '0%' }),
          animate('0.5s cubic-bezier(0.785000,0.135000,0.150000,0.860000)', style({ transform: 'translateY(0px)', opacity: '100%' })),
     ]),
     transition(':leave', [
          animate('0.5s cubic-bezier(0.785000,0.135000,0.150000,0.860000)', style({ transform: 'translateY(-50px)', opacity: '0%'}))
     ])
 ]);


 export const slideInAnimation =
    trigger('routeAnimations', [
         transition('Picks => *', [
               style({ position:'relative' }),
              query(':enter, :leave', 
                   style({ 
                        position: 'absolute', 
                        top: 0,
                        left: 0,
                        width: '100%' }), 
                   { optional: true }),        
              group([
                   query(':enter',[
                       style({ left: '-100%' }),
                       animate('0.5s ease-in-out', 
                       style({ left: '0%' }))
                   ], { optional: true }),
                   query(':leave', [
                       style({ left:   '0%'}),
                       animate('0.5s ease-in-out', 
                       style({ left: '100%' }))
                   ], { optional: true }),
              ])
         ]),
         transition('Games => *', [
              style({ position:'relative' }),
              query(':enter, :leave', 
                   style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%' }), 
                   { optional: true }),
               query(':leave', animateChild()),
              group([
                   query(':enter', [
                       style({ left: '100%' }), 
                       animate('0.5s ease-in-out', 
                       style({ left: '0%' }))
                   ], { optional: true }),
                   query(':leave', [
                       style({ left: '0%' }),
                       animate('0.5s ease-in-out', 
                       style({ left: '-100%' }))
                       ], { optional: true }),
               ]),
               query(':enter', animateChild())
         ])
 ]);