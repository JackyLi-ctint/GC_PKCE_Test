/**
 * Genesys Cloud Embeddable Framework — framework.js
 *
 * SETUP:
 *   1. Fill in your OAuth Client ID for your region below (clientIds section).
 *      Leave unused regions as empty string "".
 *
 * DEVELOPMENT:  serve with `npx serve .` and use the Dev iframe URL.
 * PRODUCTION:   upload this file in GC Admin > Integrations > Embeddable Framework
 *               (Add a Private Genesys Cloud Embeddable Framework integration).
 *
 * Docs: https://developer.genesys.cloud/platform/embeddable-framework/
 */

window.Framework = {

  // ── Configuration ────────────────────────────────────────────────────────────

  config: {

    // Unique name shown in the GC client for this integration.
    name: 'GC PKCE Tester',

    // OAuth Client IDs per region — needed only if you use getAuthToken.
    // Fill in the Client ID for your region; leave others blank.
    clientIds: {
      'mypurecloud.com':        '', // US East – Virginia       (us-east-1)
      'use2.us-gov-pure.cloud': '', // US East 2 – Ohio GovCloud (us-east-2)
      'usw2.pure.cloud':        '', // US West – Oregon          (us-west-2)
      'cac1.pure.cloud':        '', // Canada – Central          (ca-central-1)
      'mypurecloud.ie':         '', // Europe – Ireland          (eu-west-1)
      'euw2.pure.cloud':        '', // Europe – London           (eu-west-2)
      'mypurecloud.de':         '', // Europe – Frankfurt        (eu-central-1)
      'euc2.pure.cloud':        '', // Europe – Zurich           (eu-central-2)
      'aps1.pure.cloud':        '', // Asia Pacific – Mumbai     (ap-south-1)
      'mypurecloud.jp':         '', // Asia Pacific – Tokyo      (ap-northeast-1)
      'apne2.pure.cloud':       '', // Asia Pacific – Seoul      (ap-northeast-2)
      'apne3.pure.cloud':       '', // Asia Pacific – Osaka      (ap-northeast-3)
      'mypurecloud.com.au':     '', // Asia Pacific – Sydney     (ap-southeast-2)
      'apse1.pure.cloud':       '', // Asia Pacific – Singapore  (ap-southeast-1)
      'sae1.pure.cloud':        '', // South America – São Paulo (sa-east-1)
      'mec1.pure.cloud':        '', // Middle East – UAE         (me-central-1)
    },

    // UI settings — set to true/false to enable/disable features.
    settings: {
      // clickToDial: true,
      // sendData: true,
    },

    // Links shown in the Help menu inside the embedded client.
    helpLinks: {},

    // Attributes displayed on interaction cards in the client.
    displayObject: {
      columns: [
        { type: 'PHONE_NUMBER', label: 'Phone Number' },
        { type: 'NAME',         label: 'Name'         },
      ],
    },

    // Return the locale to use in the embedded client.
    getUserLanguage: function (callback) {
      callback(navigator.language || 'en');
    },
  },

  // ── Required method — called after the framework.js file finishes loading ───

  initialSetup: function () {
    console.log('[Framework] initialSetup — embedded agent ready');
  },

  // ── Optional methods — implement as needed ───────────────────────────────────

  /**
   * Called when GC wants to screen-pop (e.g. inbound call).
   * Use searchString / interaction to navigate your app.
   */
  screenPop: function (searchString, interaction) {
    console.log('[Framework] screenPop', searchString, interaction);
  },

  /**
   * Called when an agent saves an interaction log.
   * Call onSuccess() or onFailure(errorMessage) when done.
   */
  processCallLog: function (callLog, interaction, eventName, onSuccess, onFailure) {
    console.log('[Framework] processCallLog', eventName, callLog);
    if (typeof onSuccess === 'function') onSuccess();
  },

  /**
   * Called when an agent opens an existing interaction log.
   */
  openCallLog: function (callLog) {
    console.log('[Framework] openCallLog', callLog);
  },

  /**
   * Called when an agent searches for a contact before dialling/transferring.
   * Call onSuccess(results) where results is an array of contact objects,
   * or onFailure(errorMessage) on error.
   */
  contactSearch: function (searchValue, onSuccess, onFailure) {
    console.log('[Framework] contactSearch', searchValue);
    if (typeof onSuccess === 'function') onSuccess([]);
  },

};
