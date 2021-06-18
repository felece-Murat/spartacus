import { Component, NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RoutingService } from '../../../routing/facade/routing.service';
import { AuthFlowRoutesService } from './auth-flow-routes.service';
import { AuthRedirectStorageService } from './auth-redirect-storage.service';
import { AuthRedirectService } from './auth-redirect.service';

class MockRoutingService implements Partial<RoutingService> {
  goByUrl = () => Promise.resolve(true);
}

class MockAuthFlowRoutesService implements Partial<AuthFlowRoutesService> {
  isAuthFlow(url: string): boolean {
    return url === '/login';
  }
}

@Component({ selector: 'cx-test-component', template: 'test' })
export class TestComponent {}

describe('AuthRedirectService', () => {
  let service: AuthRedirectService;
  let routingService: RoutingService;
  let router: Router;
  let zone: NgZone;
  let authRedirectStorageService: AuthRedirectStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthRedirectService,
        AuthRedirectStorageService,
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        { provide: AuthFlowRoutesService, useClass: MockAuthFlowRoutesService },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: TestComponent },

          { path: 'some/url', redirectTo: 'some/url/after/redirects' },
          { path: 'some/url/after/redirects', component: TestComponent },
          { path: 'other/url', component: TestComponent },
        ]),
      ],
    });
    service = TestBed.inject(AuthRedirectService);
    routingService = TestBed.inject(RoutingService);
    router = TestBed.inject(Router);
    zone = TestBed.inject(NgZone);

    authRedirectStorageService = TestBed.inject(AuthRedirectStorageService);
    spyOn(authRedirectStorageService, 'setRedirectUrl').and.callThrough();
    spyOn(authRedirectStorageService, 'getRedirectUrl').and.callThrough();
  });

  describe('redirect', () => {
    it('should redirect by to the saved redirect URL', fakeAsync(() => {
      authRedirectStorageService.setRedirectUrl('/redirect/url');
      spyOn(routingService, 'goByUrl').and.returnValue(Promise.resolve(true));
      service.redirect();
      expect(authRedirectStorageService.getRedirectUrl).toHaveBeenCalled();
      expect(routingService.goByUrl).toHaveBeenCalledWith('/redirect/url');
      tick();
      expect(routingService.goByUrl).toHaveBeenCalledTimes(1);
    }));

    it('should redirect to home page when there was no saved redirect URL', fakeAsync(() => {
      authRedirectStorageService.setRedirectUrl(undefined);
      spyOn(routingService, 'goByUrl').and.returnValue(Promise.resolve(true));
      service.redirect();
      expect(authRedirectStorageService.getRedirectUrl).toHaveBeenCalled();
      expect(routingService.goByUrl).toHaveBeenCalledWith('/');
      tick();
      expect(routingService.goByUrl).toHaveBeenCalledTimes(1);
    }));

    it('should redirect to home page when the navigation to the saved redirect URL was unsuccessful', fakeAsync(() => {
      authRedirectStorageService.setRedirectUrl('/redirect/url');
      const goByUrlSpy: jasmine.Spy = spyOn(
        routingService,
        'goByUrl'
      ).and.returnValue(Promise.resolve(false));
      service.redirect();
      expect(authRedirectStorageService.getRedirectUrl).toHaveBeenCalled();
      expect(goByUrlSpy.calls.argsFor(0)).toEqual(['/redirect/url']);
      tick();
      expect(goByUrlSpy.calls.argsFor(1)).toEqual(['/']);
    }));

    it('should clear saved redirect URL', () => {
      service.redirect();
      expect(authRedirectStorageService.setRedirectUrl).toHaveBeenCalledWith(
        undefined
      );
    });
  });

  it('should save redirect url on every navigation end', async () => {
    await zone.run(() => router.navigateByUrl('/some/url'));
    expect(authRedirectStorageService.setRedirectUrl).toHaveBeenCalledWith(
      '/some/url/after/redirects'
    );

    await zone.run(() => router.navigateByUrl('/other/url'));
    expect(authRedirectStorageService.setRedirectUrl).toHaveBeenCalledWith(
      '/other/url'
    );
  });

  it('should NOT save redirect url on navigation end, when the URL is part of the auth flow', async () => {
    await zone.run(() => router.navigateByUrl('/login'));
    expect(authRedirectStorageService.setRedirectUrl).not.toHaveBeenCalledWith(
      '/login'
    );
    await zone.run(() => router.navigateByUrl('/other/url'));

    expect(authRedirectStorageService.setRedirectUrl).toHaveBeenCalledWith(
      '/other/url'
    );
  });

  describe('saveCurrentNavigationUrl', () => {
    it('should save the url of the current navigation', () => {
      spyOn(router, 'getCurrentNavigation').and.returnValue(<Navigation>{
        finalUrl: router.parseUrl('/anticipated/url'),
      });
      service.saveCurrentNavigationUrl();
      expect(authRedirectStorageService.setRedirectUrl).toHaveBeenCalledWith(
        '/anticipated/url'
      );
    });

    it('should NOT save the url of the current navigation if it is a part of the auth flow', () => {
      spyOn(router, 'getCurrentNavigation').and.returnValue(<Navigation>{
        initialUrl: router.parseUrl('/login'),
        finalUrl: router.parseUrl('/login'),
      });
      service.saveCurrentNavigationUrl();
      expect(authRedirectStorageService.setRedirectUrl).not.toHaveBeenCalled();
    });

    it('should NOT save the url when there is no pending navigation', () => {
      spyOn(router, 'getCurrentNavigation').and.returnValue(null);
      service.saveCurrentNavigationUrl();
      expect(authRedirectStorageService.setRedirectUrl).not.toHaveBeenCalled();
    });

    it('should NOT save the url when finalUrl was not yet determined for the current navigation (before RouteRecognized event happened)', () => {
      spyOn(router, 'getCurrentNavigation').and.returnValue(<Navigation>{
        initialUrl: router.parseUrl('/login'),
        finalUrl: undefined,
      });
      service.saveCurrentNavigationUrl();
      expect(authRedirectStorageService.setRedirectUrl).not.toHaveBeenCalled();
    });
  });

  // deprecated method:
  describe('reportAuthGuard', () => {
    it('should call saveCurrentNavigationUrl()', () => {
      spyOn(service, 'saveCurrentNavigationUrl');
      service.reportAuthGuard();
      expect(service.saveCurrentNavigationUrl).toHaveBeenCalled();
    });
  });
});
