import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StringTemplate } from '@spartacus/core';
import { MARKER_HEADER_CPQ_CONFIGURATOR } from '../root/interceptor/cpq-configurator-rest.interceptor';
import { CpqConfiguratorEndpointConfig } from './cpq-configurator-endpoint.config';

@Injectable({ providedIn: 'root' })
export class CpqConfiguratorEndpointService {
  constructor(protected config: CpqConfiguratorEndpointConfig) {}

  /**
   * header attribute to a mark cpq related requests, so that they can be picked up by the {@link CpqConfiguratorRestInterceptor}
   */
  readonly CPQ_MARKER_HEADER = {
    headers: new HttpHeaders({
      [MARKER_HEADER_CPQ_CONFIGURATOR]: 'x',
    }),
  };

  buildUrl(
    endpointName: string,
    urlParams?: Object,
    queryParams?: [{ name: string; value: string }]
  ): string {
    const endpoint = this.config.backend.cpq.endpoints[endpointName];
    if (!endpoint) {
      console.warn(
        `${endpointName} endpoint configuration missing for cpq backend, please provide it via key: "backend.cpq.endpoints.${endpointName}"`
      );
    }
    let url = this.config.backend.cpq.prefix + endpoint;
    url = urlParams ? StringTemplate.resolve(url, urlParams) : url;
    url = queryParams ? this.appendQueryParameters(url, queryParams) : url;
    return url;
  }

  protected appendQueryParameters(
    url: string,
    parameters: [{ name: string; value: string }]
  ): string {
    let urlWithParameters = url + '?';
    parameters.forEach((param, idx: number) => {
      urlWithParameters = idx > 0 ? urlWithParameters + '&' : urlWithParameters;
      urlWithParameters = `${urlWithParameters}${param.name}=${param.value}`;
    });
    return urlWithParameters;
  }
}
