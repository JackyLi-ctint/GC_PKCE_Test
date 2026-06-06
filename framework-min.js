/**
 * MINIMUM framework.js for support troubleshooting
 * Per: https://developer.genesys.cloud/platform/embeddable-framework/embeddable-framework-support
 *
 * Upload THIS file to GC Admin > Integrations > Embeddable Framework (replace the main one temporarily).
 * If the embedded agent loads with this file, the issue is in the main framework.js.
 * If it still hangs, the issue is in GC infrastructure / org settings — contact Genesys Support.
 */
window.Framework = {
  config: {
    name: 'GC Min Test',
    clientIds: {
      'mypurecloud.com.au': 'dd2e2bfd-0a83-490b-b333-74c118ecead3',
    },
    settings: {
      dedicatedLoginWindow: true,
    },
  },
  initialSetup: function () {
    console.log('[FrameworkMin] initialSetup called — framework loaded successfully');
  },
};
