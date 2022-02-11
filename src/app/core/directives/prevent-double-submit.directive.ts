import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[preventDoubleSubmit]'
})
export class PreventDoubleSubmitDirective implements OnInit, OnDestroy {
  @Input()
  throttleTime = 500;

  @Output()
  throttledOnSubmit = new EventEmitter();

  private submissions = new Subject();
  private subscription!: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.submissions.pipe(
      throttleTime(this.throttleTime)
    ).subscribe(e => this.emitThrottledSubmission(e));
  }

  emitThrottledSubmission(e: any) {
    this.throttledOnSubmit.emit(e);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.submissions.next(event);
    
    return false;
  }
}
