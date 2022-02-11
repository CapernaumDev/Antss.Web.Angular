import { animate, keyframes, style, transition, trigger } from "@angular/animations";

export default [
    trigger('confirmationHighlight', [
      transition('*=>myActionConfirmed', animate('600ms', keyframes([
        style({ backgroundColor: 'initial', boxShadow: 'none', offset: 0 }),
        style({ backgroundColor: '#5cff4c', boxShadow: '0 0 10px #29cc19', offset: 0.01 }),
        style({ backgroundColor: 'initial', boxShadow: 'none', offset: 1 }),
      ]))),
      transition('*=>othersActionConfirmed', animate('1500ms', keyframes([
        style({ backgroundColor: 'initial', boxShadow: 'none', offset: 0, opacity: 0 }),
        style({ backgroundColor: '#6699ff', boxShadow: '0 0 10px #3366CC', opacity: 0.5, offset: 0.5 }),
        style({ backgroundColor: 'initial', boxShadow: 'none', opacity: 1, offset: 1 }),
      ]))),
      transition('*=>addedByOther', animate('1500ms', keyframes([
        style({ backgroundColor: 'initial', boxShadow: 'none', offset: 0, opacity: 0.5, transform: 'translateY(-100%)' }),
        style({ backgroundColor: '#6699ff', boxShadow: '0 0 10px #3366CC', opacity: 1, offset: 0.5, transform: 'translateY(5%)' }),
        style({ offset: 0.6, transform: 'translateY(0%)' }),
        style({ backgroundColor: 'initial', boxShadow: 'none', opacity: 1, offset: 1, transform: 'translateY(0%)' })
      ]))),
      transition('*=>addedByMe', animate('1500ms', keyframes([
        style({ backgroundColor: 'initial', boxShadow: 'none', offset: 0, opacity: 0.5, transform: 'translateY(-100%)' }),
        style({ backgroundColor: '#5cff4c', boxShadow: '0 0 10px #29cc19', opacity: 1, offset: 0.5, transform: 'translateY(5%)' }),
        style({ offset: 0.6, transform: 'translateY(0%)' }),
        style({ backgroundColor: 'initial', boxShadow: 'none', opacity: 1, offset: 1, transform: 'translateY(0%)' })
      ])))
    ])
  ]