import { TestBed } from '@angular/core/testing';
import type { i18n } from 'i18next';
import { WindowRef } from '../../../window/window-ref';
import { I18nConfig } from '../../config/i18n-config';
import { I18NEXT_INSTANCE } from '../i18next-instance';
import {
  I18nextHttpBackendClient,
  I18NEXT_HTTP_BACKEND_CLIENT,
} from './i18next-http-backend-client';
import { I18nextHttpBackendService } from './i18next-http-backend.service';

class MockWindowRef implements Partial<WindowRef> {
  isBrowser() {
    return true;
  }

  get location() {
    return {};
  }
}

const mockI18nextHttpBackendClient: I18nextHttpBackendClient = () => {};

describe('I18nextHttpBackendService', () => {
  let initializer: I18nextHttpBackendService;
  let i18next: i18n; // i18next instance
  let config: I18nConfig;
  let windowRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: I18nConfig, useValue: { i18n: {} } },
        {
          provide: WindowRef,
          useClass: MockWindowRef,
        },
        {
          provide: I18NEXT_HTTP_BACKEND_CLIENT,
          useValue: mockI18nextHttpBackendClient,
        },
      ],
    });

    initializer = TestBed.inject(I18nextHttpBackendService);
    i18next = TestBed.inject(I18NEXT_INSTANCE);
    config = TestBed.inject(I18nConfig);
    windowRef = TestBed.inject(WindowRef);
  });

  describe('initialize', () => {
    it('should set config backend.reloadInterval to false', () => {
      config.i18n = { backend: { loadPath: 'test/path' } };
      spyOn(i18next, 'init');

      const result = initializer.initialize();

      expect(result.backend?.reloadInterval).toBe(false);
    });

    it('should set config backend.request to use a custom http client', () => {
      config.i18n = { backend: { loadPath: 'test/path' } };
      spyOn(i18next, 'init');

      const result = initializer.initialize();

      expect(result.backend?.request).toBe(mockI18nextHttpBackendClient);
    });

    describe('when config i18n.backend.loadPath is set', () => {
      describe('in non-server platform', () => {
        beforeEach(() => {
          spyOn(windowRef, 'isBrowser').and.returnValue(true);
        });

        describe('with relative path starting with "./"', () => {
          const path = './path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });

        describe('with relative path starting with "/"', () => {
          const path = '/path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });

        describe('with relative path starting with ""', () => {
          const path = 'path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });

        describe('with absolute path starting with "http://"', () => {
          const path = 'http://path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });

        describe('with absolute path starting with "https://"', () => {
          const path = 'https://path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });
      });

      describe('in server platform', () => {
        const serverRequestOrigin = 'http://server.com';

        beforeEach(() => {
          spyOn(windowRef, 'isBrowser').and.returnValue(false);
          spyOnProperty(windowRef, 'location', 'get').and.returnValue({
            origin: serverRequestOrigin,
          });
        });

        describe('with relative path starting with "./"', () => {
          const path = './path';

          it('should return the original path prepended with server request origin', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe('http://server.com/path');
          });
        });

        describe('with relative path starting with "/"', () => {
          const path = '/path';

          it('should return the original path prepended with server request origin', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe('http://server.com/path');
          });
        });

        describe('with relative path starting with ""', () => {
          const path = 'path';

          it('should return the original path prepended with server request origin', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe('http://server.com/path');
          });
        });

        describe('with absolute path starting with "http://"', () => {
          const path = 'http://path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });

        describe('with absolute path starting with "https://"', () => {
          const path = 'https://path';

          it('should return the original path', () => {
            config.i18n = { backend: { loadPath: path } };
            const result = initializer.initialize();
            expect(result.backend?.loadPath).toBe(path);
          });
        });
      });
    });

    describe('when config i18n.backend.loadPath is not set', () => {
      it('should throw an error', () => {
        config.i18n = { backend: {} };
        spyOn(i18next, 'init');

        expect(() => initializer.initialize()).toThrowError(
          'I18nextHttpBackendService: Missing `i18n.backend.loadPath` config.'
        );
      });
    });
  });
});
