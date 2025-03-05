const axiosMock = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(() => axiosMock),
  defaults: {
    adapter: jest.fn(),
    transformRequest: {},
    transformResponse: {},
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    validateStatus: jest.fn(),
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
      },
      delete: {},
      get: {},
      head: {},
      post: { 'Content-Type': 'application/x-www-form-urlencoded' },
      put: { 'Content-Type': 'application/x-www-form-urlencoded' },
      patch: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  },
};

module.exports = axiosMock; 