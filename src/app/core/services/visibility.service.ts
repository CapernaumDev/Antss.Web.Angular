import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { combineLatest, concat, defer, distinctUntilChanged, fromEvent, map, mergeMap, Observable, of } from 'rxjs';

@Injectable()
export class VisibilityService {
  private pageVisible$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) document: any) {
    this.pageVisible$ = concat(
      defer(() => of(!document.hidden)),
      fromEvent(document, 'visibilitychange').pipe(map((e) => !document.hidden))
    );
  }

  elementInSight(element: ElementRef): Observable<boolean> {
    const elementVisible$ = Observable.create((observer: any) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observer.next(entries);
      });

      intersectionObserver.observe(element.nativeElement);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      mergeMap((entries: any) => entries),
      map((entry: any) => entry.isIntersecting),
      distinctUntilChanged()
    );

    const elementInSight$ = combineLatest(
      this.pageVisible$,
      elementVisible$,
      (pageVisible, elementVisible) => pageVisible && elementVisible
    ).pipe(distinctUntilChanged());

    return elementInSight$ as Observable<boolean>;
  }
}
