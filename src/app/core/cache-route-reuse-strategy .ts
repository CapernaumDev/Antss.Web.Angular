import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return this.storedRouteHandles.has(this.getPath(route));
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        let shouldDetach = false;
        if (route.routeConfig?.data) {
            shouldDetach = route.routeConfig.data.reuse;
        }

        return shouldDetach;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig !== null && route.routeConfig.path !== null) {
            return route.routeConfig.path || '';
      }

        return '';
    }
}
